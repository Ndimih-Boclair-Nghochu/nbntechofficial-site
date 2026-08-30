import { type ProviderId } from "./types";

/**
 * Feature flags + credential presence detection. Reads server-side env only.
 * Returns booleans and env-var *names* — never secret values — so it is safe to
 * surface in the admin status view.
 *
 * Required var names are the ones **confirmed by official documentation** in
 * docs/research-report.md.
 */

const FLAG_ENV: Record<ProviderId, string> = {
  amazon: "AMAZON_ENABLED",
  awin: "AWIN_ENABLED",
  impact: "IMPACT_ENABLED",
  cj: "CJ_ENABLED",
};

// Amazon defaults ON; the others stay OFF until you have approval + credentials.
const FLAG_DEFAULT: Record<ProviderId, boolean> = {
  amazon: true,
  awin: false,
  impact: false,
  cj: false,
};

export const REQUIRED_VARS: Record<ProviderId, string[]> = {
  amazon: ["AMAZON_CREATOR_CREDENTIAL_ID", "AMAZON_CREATOR_CREDENTIAL_SECRET", "AMAZON_CREATOR_VERSION"],
  awin: ["AWIN_API_TOKEN", "AWIN_PUBLISHER_ID", "AWIN_FEED_URL"],
  impact: ["IMPACT_ACCOUNT_SID", "IMPACT_AUTH_TOKEN"],
  cj: ["CJ_PERSONAL_ACCESS_TOKEN", "CJ_CID"],
};

export const PROVIDER_NAMES: Record<ProviderId, string> = {
  amazon: "Amazon Associates",
  awin: "Awin",
  impact: "impact.com",
  cj: "CJ Affiliate",
};

function truthy(v: string | undefined): boolean {
  return v === "true" || v === "1" || v === "yes";
}

export function isProviderEnabled(id: ProviderId): boolean {
  const v = process.env[FLAG_ENV[id]];
  if (v === undefined || v === "") return FLAG_DEFAULT[id];
  return truthy(v);
}

/** Env vars that are required but currently missing (names only). */
export function missingVars(id: ProviderId): string[] {
  return REQUIRED_VARS[id].filter((name) => !process.env[name]);
}

export function isProviderConfigured(id: ProviderId): boolean {
  return missingVars(id).length === 0;
}
