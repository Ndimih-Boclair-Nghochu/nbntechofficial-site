import "server-only";
import type { MarketProduct } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { availabilityFor, COUNTRIES } from "@/lib/marketplace";
import { sortOffers, pickBestOffer } from "./offers";
import type { NormalizedOffer, ProviderId, ProgramStatus } from "./types";

/**
 * AffiliateLinkService — the single place the app resolves offers + affiliate
 * URLs for a product. The frontend calls `GET /api/products/:id/offers`; the
 * backend picks the right provider link. Credentials never reach the browser.
 *
 * Today it merges two sources:
 *   1. Amazon offers derived from the product's existing per-country availability.
 *   2. ProductOffer rows synced from other providers (once configured).
 * If the ProductOffer table doesn't exist yet, Amazon offers still work.
 */

/** Amazon offers from a product's existing availability JSON, for given countries. */
export function amazonOffersFromProduct(product: MarketProduct, countries?: string[]): NormalizedOffer[] {
  const codes = countries && countries.length ? countries : COUNTRIES.map((c) => c.code);
  const out: NormalizedOffer[] = [];
  for (const code of codes) {
    const a = availabilityFor(product, code);
    if (!a.hasLink) continue;
    out.push({
      provider: "amazon",
      merchantName: `Amazon ${a.country.name}`,
      price: a.price,
      currency: a.currency,
      availability: a.status,
      country: a.country.code,
      destinationUrl: a.hasDirectUrl ? a.url : null,
      affiliateUrl: a.url,
      lastUpdated: product.updatedAt ? new Date(product.updatedAt).toISOString() : null,
    });
  }
  return out;
}

/** All offers for a product in one country (Amazon + other providers), sorted. */
export async function getOffersForProduct(product: MarketProduct, country: string): Promise<NormalizedOffer[]> {
  const cc = country.toUpperCase();
  const offers: NormalizedOffer[] = amazonOffersFromProduct(product, [cc]);

  try {
    const rows = await prisma.productOffer.findMany({
      where: { productId: product.id, country: cc },
      orderBy: [{ price: "asc" }],
    });
    for (const r of rows) {
      offers.push({
        provider: r.provider as ProviderId,
        merchantId: r.merchantId,
        merchantName: r.merchantName,
        merchantProductId: r.merchantProductId,
        price: r.price,
        originalPrice: r.originalPrice,
        currency: r.currency,
        availability: r.availability,
        country: r.country,
        destinationUrl: r.destinationUrl,
        affiliateUrl: r.affiliateUrl,
        programStatus: (r.programStatus as ProgramStatus) || undefined,
        lastUpdated: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
      });
    }
  } catch {
    // ProductOffer table not created yet (other providers not activated) — the
    // marketplace keeps working with Amazon offers only.
  }

  return sortOffers(offers);
}

export { pickBestOffer };
