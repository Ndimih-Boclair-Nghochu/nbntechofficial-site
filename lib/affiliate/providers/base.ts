import {
  type AffiliateProvider,
  type ProviderCapabilities,
  type ProviderId,
  type ProviderStatus,
} from "../types";
import { isProviderConfigured, isProviderEnabled, missingVars, PROVIDER_NAMES } from "../config";

/**
 * Shared provider base: derives enabled/configured/status from env config so
 * each adapter only declares its capabilities + implements the operations it
 * actually supports. Never exposes secret values.
 */
export abstract class BaseProvider implements AffiliateProvider {
  abstract readonly id: ProviderId;

  get name(): string {
    return PROVIDER_NAMES[this.id];
  }

  abstract capabilities(): ProviderCapabilities;

  isEnabled(): boolean {
    return isProviderEnabled(this.id);
  }

  isConfigured(): boolean {
    return isProviderConfigured(this.id);
  }

  /** Optional human note shown in the admin (no secrets). */
  protected note(): string | undefined {
    return undefined;
  }

  getStatus(): ProviderStatus {
    const enabled = this.isEnabled();
    const configured = this.isConfigured();
    return {
      id: this.id,
      name: this.name,
      enabled,
      configured,
      state: !enabled ? "disabled" : configured ? "configured" : "not_configured",
      connection: "unknown",
      capabilities: this.capabilities(),
      missing: missingVars(this.id),
      note: this.note(),
    };
  }
}
