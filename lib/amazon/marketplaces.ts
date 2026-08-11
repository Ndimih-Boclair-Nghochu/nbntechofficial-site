/**
 * Amazon Creators API marketplace configuration.
 *
 * The Creators API identifies a marketplace by its domain in the `x-marketplace`
 * header (e.g. "www.amazon.co.uk"). Partner (tracking) tags are per-marketplace —
 * a US tag does not work on EU marketplaces — so each maps to its own env var.
 *
 * Keys are the app's country codes (matching lib/marketplace.ts). Note GB → UK
 * env naming to match Amazon's convention.
 */

export type AmazonMarketplace = {
  /** App country code (matches lib/marketplace.ts). */
  code: string;
  name: string;
  /** Value for the `x-marketplace` header. */
  domain: string;
  /** Env var holding this marketplace's Associates Partner Tag. */
  partnerTagEnv: string;
  currency: string;
  region: "NA" | "EU" | "FE";
};

export const AMAZON_MARKETPLACES: Record<string, AmazonMarketplace> = {
  US: { code: "US", name: "United States", domain: "www.amazon.com", partnerTagEnv: "AMAZON_US_PARTNER_TAG", currency: "USD", region: "NA" },
  GB: { code: "GB", name: "United Kingdom", domain: "www.amazon.co.uk", partnerTagEnv: "AMAZON_UK_PARTNER_TAG", currency: "GBP", region: "EU" },
  DE: { code: "DE", name: "Germany", domain: "www.amazon.de", partnerTagEnv: "AMAZON_DE_PARTNER_TAG", currency: "EUR", region: "EU" },
  FR: { code: "FR", name: "France", domain: "www.amazon.fr", partnerTagEnv: "AMAZON_FR_PARTNER_TAG", currency: "EUR", region: "EU" },
  IT: { code: "IT", name: "Italy", domain: "www.amazon.it", partnerTagEnv: "AMAZON_IT_PARTNER_TAG", currency: "EUR", region: "EU" },
  ES: { code: "ES", name: "Spain", domain: "www.amazon.es", partnerTagEnv: "AMAZON_ES_PARTNER_TAG", currency: "EUR", region: "EU" },
  NL: { code: "NL", name: "Netherlands", domain: "www.amazon.nl", partnerTagEnv: "AMAZON_NL_PARTNER_TAG", currency: "EUR", region: "EU" },
  PL: { code: "PL", name: "Poland", domain: "www.amazon.pl", partnerTagEnv: "AMAZON_PL_PARTNER_TAG", currency: "PLN", region: "EU" },
  SE: { code: "SE", name: "Sweden", domain: "www.amazon.se", partnerTagEnv: "AMAZON_SE_PARTNER_TAG", currency: "SEK", region: "EU" },
};

export const DEFAULT_AMAZON_MARKETPLACE = "GB";

export function listAmazonMarketplaces(): AmazonMarketplace[] {
  return Object.values(AMAZON_MARKETPLACES);
}

export function resolveMarketplace(code?: string | null): AmazonMarketplace {
  const c = code ? AMAZON_MARKETPLACES[code.toUpperCase()] : undefined;
  return c || AMAZON_MARKETPLACES[DEFAULT_AMAZON_MARKETPLACE];
}

/**
 * The Partner Tag for a marketplace, from its env var (falling back to a shared
 * AMAZON_PARTNER_TAG). Returns undefined if none is configured — callers must
 * treat that as "not configured" rather than inventing a tag.
 */
export function partnerTagFor(code: string): string | undefined {
  const mkt = AMAZON_MARKETPLACES[code.toUpperCase()];
  const specific = mkt ? process.env[mkt.partnerTagEnv] : undefined;
  return specific || process.env.AMAZON_PARTNER_TAG || undefined;
}
