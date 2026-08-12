import type { AmazonProduct } from "@/lib/amazon/types";
import type { NormalizedProduct, ProviderId } from "./types";

/**
 * Normalization layer: map each network's product shape into the single
 * provider-independent NormalizedProduct. The frontend never sees provider
 * differences. Add a `normalizeXxx` per provider as it comes online.
 */

/** Amazon Creators API product → NormalizedProduct. */
export function normalizeAmazon(p: AmazonProduct): NormalizedProduct {
  return {
    provider: "amazon",
    providerProductId: p.asin, // ASIN → providerProductId
    title: p.title,
    brand: p.brand,
    image: p.image,
    additionalImages: p.images?.slice(1),
    productUrl: p.detailPageUrl,
    affiliateUrl: p.detailPageUrl, // Amazon returns an already-tagged URL
    price: p.price,
    currency: p.currency,
    availability: p.availability,
    country: p.marketplace,
    rating: p.rating,
    reviewCount: p.reviewCount,
    asin: p.asin,
  };
}

/**
 * Generic feed-row normalizer used by feed-based providers (Awin, impact, CJ)
 * once configured. Keys are intentionally loose so each adapter can map its
 * feed columns onto these before calling this.
 */
export function normalizeFeedRow(
  provider: ProviderId,
  row: {
    providerProductId: string;
    title: string;
    description?: string | null;
    brand?: string | null;
    category?: string | null;
    image?: string | null;
    additionalImages?: string[];
    productUrl?: string | null;
    affiliateUrl?: string | null;
    price?: number | null;
    originalPrice?: number | null;
    currency?: string | null;
    availability?: string | null;
    country: string;
    gtin?: string | null;
    mpn?: string | null;
    sku?: string | null;
    merchantName?: string | null;
    metadata?: Record<string, unknown>;
  },
): NormalizedProduct {
  return {
    provider,
    providerProductId: row.providerProductId,
    title: row.title,
    description: row.description ?? null,
    brand: row.brand ?? null,
    category: row.category ?? null,
    image: row.image ?? null,
    additionalImages: row.additionalImages ?? [],
    productUrl: row.productUrl ?? null,
    affiliateUrl: row.affiliateUrl ?? null,
    price: row.price ?? null,
    originalPrice: row.originalPrice ?? null,
    currency: row.currency ?? null,
    availability: row.availability ?? null,
    country: row.country,
    gtin: row.gtin ?? null,
    mpn: row.mpn ?? null,
    sku: row.sku ?? null,
    metadata: { merchantName: row.merchantName ?? null, ...(row.metadata || {}) },
  };
}
