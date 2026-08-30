import { test } from "node:test";
import assert from "node:assert/strict";

import { matchProducts, canAutoMerge } from "../lib/affiliate/dedupe";
import { sortOffers, pickBestOffer, offersForCountry } from "../lib/affiliate/offers";
import { isProviderEnabled, isProviderConfigured, missingVars } from "../lib/affiliate/config";
import { normalizeAmazon } from "../lib/affiliate/normalize";
import type { NormalizedProduct, NormalizedOffer } from "../lib/affiliate/types";

const base: NormalizedProduct = {
  provider: "amazon",
  providerProductId: "X",
  title: "Sample",
  price: 10,
  currency: "EUR",
  country: "DE",
};

/* ----------------------------- dedupe ----------------------------- */

test("dedupe: exact GTIN match is high-confidence and auto-mergeable", () => {
  const a = { ...base, gtin: "0885909950805" };
  const b = { ...base, provider: "cj" as const, gtin: "885909950805" }; // leading-zero variant
  const m = matchProducts(a, b);
  assert.equal(m.confidence, "exact");
  assert.ok(canAutoMerge(m));
});

test("dedupe: different GTIN never matches", () => {
  const a = { ...base, gtin: "1111111111111" };
  const b = { ...base, gtin: "2222222222222" };
  assert.equal(matchProducts(a, b).confidence, "none");
});

test("dedupe: brand+MPN is high-confidence", () => {
  const a = { ...base, brand: "Apple", mpn: "MWP22" };
  const b = { ...base, brand: "apple", mpn: "mwp-22" };
  const m = matchProducts(a, b);
  assert.equal(m.confidence, "high");
  assert.ok(canAutoMerge(m));
});

test("dedupe: title similarity alone must NOT auto-merge", () => {
  const a = { ...base, brand: "Sony", title: "Sony WH-1000XM5 Headphones" };
  const b = { ...base, brand: "Sony", title: "Sony WH-1000XM5 Wireless Headphones" };
  const m = matchProducts(a, b);
  assert.equal(m.confidence, "review"); // brand + strong title overlap → review only
  assert.equal(canAutoMerge(m), false); // never auto-merges on title
});

/* ----------------------------- offers ----------------------------- */

const offer = (o: Partial<NormalizedOffer>): NormalizedOffer => ({
  provider: "amazon",
  price: null,
  currency: "EUR",
  country: "DE",
  affiliateUrl: "https://example.com",
  ...o,
});

test("offers: available cheapest sorts first; no-link sinks last", () => {
  const offers = [
    offer({ provider: "cj", price: 200, availability: "AVAILABLE" }),
    offer({ provider: "amazon", price: 180, availability: "AVAILABLE" }),
    offer({ provider: "awin", price: 100, affiliateUrl: null, destinationUrl: null }), // no link
    offer({ provider: "impact", price: 190, availability: "AVAILABILITY_UNKNOWN" }),
  ];
  const sorted = sortOffers(offers);
  assert.equal(sorted[0].provider, "amazon"); // cheapest available
  assert.equal(sorted[sorted.length - 1].provider, "awin"); // no link -> last
  assert.equal(pickBestOffer(offers)?.provider, "amazon");
});

test("offers: country filter", () => {
  const offers = [offer({ country: "DE" }), offer({ country: "GB" }), offer({ country: "de" })];
  assert.equal(offersForCountry(offers, "DE").length, 2);
});

/* ----------------------------- config ----------------------------- */

test("config: Amazon enabled by default, others off", () => {
  delete process.env.AMAZON_ENABLED;
  delete process.env.AWIN_ENABLED;
  assert.equal(isProviderEnabled("amazon"), true);
  assert.equal(isProviderEnabled("awin"), false);
  process.env.AWIN_ENABLED = "true";
  assert.equal(isProviderEnabled("awin"), true);
  delete process.env.AWIN_ENABLED;
});

test("config: missing credentials reported by name, not value", () => {
  delete process.env.AWIN_API_TOKEN;
  delete process.env.AWIN_PUBLISHER_ID;
  delete process.env.AWIN_FEED_URL;
  assert.equal(isProviderConfigured("awin"), false);
  assert.deepEqual(missingVars("awin"), ["AWIN_API_TOKEN", "AWIN_PUBLISHER_ID", "AWIN_FEED_URL"]);

  process.env.AWIN_API_TOKEN = "x";
  process.env.AWIN_PUBLISHER_ID = "y";
  process.env.AWIN_FEED_URL = "z";
  assert.equal(isProviderConfigured("awin"), true);
  assert.deepEqual(missingVars("awin"), []);
  delete process.env.AWIN_API_TOKEN;
  delete process.env.AWIN_PUBLISHER_ID;
  delete process.env.AWIN_FEED_URL;
});

/* --------------------------- normalize ---------------------------- */

test("normalize: Amazon product maps to provider-agnostic shape", () => {
  const n = normalizeAmazon({
    asin: "B0ABC12345",
    title: "Widget",
    brand: "Acme",
    image: "https://img/1.jpg",
    images: ["https://img/1.jpg", "https://img/2.jpg"],
    price: 49.99,
    priceDisplay: "€49.99",
    currency: "EUR",
    availability: "In stock",
    condition: "New",
    rating: 4.5,
    reviewCount: 120,
    detailPageUrl: "https://www.amazon.de/dp/B0ABC12345?tag=x",
    marketplace: "DE",
  });
  assert.equal(n.provider, "amazon");
  assert.equal(n.providerProductId, "B0ABC12345");
  assert.equal(n.asin, "B0ABC12345");
  assert.equal(n.affiliateUrl, "https://www.amazon.de/dp/B0ABC12345?tag=x");
  assert.equal(n.country, "DE");
  assert.equal(n.currency, "EUR");
});
