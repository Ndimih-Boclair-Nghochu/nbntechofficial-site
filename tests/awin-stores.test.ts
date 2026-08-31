import { test } from "node:test";
import assert from "node:assert/strict";

import {
  awinDeepLink,
  storeProductSlug,
  normalizeShopifyProduct,
  passesStoreFilter,
  selectStoreProducts,
  type StoreConfig,
  type ShopifyProduct,
  type StoreProduct,
} from "../lib/awin-stores/shopify";

const store: StoreConfig = { host: "brickzonehub.co.uk", awinmid: "121692", brand: "BrickZone Hub", category: "home-office", currency: "GBP" };
const AFFID = "3033801";

test("awinDeepLink builds the verified cread.php tracked link", () => {
  const url = awinDeepLink("https://brickzonehub.co.uk/products/x", "121692", AFFID);
  assert.ok(url.startsWith("https://www.awin1.com/cread.php?awinmid=121692&awinaffid=3033801&ued="));
  assert.ok(url.includes(encodeURIComponent("https://brickzonehub.co.uk/products/x")));
});

test("storeProductSlug is deterministic and unique per store+id", () => {
  assert.equal(storeProductSlug("brickzonehub.co.uk", 555), "awin-brickzonehub-co-uk-555");
  assert.notEqual(storeProductSlug("a.com", 1), storeProductSlug("b.com", 1));
});

test("normalizeShopifyProduct maps a product + builds its own deep link", () => {
  const raw: ShopifyProduct = {
    id: 42, title: "Wall Display Case", handle: "wall-display-case", vendor: "brickzonehub",
    body_html: "<p>Great <b>case</b></p>", variants: [{ price: "109.00", available: true }],
    images: [{ src: "https://cdn/x.jpg" }],
  };
  const p = normalizeShopifyProduct(raw, store, AFFID)!;
  assert.equal(p.name, "Wall Display Case");
  assert.equal(p.price, 109);
  assert.equal(p.currency, "GBP");
  assert.equal(p.description, "Great case");
  assert.equal(p.productUrl, "https://brickzonehub.co.uk/products/wall-display-case");
  assert.ok(p.deepLink.includes("awinmid=121692"));
});

test("normalizeShopifyProduct returns null without id/title/handle", () => {
  assert.equal(normalizeShopifyProduct({ id: 1, title: "x" } as ShopifyProduct, store, AFFID), null);
});

test("filter drops out-of-stock and imageless products", () => {
  const base: StoreProduct = { externalId: "h:1", name: "n", brand: "b", price: 10, currency: "GBP", image: "https://i", description: "d", category: "home-office", productUrl: "u", deepLink: "d", inStock: true };
  assert.equal(passesStoreFilter(base, 0), true);
  assert.equal(passesStoreFilter({ ...base, inStock: false }, 0), false);
  assert.equal(passesStoreFilter({ ...base, image: null }, 0), false);
  assert.equal(passesStoreFilter({ ...base, price: 5 }, 10), false);
});

test("selectStoreProducts dedupes and caps (a big catalogue can't flood the DB)", () => {
  const many: StoreProduct[] = [];
  for (let i = 0; i < 2000; i++) {
    many.push({ externalId: `h:${i % 400}`, name: `P${i}`, brand: "b", price: 20, currency: "GBP", image: "https://i", description: "d", category: "home-office", productUrl: "u", deepLink: `d${i}`, inStock: true });
  }
  const sel = selectStoreProducts(many, 0, 300);
  assert.ok(sel.length <= 300, `got ${sel.length}`);
  assert.equal(new Set(sel.map((p) => p.externalId)).size, sel.length);
});
