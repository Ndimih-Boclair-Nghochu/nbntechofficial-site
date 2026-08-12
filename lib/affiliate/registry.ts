import "server-only";
import {
  type AffiliateProvider,
  type NormalizedProduct,
  type ProductSearchParams,
  type ProviderId,
  type ProviderStatus,
  PROVIDER_IDS,
} from "./types";
import { AmazonAffiliateProvider } from "./providers/amazon";
import { AwinAffiliateProvider } from "./providers/awin";
import { ImpactAffiliateProvider } from "./providers/impact";
import { CjAffiliateProvider } from "./providers/cj";

/**
 * The provider registry. Adding a new network is a one-line change here plus a
 * new adapter — the rest of the app is provider-agnostic.
 */
const providers: Record<ProviderId, AffiliateProvider> = {
  amazon: new AmazonAffiliateProvider(),
  awin: new AwinAffiliateProvider(),
  impact: new ImpactAffiliateProvider(),
  cj: new CjAffiliateProvider(),
};

export function getProvider(id: ProviderId): AffiliateProvider {
  return providers[id];
}

export function allProviders(): AffiliateProvider[] {
  return PROVIDER_IDS.map((id) => providers[id]);
}

/** Providers that are both feature-enabled and have credentials configured. */
export function activeProviders(): AffiliateProvider[] {
  return allProviders().filter((p) => p.isEnabled() && p.isConfigured());
}

/** Safe, secret-free status for every provider (for the admin dashboard). */
export function getProviderStatuses(): ProviderStatus[] {
  return allProviders().map((p) => p.getStatus());
}

export type ProviderSearchOutcome = {
  provider: ProviderId;
  products: NormalizedProduct[];
  error?: string;
};

/**
 * Search every capable, active provider — with **failure isolation**: one
 * provider throwing (or being unconfigured) never breaks the others.
 */
export async function searchAllProviders(params: ProductSearchParams): Promise<ProviderSearchOutcome[]> {
  const capable = activeProviders().filter(
    (p) => p.capabilities().productSearch && typeof p.searchProducts === "function",
  );
  return Promise.all(
    capable.map(async (p) => {
      try {
        return { provider: p.id, products: await p.searchProducts!(params) };
      } catch (e) {
        return { provider: p.id, products: [], error: e instanceof Error ? e.message : "provider error" };
      }
    }),
  );
}
