import "server-only";
import { BaseProvider } from "./base";
import {
  ProviderNotConfiguredError,
  type NormalizedProduct,
  type ProviderCapabilities,
  type ProductSearchParams,
  type ProviderId,
} from "../types";

/**
 * CJ Affiliate provider (scaffold).
 *
 * Confirmed by docs: Bearer Personal Access Token (CJ_PERSONAL_ACCESS_TOKEN) +
 * CID (CJ_CID). GraphQL endpoint https://ads.api.cj.com/query supports product
 * search (price, currency, country, UPC, …); a REST Link Search exists too.
 * Commissionable links/product data depend on the advertiser relationship.
 *
 * Not activated: throws ProviderNotConfiguredError until PAT/CID exist and
 * advertisers are joined.
 */
export class CjAffiliateProvider extends BaseProvider {
  readonly id: ProviderId = "cj";

  capabilities(): ProviderCapabilities {
    return {
      productSearch: true, // GraphQL product search
      productDetail: true,
      productFeed: true,
      deepLinks: true,
      priceData: true,
      availability: true,
      variations: false,
      requiresProgramApproval: true,
    };
  }

  protected note() {
    return "GraphQL product search + link search. Requires a publisher PAT + CID and joined advertisers for commissionable links.";
  }

  async searchProducts(_params: ProductSearchParams): Promise<NormalizedProduct[]> {
    if (!this.isConfigured()) throw new ProviderNotConfiguredError("cj");
    throw new ProviderNotConfiguredError("cj", "CJ product search is prepared but not yet activated.");
  }

  async getProductFeed(): Promise<NormalizedProduct[]> {
    if (!this.isConfigured()) throw new ProviderNotConfiguredError("cj");
    throw new ProviderNotConfiguredError("cj", "CJ product feed sync is prepared but not yet activated.");
  }
}
