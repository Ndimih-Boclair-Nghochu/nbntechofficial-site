import { test } from "node:test";
import assert from "node:assert/strict";

import { parseCsv, normalizeAwinRow, passesAwinFilter, selectAwinProducts, awinProductSlug, type AwinProduct } from "../lib/awin/feed";
import type { AwinSyncConfig } from "../lib/awin/config";

const cfg: AwinSyncConfig = {
  maxProducts: 50,
  maxRows: 100_000,
  minPrice: 0,
  feedUrl: "https://productdata.awin.com/datafeed/download/apikey/XXX/...",
  syncIntervalHours: 24,
};

const CSV = [
  'aw_product_id,product_name,aw_deep_link,merchant_image_url,search_price,currency,merchant_category,brand_name,in_stock',
  '1,"Desk Chair, Ergonomic",https://awin1.com/cread.php?id=1,https://img/1.jpg,129.99,GBP,"Home, Office",FlexiSeat,1',
  '2,"Standing Desk",https://awin1.com/cread.php?id=2,https://img/2.jpg,299.00,GBP,Office,DeskCo,0',
  '3,"USB-C Hub",https://awin1.com/cread.php?id=3,,19.99,GBP,Accessories,HubZ,1',
].join("\n");

test("parseCsv handles quoted fields with commas", () => {
  const rows = parseCsv(CSV);
  assert.equal(rows.length, 3);
  assert.equal(rows[0].product_name, "Desk Chair, Ergonomic");
  assert.equal(rows[0].merchant_category, "Home, Office");
  assert.equal(rows[1].product_name, "Standing Desk");
});

test("parseCsv respects the maxRows cap", () => {
  assert.equal(parseCsv(CSV, 1).length, 1);
});

test("normalizeAwinRow maps standard Awin columns", () => {
  const rows = parseCsv(CSV);
  const p = normalizeAwinRow(rows[0])!;
  assert.equal(p.externalId, "1");
  assert.equal(p.name, "Desk Chair, Ergonomic");
  assert.equal(p.deepLink, "https://awin1.com/cread.php?id=1");
  assert.equal(p.price, 129.99);
  assert.equal(p.category, "home-office");
  assert.equal(p.inStock, true);
});

test("normalizeAwinRow returns null without id/name/deep link", () => {
  assert.equal(normalizeAwinRow({ product_name: "x" }), null);
});

test("filter drops out-of-stock and imageless products", () => {
  const rows = parseCsv(CSV).map(normalizeAwinRow).filter(Boolean) as AwinProduct[];
  const kept = rows.filter((p) => passesAwinFilter(p, cfg));
  assert.equal(kept.length, 1); // only product 1 (2 is out of stock, 3 has no image)
  assert.equal(kept[0].externalId, "1");
});

test("selectAwinProducts dedupes and caps output", () => {
  const many: AwinProduct[] = [];
  for (let i = 0; i < 5000; i++) {
    many.push({
      externalId: String(i % 300), // force duplicate ids
      name: `P${i}`, deepLink: `https://awin1.com/c?id=${i}`, image: "https://img/x.jpg",
      price: 10 + (i % 90), currency: "GBP", category: "accessories", brand: "B", description: "d", inStock: true,
    });
  }
  const selected = selectAwinProducts(many, cfg);
  assert.ok(selected.length <= cfg.maxProducts, `got ${selected.length}`);
  const ids = new Set(selected.map((p) => p.externalId));
  assert.equal(ids.size, selected.length); // no duplicates
});

test("each product keeps its own Awin deep link; slug is deterministic", () => {
  assert.equal(awinProductSlug("ABC 1"), "awin-abc-1");
  const rows = parseCsv(CSV).map(normalizeAwinRow).filter(Boolean) as AwinProduct[];
  assert.equal(rows[0].deepLink, "https://awin1.com/cread.php?id=1");
  assert.notEqual(rows[0].deepLink, rows[1].deepLink);
});
