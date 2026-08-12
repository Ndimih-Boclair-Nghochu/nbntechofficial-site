import "server-only";
import { BaseProvider } from "./base";
import {
  ProviderNotConfiguredError,
  type NormalizedProduct,
  type ProviderCapabilities,
  type ProviderId,
} from "../types";

/**
 * impact.com provider (scaffold).
 *
 * Confirmed by docs: HTTP Basic auth — AccountSID (username) + AuthToken
 * (password). Publisher endpoints under
 * https://api.impact.com/Mediapartners/{AccountSID}/... Product data comes from
 * brand-published **Catalogs** (retrieve catalog + items) — available only for
 * brands whose catalog is shared with the partner. Deep/tracking links via the
 * media-partner tracking-link endpoints.
 *
 * Not activated: throws ProviderNotConfiguredError until AccountSID/AuthToken
 * exist and the relevant brand contracts/catalogs are approved.
 */
export class ImpactAffiliateProvider extends BaseProvider {
  readonly id: ProviderId = "impact";

  capabilities(): ProviderCapabilities {
    return {
      productSearch: false, // retrieval is per shared catalog, not cross-brand search
      productDetail: true, // catalog item retrieval
      productFeed: true, // catalogs behave like feeds
      deepLinks: true,
      priceData: true,
      availability: true,
      variations: false,
      requiresProgramApproval: true,
    };
  }

  protected note() {
    return "Catalog-based. Requires an approved media-partner account + a contract with each brand, and the brand must share its catalog.";
  }

  async getProductFeed(): Promise<NormalizedProduct[]> {
    if (!this.isConfigured()) throw new ProviderNotConfiguredError("impact");
    throw new ProviderNotConfiguredError("impact", "impact.com catalog sync is prepared but not yet activated.");
  }
}
