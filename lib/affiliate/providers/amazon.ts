import "server-only";
import { BaseProvider } from "./base";
import { normalizeAmazon } from "../normalize";
import {
  type GenerateLinkInput,
  type NormalizedProduct,
  type ProviderCapabilities,
  type ProviderId,
  type ProductSearchParams,
} from "../types";
import { searchAmazonProducts, getAmazonItem } from "@/lib/amazon/creators";

/**
 * Amazon Associates (Creators API) provider — a thin wrapper over the existing,
 * fully-integrated `lib/amazon/*` service so the rest of the app can treat Amazon
 * like any other affiliate provider. Nothing about the existing Amazon flow
 * changes; this only adapts it to the unified interface.
 */
export class AmazonAffiliateProvider extends BaseProvider {
  readonly id: ProviderId = "amazon";

  capabilities(): ProviderCapabilities {
    return {
      productSearch: true,
      productDetail: true,
      productFeed: false, // Amazon is search/detail based, not a downloadable feed
      deepLinks: true,
      priceData: true,
      availability: true,
      variations: true,
      requiresProgramApproval: false,
    };
  }

  protected note() {
    return "Live via Creators API. Needs credentials + a Partner Tag per marketplace.";
  }

  async searchProducts(params: ProductSearchParams): Promise<NormalizedProduct[]> {
    const res = await searchAmazonProducts({
      keyword: params.keyword,
      marketplace: params.country,
      page: params.page,
      itemCount: params.limit,
    });
    return res.items.map(normalizeAmazon);
  }

  async getProduct(id: string, country?: string): Promise<NormalizedProduct | null> {
    const item = await getAmazonItem(id, country);
    return item ? normalizeAmazon(item) : null;
  }

  async generateAffiliateLink(input: GenerateLinkInput): Promise<string | null> {
    // The Creators API already returns a Partner-Tag-tagged detailPageURL, so we
    // never fabricate tags here — we return the provided URL unchanged.
    return input.url || null;
  }
}
