/**
 * Awin product feed — pure CSV parsing, normalization, filtering & capping.
 *
 * No network, no database, no secrets — unit-tested. This guarantees a large
 * Awin feed can never flood the database: it is filtered and capped in memory
 * before anything is written.
 */

import { slugify } from "../utils";
import type { AwinSyncConfig } from "./config";

/** Deterministic slug per Awin product id (dedupe/upsert key). Pure. */
export function awinProductSlug(externalId: string): string {
  return `awin-${externalId}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-");
}

export type AwinProduct = {
  externalId: string;
  name: string;
  deepLink: string;
  image: string | null;
  price: number | null;
  currency: string | null;
  category: string | null;
  brand: string | null;
  description: string | null;
  inStock: boolean;
};

/**
 * Robust CSV parser (RFC-4180-ish): handles quoted fields, escaped quotes ("")
 * and commas/newlines inside quotes. Stops after `maxRows` data rows so a huge
 * feed never balloons memory. Returns an array of row objects keyed by header.
 */
export function parseCsv(text: string, maxRows = Infinity): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      pushField();
    } else if (ch === "\n") {
      pushRow();
      // Stop once we've collected `maxRows` DATA rows (rows.length-1 excludes header).
      if (rows.length - 1 >= maxRows) break;
    } else if (ch === "\r") {
      // ignore; handled by \n
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) pushRow();

  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  const out: Record<string, string>[] = [];
  for (let r = 1; r < rows.length; r++) {
    const obj: Record<string, string> = {};
    for (let c = 0; c < header.length; c++) obj[header[c]] = (rows[r][c] ?? "").trim();
    out.push(obj);
  }
  return out;
}

function pick(row: Record<string, string>, keys: string[]): string | null {
  for (const k of keys) {
    const v = row[k];
    if (v != null && v.trim() !== "") return v.trim();
  }
  return null;
}
function num(v: string | null): number | null {
  if (v == null) return null;
  const n = Number(v.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Map an Awin feed row (standard Create-a-Feed columns) to our product shape. */
export function normalizeAwinRow(row: Record<string, string>): AwinProduct | null {
  const externalId = pick(row, ["aw_product_id", "merchant_product_id", "product_id"]);
  const name = pick(row, ["product_name", "product_short_description", "name"]);
  const deepLink = pick(row, ["aw_deep_link", "deep_link", "product_url"]);
  if (!externalId || !name || !deepLink) return null;

  const rawCategory = pick(row, ["merchant_category", "category_name", "product_type"]);
  const inStockRaw = (pick(row, ["in_stock", "stock_status", "availability"]) ?? "").toLowerCase();
  return {
    externalId,
    name,
    deepLink,
    image: pick(row, ["merchant_image_url", "aw_image_url", "image_url", "large_image"]),
    price: num(pick(row, ["search_price", "store_price", "price", "display_price"])),
    currency: pick(row, ["currency", "curr"]),
    category: rawCategory ? slugify(rawCategory).slice(0, 60) : null,
    brand: pick(row, ["brand_name", "merchant_name", "brand"]),
    description: pick(row, ["description", "product_short_description"]),
    // Missing stock column → assume in stock; explicit 0/false/no/out → out.
    inStock: !["0", "false", "no", "out of stock", "outofstock"].includes(inStockRaw),
  };
}

export function passesAwinFilter(p: AwinProduct, cfg: AwinSyncConfig): boolean {
  if (!p.inStock) return false;
  if (!p.image) return false;
  if (cfg.minPrice > 0 && (p.price == null || p.price < cfg.minPrice)) return false;
  return true;
}

/**
 * Dedupe by external id, filter, and cap at cfg.maxProducts. Bounded output —
 * the core database-protection guarantee for Awin.
 */
export function selectAwinProducts(products: AwinProduct[], cfg: AwinSyncConfig): AwinProduct[] {
  const byId = new Map<string, AwinProduct>();
  for (const p of products) {
    if (!passesAwinFilter(p, cfg)) continue;
    if (!byId.has(p.externalId)) byId.set(p.externalId, p);
    if (byId.size >= cfg.maxProducts) break;
  }
  return Array.from(byId.values());
}
