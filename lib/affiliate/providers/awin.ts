import "server-only";
import { BaseProvider } from "./base";
import {
  ProviderNotConfiguredError,
  ProviderNotSupportedError,
  type NormalizedProduct,
  type ProviderCapabilities,
  type ProviderId,
} from "../types";

/**
 * Awin provider (scaffold).
 *
 * Confirmed by docs: OAuth2 Bearer personal token (AWIN_API_TOKEN), base
 * https://api.awin.com, Publisher ID (AWIN_PUBLISHER_ID). Product data is
 * **feed-based** (Awin "Create-a-Feed"), not a real-time product-search API, so
 * `productSearch` is false and `productFeed` is true. Deep links require joining
 * the advertiser programme.
 *
 * Not activated: every operation throws ProviderNotConfiguredError until
 * credentials + approved programmes exist. It never fabricates data or links.
 */
export class AwinAffiliateProvider extends BaseProvider {
  readonly id: ProviderId = "awin";

  capabilities(): ProviderCapabilities {
    return {
      productSearch: false, // feed-based, no live keyword search API
      productDetail: false,
      productFeed: true,
      deepLinks: true,
      priceData: true,
      availability: true,
      variations: false,
      requiresProgramApproval: true,
    };
  }

  protected note() {
    return "Feed-based. Requires an approved publisher account + joined advertiser programmes. Sync uses feed update-checks before downloading.";
  }

  async getProductFeed(): Promise<NormalizedProduct[]> {
    if (!this.isConfigured()) throw new ProviderNotConfiguredError("awin");
    // Prepared: list feeds → check update info → download (CSV/GZIP) → parse →
    // normalizeFeedRow → dedupe → upsert. Activated once credentials are set.
    throw new ProviderNotConfiguredError("awin", "Awin feed sync is prepared but not yet activated.");
  }

  async searchProducts(): Promise<NormalizedProduct[]> {
    throw new ProviderNotSupportedError("awin", "product search (Awin is feed-based)");
  }
}
