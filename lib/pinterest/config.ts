import { siteUrl } from "@/lib/utils";

/**
 * Pinterest API v5 — configuration (server-side; secrets read lazily).
 * Only the official API is used. Nothing here has side effects.
 */

export const PINTEREST_API = "https://api.pinterest.com/v5";
export const PINTEREST_SCOPES = ["boards:read", "boards:write", "pins:read", "pins:write"];

function truthy(v: string | undefined) {
  return v === "true" || v === "1" || v === "yes";
}
function intEnv(name: string, fallback: number) {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function pinterestEnabled(): boolean {
  return truthy(process.env.PINTEREST_ENABLED);
}

export function getPinterestApp(): { id: string; secret: string } | null {
  const id = process.env.PINTEREST_APP_ID?.trim();
  const secret = process.env.PINTEREST_APP_SECRET?.trim();
  return id && secret ? { id, secret } : null;
}

export function getPinterestRefreshToken(): string | null {
  return process.env.PINTEREST_REFRESH_TOKEN?.trim() || null;
}

/** Daily pin cadence — start conservative, raise as the account matures. */
export function pinDailyLimit(): number {
  return intEnv("PIN_DAILY_LIMIT", 8);
}

/** OAuth redirect URI — must match the one registered in the Pinterest app. */
export function pinterestRedirectUri(): string {
  return `${siteUrl()}/api/pinterest/oauth`;
}

/** Board name for a site category (kept namespaced + human-friendly). */
export function boardNameForCategory(categoryName: string): string {
  return `NBN MARKET · ${categoryName}`;
}
export const COURSES_BOARD_NAME = "NBN MARKET · Online Courses";

/** Authorize URL to start the one-time OAuth consent. */
export function pinterestAuthorizeUrl(state: string): string {
  const app = getPinterestApp();
  const q = new URLSearchParams({
    client_id: app?.id || "",
    redirect_uri: pinterestRedirectUri(),
    response_type: "code",
    scope: PINTEREST_SCOPES.join(","),
    state,
  });
  return `https://www.pinterest.com/oauth/?${q.toString()}`;
}

export function pinterestConfigStatus() {
  return {
    enabled: pinterestEnabled(),
    app: !!getPinterestApp(),
    refreshToken: !!getPinterestRefreshToken(),
    dailyLimit: pinDailyLimit(),
  };
}
