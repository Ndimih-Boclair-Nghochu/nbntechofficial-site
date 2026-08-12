import type { NormalizedOffer } from "./types";

/**
 * Pure offer helpers (no I/O) — safe to unit-test and to import anywhere.
 * Offer *sourcing* (DB + Amazon availability) lives in link-service.ts.
 */

/** Rank: cheapest available first; offers without a usable link sink to the bottom. */
export function sortOffers(offers: NormalizedOffer[]): NormalizedOffer[] {
  const rank = (o: NormalizedOffer) => {
    if (!o.affiliateUrl && !o.destinationUrl) return 3;
    const a = (o.availability || "").toUpperCase();
    if (a.includes("UNAVAIL")) return 2;
    if (a.includes("UNKNOWN") || a === "") return 1;
    return 0;
  };
  return offers
    .map((o, i) => ({ o, i }))
    .sort((x, y) => {
      const r = rank(x.o) - rank(y.o);
      if (r !== 0) return r;
      const px = x.o.price ?? Number.POSITIVE_INFINITY;
      const py = y.o.price ?? Number.POSITIVE_INFINITY;
      if (px !== py) return px - py;
      return x.i - y.i; // stable
    })
    .map((z) => z.o);
}

/** The single best offer to feature (cheapest, available, linkable), or null. */
export function pickBestOffer(offers: NormalizedOffer[]): NormalizedOffer | null {
  const sorted = sortOffers(offers);
  return sorted.find((o) => (o.affiliateUrl || o.destinationUrl)) || sorted[0] || null;
}

/** Offers available (or unverified) in a given country. */
export function offersForCountry(offers: NormalizedOffer[], country: string): NormalizedOffer[] {
  const cc = country.toUpperCase();
  return offers.filter((o) => o.country.toUpperCase() === cc);
}
