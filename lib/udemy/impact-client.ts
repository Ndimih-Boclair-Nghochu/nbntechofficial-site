import "server-only";

import { getImpactAuth, type UdemySyncConfig } from "@/lib/udemy/config";
import type { RawCatalogItem } from "@/lib/udemy/scoring";

/**
 * Impact.com Media-Partner Catalog API client (server-only).
 *
 * Verified endpoint (Impact Integrations Hub, publisher reference, v12):
 *   GET https://api.impact.com/Mediapartners/{AccountSID}/Catalogs/{CatalogId}/Items
 *   Auth: HTTP Basic  (AccountSID : AuthToken)      Accept: application/json
 *
 * We paginate with retry/backoff and a request timeout, and NEVER load the whole
 * catalogue into memory — items are yielded one page at a time. No endpoint is
 * invented; if a capability isn't configured we fail loudly with a clear message.
 */

const API_BASE = "https://api.impact.com";
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_ATTEMPTS = 4;

export class ImpactConfigError extends Error {}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Fetch with timeout + exponential backoff on 429/5xx/network errors. */
async function fetchWithRetry(url: string, headers: Record<string, string>): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, { headers, signal: controller.signal, cache: "no-store" });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        const retryAfter = Number(res.headers.get("retry-after"));
        const backoff = Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : Math.min(15_000, 2 ** attempt * 500) + Math.random() * 300;
        if (attempt < MAX_ATTEMPTS) {
          await sleep(backoff);
          continue;
        }
      }
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      if (attempt < MAX_ATTEMPTS) {
        await sleep(Math.min(15_000, 2 ** attempt * 500) + Math.random() * 300);
        continue;
      }
    }
  }
  throw new Error(`Impact request failed after ${MAX_ATTEMPTS} attempts: ${String(lastErr)}`);
}

/** Impact JSON envelopes vary; pull the items array + next-page pointer defensively. */
function parseEnvelope(body: unknown): { items: RawCatalogItem[]; nextUri: string | null } {
  const obj = (body ?? {}) as Record<string, unknown>;
  const itemsRaw =
    (Array.isArray(obj.Items) && obj.Items) ||
    (Array.isArray(obj.CatalogItems) && obj.CatalogItems) ||
    (Array.isArray((obj.Items as Record<string, unknown>)?.Item) &&
      ((obj.Items as Record<string, unknown>).Item as unknown[])) ||
    [];
  const items = (itemsRaw as unknown[]).filter(
    (x): x is RawCatalogItem => typeof x === "object" && x != null,
  );
  const next = obj["@nextpageuri"] ?? obj.NextPageUri ?? obj["@next"] ?? null;
  return { items, nextUri: typeof next === "string" && next.trim() ? next.trim() : null };
}

/**
 * Stream Udemy catalogue items page by page (bounded by cfg.maxPages). Yields one
 * page (array) at a time so the caller filters/scores incrementally without ever
 * holding the full catalogue.
 */
export async function* streamCatalogItems(
  cfg: UdemySyncConfig,
): AsyncGenerator<RawCatalogItem[], void, unknown> {
  const auth = getImpactAuth();
  if (!auth) throw new ImpactConfigError("IMPACT_ACCOUNT_SID / IMPACT_AUTH_TOKEN are not set.");
  if (!cfg.catalogId) throw new ImpactConfigError("IMPACT_UDEMY_CATALOG_ID is not set.");

  const basic = Buffer.from(`${auth.accountSid}:${auth.authToken}`).toString("base64");
  const headers = { Authorization: `Basic ${basic}`, Accept: "application/json" };

  let uri: string =
    `/Mediapartners/${encodeURIComponent(auth.accountSid)}` +
    `/Catalogs/${encodeURIComponent(cfg.catalogId)}/Items?Page=1&PageSize=${cfg.pageSize}`;

  for (let page = 0; page < cfg.maxPages; page++) {
    const res = await fetchWithRetry(`${API_BASE}${uri}`, headers);
    if (res.status === 401 || res.status === 403) {
      throw new ImpactConfigError(`Impact auth/permission error (HTTP ${res.status}). Check credentials and Udemy catalogue access.`);
    }
    if (!res.ok) throw new Error(`Impact catalog request returned HTTP ${res.status}`);

    const { items, nextUri } = parseEnvelope(await res.json());
    if (items.length) yield items;

    if (!nextUri || items.length === 0) return; // no more pages
    // nextUri may be absolute or relative; normalize to a path for the next call.
    uri = nextUri.startsWith("http") ? nextUri.replace(API_BASE, "") : nextUri;
  }
}
