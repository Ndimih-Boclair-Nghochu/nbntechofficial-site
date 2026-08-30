import "server-only";

import { gunzipSync } from "zlib";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getAwinSyncConfig,
  awinEverywhereAvailability,
  AWIN_SYNC_TAG,
  type AwinSyncConfig,
} from "./config";
import { parseCsv, normalizeAwinRow, selectAwinProducts, awinProductSlug, type AwinProduct } from "./feed";

export class AwinConfigError extends Error {}

export type AwinSyncSummary = {
  ok: boolean;
  dryRun: boolean;
  rows: number;
  selected: number;
  inserted: number;
  updated: number;
  deactivated: number;
  errors: string[];
  finishedAt: string;
};

const REQUEST_TIMEOUT_MS = 45_000;

/** Download the feed with a timeout; gunzip if the payload is gzipped. */
async function downloadFeed(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`Awin feed download returned HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    // gzip magic bytes 0x1f 0x8b — gunzip; otherwise treat as UTF-8 text.
    if (buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
      return gunzipSync(buf).toString("utf-8");
    }
    return buf.toString("utf-8");
  } finally {
    clearTimeout(timer);
  }
}

function toProductData(p: AwinProduct): Prisma.MarketProductUncheckedCreateInput {
  return {
    name: p.name,
    slug: awinProductSlug(p.externalId),
    brand: p.brand,
    category: p.category ?? "accessories",
    price: p.price,
    currency: p.currency || "GBP",
    imageUrl: p.image,
    imageAlt: p.name,
    gallery: [],
    shortDescription: p.description ? p.description.slice(0, 300) : null,
    description: p.description,
    features: [],
    pros: [],
    cons: [],
    tags: [AWIN_SYNC_TAG, p.category ?? ""].filter(Boolean),
    related: [],
    guides: [],
    specs: [] as unknown as Prisma.InputJsonValue,
    faqs: [] as unknown as Prisma.InputJsonValue,
    sku: p.externalId,
    amazonAvailability: awinEverywhereAvailability(p.deepLink) as unknown as Prisma.InputJsonValue,
    published: true,
  };
}

/**
 * Run one Awin feed sync: download → parse (capped) → normalize → filter → cap →
 * upsert into MarketProduct (tagged awin-sync) → deactivate tagged rows that
 * dropped out (never deletes; never touches non-Awin products).
 */
export async function runAwinSync(opts: { dryRun?: boolean } = {}): Promise<AwinSyncSummary> {
  const dryRun = !!opts.dryRun;
  const cfg: AwinSyncConfig = getAwinSyncConfig();
  const errors: string[] = [];
  if (!cfg.feedUrl) throw new AwinConfigError("AWIN_FEED_URL is not set.");

  const text = await downloadFeed(cfg.feedUrl);
  const rawRows = parseCsv(text, cfg.maxRows);
  const normalized: AwinProduct[] = [];
  for (const row of rawRows) {
    const n = normalizeAwinRow(row);
    if (n) normalized.push(n);
  }
  const selected = selectAwinProducts(normalized, cfg); // ≤ cfg.maxProducts
  const selectedSlugs = selected.map((p) => awinProductSlug(p.externalId));

  let inserted = 0;
  let updated = 0;
  let deactivated = 0;

  if (!dryRun && selected.length) {
    const existing = new Set(
      (
        await prisma.marketProduct.findMany({
          where: { tags: { has: AWIN_SYNC_TAG } },
          select: { slug: true },
        })
      ).map((r) => r.slug),
    );

    for (const p of selected) {
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
        where: {
          tags: { has: AWIN_SYNC_TAG },
          published: true,
          slug: selectedSlugs.length ? { notIn: selectedSlugs } : undefined,
        },
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
    rows: rawRows.length,
    selected: selected.length,
    inserted,
    updated,
    deactivated,
    errors,
    finishedAt: new Date().toISOString(),
  };
}

/** Whether the Awin sync has everything it needs (names/booleans only). */
export function getAwinConfigStatus() {
  const cfg = getAwinSyncConfig();
  return {
    apiToken: !!process.env.AWIN_API_TOKEN,
    publisherId: !!process.env.AWIN_PUBLISHER_ID,
    feedUrl: !!cfg.feedUrl,
    maxProducts: cfg.maxProducts,
  };
}
