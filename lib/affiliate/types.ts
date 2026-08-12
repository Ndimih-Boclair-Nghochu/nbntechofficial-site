/**
 * Provider-agnostic affiliate types.
 *
 * The frontend never needs to know whether a product/offer came from Amazon,
 * Awin, impact.com or CJ — it only sees the normalized shapes below. Providers
 * declare their capabilities so the app never calls an operation a network does
 * not support.
 */

export type ProviderId = "amazon" | "awin" | "impact" | "cj";

export const PROVIDER_IDS: ProviderId[] = ["amazon", "awin", "impact", "cj"];

/** What a network can actually do (per official-doc research). */
export type ProviderCapabilities = {
  /** Real-time keyword product search API. */
  productSearch: boolean;
  /** Fetch a single product by its provider id. */
  productDetail: boolean;
  /** Downloadable / queryable product catalog feed. */
  productFeed: boolean;
  /** Generate an affiliate/deep link. */
  deepLinks: boolean;
  priceData: boolean;
  availability: boolean;
  variations: boolean;
  /** Access to a merchant's products/links requires joining that program. */
  requiresProgramApproval: boolean;
};

export type ProviderConfigState = "not_configured" | "configured" | "disabled";
export type ProviderConnectionState = "unknown" | "connected" | "error";

/** Program/merchant relationship status (approval ≠ API access). */
export type ProgramStatus = "available" | "applied" | "approved" | "rejected" | "inactive";

/** Safe status object for the admin dashboard — never contains secret values. */
export type ProviderStatus = {
  id: ProviderId;
  name: string;
  /** Feature flag (e.g. AWIN_ENABLED). */
  enabled: boolean;
  /** Required credentials are present. */
  configured: boolean;
  state: ProviderConfigState;
  connection: ProviderConnectionState;
  capabilities: ProviderCapabilities;
  /** Names of missing env vars (names only, never values). */
  missing: string[];
  note?: string;
};

/** A canonical, provider-independent product (as sent to the frontend). */
export type NormalizedProduct = {
  provider: ProviderId;
  providerProductId: string;
  title: string;
  description?: string | null;
  brand?: string | null;
  category?: string | null;
  image?: string | null;
  additionalImages?: string[];
  productUrl?: string | null;
  affiliateUrl?: string | null;
  price: number | null;
  originalPrice?: number | null;
  currency: string | null;
  availability?: string | null;
  country: string;
  locale?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  sku?: string | null;
  gtin?: string | null;
  mpn?: string | null;
  asin?: string | null;
  metadata?: Record<string, unknown>;
};

/** A single buy option for a product (per provider × merchant × country). */
export type NormalizedOffer = {
  provider: ProviderId;
  merchantId?: string | null;
  merchantName?: string | null;
  merchantProductId?: string | null;
  title?: string | null;
  price: number | null;
  originalPrice?: number | null;
  currency: string | null;
  availability?: string | null;
  country: string;
  destinationUrl?: string | null;
  affiliateUrl: string | null;
  programStatus?: ProgramStatus;
  lastUpdated?: string | null;
};

export type ProductSearchParams = {
  keyword: string;
  country?: string;
  page?: number;
  limit?: number;
};

export type GenerateLinkInput = {
  /** Destination merchant URL (for deep-link builders). */
  url?: string;
  /** Provider product id (for id-based link generation). */
  productId?: string;
  /** Merchant/advertiser id, when the network needs it. */
  merchantId?: string;
  country?: string;
};

/**
 * The uniform interface every network adapter implements. Optional methods let
 * a provider expose only what it actually supports; the registry checks
 * capabilities before calling.
 */
export interface AffiliateProvider {
  readonly id: ProviderId;
  readonly name: string;

  capabilities(): ProviderCapabilities;
  isEnabled(): boolean;
  isConfigured(): boolean;
  /** Safe status for the admin dashboard (no secrets). */
  getStatus(): ProviderStatus;

  searchProducts?(params: ProductSearchParams): Promise<NormalizedProduct[]>;
  getProduct?(id: string, country?: string): Promise<NormalizedProduct | null>;
  generateAffiliateLink?(input: GenerateLinkInput): Promise<string | null>;
  /** Feed-based providers implement this; search-based ones may not. */
  getProductFeed?(opts?: { merchantId?: string; country?: string }): Promise<NormalizedProduct[]>;
}

/** Thrown when an operation is attempted on an unconfigured provider. */
export class ProviderNotConfiguredError extends Error {
  provider: ProviderId;
  constructor(provider: ProviderId, message?: string) {
    super(message || `${provider} affiliate integration is not configured.`);
    this.name = "ProviderNotConfiguredError";
    this.provider = provider;
  }
}

/** Thrown when a provider genuinely does not support an operation. */
export class ProviderNotSupportedError extends Error {
  provider: ProviderId;
  constructor(provider: ProviderId, operation: string) {
    super(`${provider} does not support ${operation}.`);
    this.name = "ProviderNotSupportedError";
    this.provider = provider;
  }
}
