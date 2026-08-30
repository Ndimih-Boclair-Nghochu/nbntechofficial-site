import { COUNTRIES } from "@/lib/marketplace";

/**
 * Awin product-feed sync — configuration (env-driven, no side effects).
 *
 * Awin product data is feed-based (the "Create-a-Feed" tool generates a download
 * URL containing your API key + chosen columns). Paste that URL as AWIN_FEED_URL;
 * the sync downloads it, filters, caps and upserts — it never imports a whole
 * feed unbounded. Every product carries its own Awin `aw_deep_link` tracked URL.
 */

function intEnv(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}
function floatEnv(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) ? n : fallback;
}

export type AwinSyncConfig = {
  /** Hard cap on how many Awin products ever enter the DB. */
  maxProducts: number;
  /** Max feed rows scanned per run (memory/CPU bound). */
  maxRows: number;
  /** Reject products below this price (0 = no floor). */
  minPrice: number;
  /** The Create-a-Feed download URL (contains the API key). */
  feedUrl: string | null;
  syncIntervalHours: number;
};

export function getAwinSyncConfig(): AwinSyncConfig {
  return {
    maxProducts: intEnv("AWIN_MAX_PRODUCTS", 200),
    maxRows: intEnv("AWIN_MAX_ROWS", 100_000),
    minPrice: floatEnv("AWIN_MIN_PRICE", 0),
    feedUrl: process.env.AWIN_FEED_URL?.trim() || null,
    syncIntervalHours: intEnv("AWIN_SYNC_INTERVAL_HOURS", 24),
  };
}

/** Rows this system manages carry this tag so the sync only touches its own. */
export const AWIN_SYNC_TAG = "awin-sync";

/** Availability map: the product's Awin deep link, marked available everywhere. */
export function awinEverywhereAvailability(deepLink: string) {
  return COUNTRIES.reduce<Record<string, { status: string; platform: string; url: string }>>(
    (m, c) => ({ ...m, [c.code]: { status: "AVAILABLE", platform: "Awin", url: deepLink } }),
    {},
  );
}
