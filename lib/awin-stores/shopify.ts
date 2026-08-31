/**
 * Awin store products via Shopify's public products.json — pure parsing,
 * deep-link building, filtering & capping. No network/DB/secrets; unit-tested.
 *
 * Each product's affiliate link is a verified Awin deep link
 * (awin1.com/cread.php?awinmid=…&awinaffid=…&ued=<product url>) which routes
 * through Awin (setting the tracking cookie) and lands on the exact product.
 */

import { slugify } from "../utils";

export type StoreConfig = {
  host: string;
  awinmid: string;
  brand: string;
  category: string;
  currency: string;
};

export type ShopifyVariant = { price?: string; available?: boolean };
export type ShopifyImage = { src?: string };
export type ShopifyProduct = {
  id: number | string;
  title?: string;
  handle?: string;
  vendor?: string;
  product_type?: string;
  body_html?: string;
  variants?: ShopifyVariant[];
  images?: ShopifyImage[];
};

export type StoreProduct = {
  externalId: string;
  name: string;
  brand: string;
  price: number | null;
  currency: string;
  image: string | null;
  description: string | null;
  category: string;
  productUrl: string;
  deepLink: string;
  inStock: boolean;
};

/** Build a tracked Awin deep link to a specific product URL (verified format). */
export function awinDeepLink(productUrl: string, awinmid: string, affid: string): string {
  return `https://www.awin1.com/cread.php?awinmid=${encodeURIComponent(awinmid)}&awinaffid=${encodeURIComponent(affid)}&ued=${encodeURIComponent(productUrl)}`;
}

/** Deterministic, unique slug for a store product (dedupe/upsert key). */
export function storeProductSlug(host: string, id: string | number): string {
  return slugify(`awin ${host.replace(/\./g, "-")} ${id}`);
}

function stripHtml(html: string | undefined): string {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
}

export function normalizeShopifyProduct(p: ShopifyProduct, store: StoreConfig, affid: string): StoreProduct | null {
  if (p.id == null || !p.title || !p.handle) return null;
  const variants = p.variants || [];
  const priceStr = (variants.find((v) => v.price)?.price) ?? null;
  const price = priceStr != null ? Number(priceStr) : null;
  const productUrl = `https://${store.host}/products/${p.handle}`;
  return {
    externalId: `${store.host}:${p.id}`,
    name: p.title,
    brand: p.vendor || store.brand,
    price: Number.isFinite(price as number) ? (price as number) : null,
    currency: store.currency,
    image: p.images?.[0]?.src || null,
    description: stripHtml(p.body_html).slice(0, 500) || null,
    category: p.product_type ? slugify(p.product_type).slice(0, 60) || store.category : store.category,
    productUrl,
    deepLink: awinDeepLink(productUrl, store.awinmid, affid),
    inStock: variants.length === 0 ? true : variants.some((v) => v.available !== false),
  };
}

export function passesStoreFilter(p: StoreProduct, minPrice: number): boolean {
  if (!p.inStock) return false;
  if (!p.image) return false;
  if (minPrice > 0 && (p.price == null || p.price < minPrice)) return false;
  return true;
}

/** Dedupe by external id, filter, cap at max. Bounded output (DB protection). */
export function selectStoreProducts(products: StoreProduct[], minPrice: number, max: number): StoreProduct[] {
  const byId = new Map<string, StoreProduct>();
  for (const p of products) {
    if (!passesStoreFilter(p, minPrice)) continue;
    if (!byId.has(p.externalId)) byId.set(p.externalId, p);
    if (byId.size >= max) break;
  }
  return Array.from(byId.values());
}
