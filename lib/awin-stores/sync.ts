import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  AWIN_STORES,
  getAwinAffid,
  getAwinStoreConfig,
  awinStoreAvailability,
  AWIN_STORE_TAG,
} from "./config";
import {
  normalizeShopifyProduct,
  selectStoreProducts,
  storeProductSlug,
  type ShopifyProduct,
  type StoreConfig,
  type StoreProduct,
} from "./shopify";

export type AwinStoreSummary = {
  ok: boolean;
  dryRun: boolean;
  stores: { host: string; fetched: number; selected: number }[];
  inserted: number;
  updated: number;
  deactivated: number;
  errors: string[];
  finishedAt: string;
};

const REQUEST_TIMEOUT_MS = 25_000;
const UA = "Mozilla/5.0 (compatible; NBNMarketBot/1.0; +https://www.ndimihboclair.com)";

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: controller.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Fetch a store's whole catalogue via Shopify products.json (bounded pages). */
async function fetchStoreProducts(store: StoreConfig, affid: string, maxPages: number): Promise<StoreProduct[]> {
  const out: StoreProduct[] = [];
  // Scope to a single collection when configured, else the whole catalogue.
  const basePath = store.collection
    ? `https://${store.host}/collections/${store.collection}/products.json`
    : `https://${store.host}/products.json`;
  for (let page = 1; page <= maxPages; page++) {
    const body = (await fetchJson(`${basePath}?limit=250&page=${page}`)) as { products?: ShopifyProduct[] };
    const products = body?.products || [];
    if (products.length === 0) break;
    for (const p of products) {
      const n = normalizeShopifyProduct(p, store, affid);
      if (n) out.push(n);
    }
    if (products.length < 250) break; // last page
  }
  return out;
}

function toProductData(p: StoreProduct): Prisma.MarketProductUncheckedCreateInput {
  return {
    name: p.name,
    slug: storeProductSlug(p.externalId.split(":")[0], p.externalId.split(":")[1]),
    brand: p.brand,
    category: p.category,
    price: p.price,
    currency: p.currency,
    imageUrl: p.image,
    imageAlt: p.name,
    gallery: [],
    shortDescription: p.description,
    description: p.description,
    features: [],
    pros: [],
    cons: [],
    tags: [AWIN_STORE_TAG, p.category].filter(Boolean),
    related: [],
    guides: [],
    specs: [] as unknown as Prisma.InputJsonValue,
    faqs: [] as unknown as Prisma.InputJsonValue,
    sku: p.externalId,
    amazonAvailability: awinStoreAvailability(p.deepLink) as unknown as Prisma.InputJsonValue,
    published: true,
  };
}

/**
 * Sync all configured Awin Shopify stores into MarketProduct: fetch (bounded) →
 * filter → cap per store → upsert (tagged awin-store, each with its own Awin
 * deep link) → deactivate tagged rows that dropped out. Never touches non-Awin
 * products; never deletes (history preserved).
 */
export async function runAwinStoreSync(opts: { dryRun?: boolean } = {}): Promise<AwinStoreSummary> {
  const dryRun = !!opts.dryRun;
  const affid = getAwinAffid();
  const cfg = getAwinStoreConfig();
  const errors: string[] = [];
  const stores: { host: string; fetched: number; selected: number }[] = [];
  const selectedAll: StoreProduct[] = [];

  for (const store of AWIN_STORES) {
    try {
      const fetched = await fetchStoreProducts(store, affid, cfg.maxPages);
      const selected = selectStoreProducts(fetched, cfg.minPrice, cfg.maxPerStore);
      stores.push({ host: store.host, fetched: fetched.length, selected: selected.length });
      selectedAll.push(...selected);
    } catch (err) {
      errors.push(`${store.host}: ${String(err)}`);
      stores.push({ host: store.host, fetched: 0, selected: 0 });
    }
  }

  const selectedSlugs = selectedAll.map((p) => storeProductSlug(p.externalId.split(":")[0], p.externalId.split(":")[1]));
  let inserted = 0;
  let updated = 0;
  let deactivated = 0;

  if (!dryRun && selectedAll.length) {
    const existing = new Set(
      (await prisma.marketProduct.findMany({ where: { tags: { has: AWIN_STORE_TAG } }, select: { slug: true } })).map((r) => r.slug),
    );
    for (const p of selectedAll) {
      const data = toProductData(p);
      try {
        await prisma.marketProduct.upsert({ where: { slug: data.slug }, update: data, create: data });
        if (existing.has(data.slug)) updated++;
        else inserted++;
      } catch (err) {
        errors.push(`upsert ${p.externalId}: ${String(err)}`);
      }
    }
    try {
      const res = await prisma.marketProduct.updateMany({
        where: { tags: { has: AWIN_STORE_TAG }, published: true, slug: selectedSlugs.length ? { notIn: selectedSlugs } : undefined },
        data: { published: false },
      });
      deactivated = res.count;
    } catch (err) {
      errors.push(`deactivate: ${String(err)}`);
    }
  }

  return {
    ok: errors.length === 0,
    dryRun,
    stores,
    inserted,
    updated,
    deactivated,
    errors,
    finishedAt: new Date().toISOString(),
  };
}
