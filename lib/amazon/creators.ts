import "server-only";
import { getAccessToken, authorizationHeader, readCredentials, AmazonConfigError } from "./token";
import { resolveMarketplace, partnerTagFor } from "./marketplaces";
import { normalizeItem } from "./normalize";
import { rateLimit } from "./ratelimit";
import type { AmazonProduct, AmazonSearchResult } from "./types";

/**
 * Server-only Amazon Creators API service.
 *
 * Calls the live Creators API (https://creatorsapi.amazon/catalog/v1/*) directly
 * with native fetch — no SDK, no extra deps — replicating the official SDK's
 * exact protocol. Handles auth, per-marketplace partner tags, a short response
 * cache (Amazon price data is time-sensitive) and a global rate guard.
 */

const API_BASE = "https://creatorsapi.amazon/catalog/v1";

// Conservative default resources — widely available. Reviews are opt-in because
// an account not approved for them can cause the whole request to fail.
const BASE_RESOURCES = [
  "images.primary.large",
  "images.primary.medium",
  "itemInfo.title",
  "itemInfo.byLineInfo",
  "offersV2.listings.price",
  "offersV2.listings.availability",
  "offersV2.listings.condition",
  "offersV2.listings.isBuyBoxWinner",
];
const REVIEW_RESOURCES = ["customerReviews.count", "customerReviews.starRating"];

export class AmazonApiError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "AmazonApiError";
    this.status = status;
  }
}
export { AmazonConfigError };

/* ---------------- response cache (short TTL) ---------------- */
type CacheEntry = { data: unknown; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const SEARCH_TTL_MS = 15 * 60 * 1000; // 15 min
const ITEM_TTL_MS = 30 * 60 * 1000; // 30 min

function getCache<T>(key: string): T | null {
  const e = cache.get(key);
  if (e && Date.now() < e.expiresAt) return e.data as T;
  if (e) cache.delete(key);
  return null;
}
function setCache(key: string, data: unknown, ttl: number) {
  if (cache.size > 2000) cache.clear();
  cache.set(key, { data, expiresAt: Date.now() + ttl });
}

/* ---------------- low-level request ---------------- */
async function callApi(path: string, marketplaceDomain: string, body: Record<string, unknown>) {
  // Global guard: cap outbound Amazon calls per instance/minute.
  const guard = rateLimit("amazon:outbound", 50, 60_000);
  if (!guard.ok) throw new AmazonApiError("Amazon API rate limit reached, please retry shortly.", 429);

  const { version } = readCredentials();
  const token = await getAccessToken();

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-marketplace": marketplaceDomain,
        Authorization: authorizationHeader(token, version),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new AmazonApiError("Could not reach the Amazon Creators API.", 504);
  }

  const text = await res.text();
  let json: unknown = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON error body */ }

  if (!res.ok) {
    const errMsg = firstErrorMessage(json) || `Amazon API error (${res.status}).`;
    // 401/403 usually mean credential/authorization problems.
    const status = res.status === 401 || res.status === 403 ? res.status : 502;
    throw new AmazonApiError(errMsg, status);
  }
  return json as Record<string, unknown>;
}

function firstErrorMessage(json: unknown): string | null {
  const errs = json && typeof json === "object" ? (json as Record<string, unknown>).errors : null;
  if (Array.isArray(errs) && errs.length) {
    const e = errs[0] as Record<string, unknown>;
    return (typeof e.message === "string" && e.message) || (typeof e.code === "string" && e.code) || null;
  }
  return null;
}

/* ---------------- public service ---------------- */

export type SearchOptions = {
  keyword: string;
  marketplace?: string; // app country code
  page?: number;
  itemCount?: number;
  searchIndex?: string;
  sortBy?: string;
  includeReviews?: boolean;
};

export async function searchAmazonProducts(opts: SearchOptions): Promise<AmazonSearchResult> {
  const keyword = (opts.keyword || "").trim();
  if (!keyword) throw new AmazonApiError("Please enter a search term.", 400);

  const mkt = resolveMarketplace(opts.marketplace);
  const partnerTag = partnerTagFor(mkt.code);
  if (!partnerTag) {
    throw new AmazonConfigError(`No Partner Tag configured for ${mkt.name}. Set ${mkt.partnerTagEnv}.`);
  }

  const page = Math.min(Math.max(opts.page || 1, 1), 10);
  const itemCount = Math.min(Math.max(opts.itemCount || 10, 1), 10);
  const resources = opts.includeReviews ? [...BASE_RESOURCES, ...REVIEW_RESOURCES] : BASE_RESOURCES;

  const cacheKey = `search:${mkt.code}:${page}:${itemCount}:${opts.searchIndex || ""}:${opts.sortBy || ""}:${keyword.toLowerCase()}`;
  const hit = getCache<AmazonSearchResult>(cacheKey);
  if (hit) return hit;

  const body: Record<string, unknown> = {
    partnerTag,
    keywords: keyword,
    itemCount,
    itemPage: page,
    resources,
  };
  if (opts.searchIndex) body.searchIndex = opts.searchIndex;
  if (opts.sortBy) body.sortBy = opts.sortBy;

  const json = await callApi("/searchItems", mkt.domain, body);
  const searchResult = (json.searchResult || {}) as Record<string, unknown>;
  const rawItems = Array.isArray(searchResult.items) ? (searchResult.items as unknown[]) : [];
  const items = rawItems
    .map((it) => normalizeItem(it, mkt.code))
    .filter((p): p is AmazonProduct => !!p);

  const result: AmazonSearchResult = {
    items,
    totalResultCount:
      typeof searchResult.totalResultCount === "number" ? searchResult.totalResultCount : null,
    marketplace: mkt.code,
    page,
  };
  setCache(cacheKey, result, SEARCH_TTL_MS);
  return result;
}

export async function getAmazonItems(asins: string[], marketplace?: string): Promise<AmazonProduct[]> {
  const ids = asins.map((a) => a.trim().toUpperCase()).filter((a) => /^[A-Z0-9]{10}$/.test(a));
  if (!ids.length) throw new AmazonApiError("Provide at least one valid 10-character ASIN.", 400);

  const mkt = resolveMarketplace(marketplace);
  const partnerTag = partnerTagFor(mkt.code);
  if (!partnerTag) {
    throw new AmazonConfigError(`No Partner Tag configured for ${mkt.name}. Set ${mkt.partnerTagEnv}.`);
  }

  const cacheKey = `items:${mkt.code}:${ids.slice().sort().join(",")}`;
  const hit = getCache<AmazonProduct[]>(cacheKey);
  if (hit) return hit;

  const json = await callApi("/getItems", mkt.domain, {
    partnerTag,
    itemIds: ids,
    resources: BASE_RESOURCES,
  });
  const itemsResult = (json.itemsResult || {}) as Record<string, unknown>;
  const rawItems = Array.isArray(itemsResult.items) ? (itemsResult.items as unknown[]) : [];
  const items = rawItems
    .map((it) => normalizeItem(it, mkt.code))
    .filter((p): p is AmazonProduct => !!p);

  setCache(cacheKey, items, ITEM_TTL_MS);
  return items;
}

export async function getAmazonItem(asin: string, marketplace?: string): Promise<AmazonProduct | null> {
  const items = await getAmazonItems([asin], marketplace);
  return items[0] || null;
}
