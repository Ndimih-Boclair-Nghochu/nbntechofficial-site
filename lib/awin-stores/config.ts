import { COUNTRIES } from "../marketplace";
import type { StoreConfig } from "./shopify";

/**
 * Awin Shopify-store sync configuration. These are joined Awin advertiser
 * programmes whose catalogues are pulled from Shopify's public products.json.
 * The advertiser id (awinmid) comes from the Awin tracking token; the publisher
 * id (affid) is yours. Add a store here and it's picked up — no code change.
 *
 * Electronic Express is intentionally NOT here: it is not a Shopify store, so it
 * has no products.json. Import its catalogue via the Awin product feed instead
 * (lib/awin — set AWIN_FEED_URL).
 */
export const AWIN_STORES: StoreConfig[] = [
  { host: "brickzonehub.co.uk", awinmid: "121692", brand: "BrickZone Hub", category: "home-office", currency: "GBP" },
  { host: "lochelectronics.com", awinmid: "56203", brand: "Loch Electronics", category: "home-kitchen", currency: "GBP" },
];

/** Publisher (affiliate) id — from env, falling back to the account in use. */
export function getAwinAffid(): string {
  return (process.env.AWIN_PUBLISHER_ID || "3033801").trim();
}

function intEnv(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}
function floatEnv(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) ? n : fallback;
}

export function getAwinStoreConfig() {
  return {
    maxPerStore: intEnv("AWIN_STORE_MAX", 300),
    maxPages: intEnv("AWIN_STORE_MAX_PAGES", 10),
    minPrice: floatEnv("AWIN_STORE_MIN_PRICE", 0),
  };
}

/** Rows this sync manages carry this tag so it only ever touches its own. */
export const AWIN_STORE_TAG = "awin-store";

/** The product's Awin deep link, marked available in every country. */
export function awinStoreAvailability(deepLink: string) {
  return COUNTRIES.reduce<Record<string, { status: string; platform: string; url: string }>>(
    (m, c) => ({ ...m, [c.code]: { status: "AVAILABLE", platform: "Awin", url: deepLink } }),
    {},
  );
}
