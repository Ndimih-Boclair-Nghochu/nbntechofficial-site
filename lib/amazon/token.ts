import "server-only";

/**
 * Amazon Creators API OAuth2 (client_credentials) token acquisition + caching.
 *
 * Mirrors the official SDK exactly:
 *  - v2.x → Amazon Cognito (form-encoded body, scope "creatorsapi/default")
 *  - v3.x → Login with Amazon (JSON body, scope "creatorsapi::default")
 * Tokens live ~1h; we cache in module memory and refresh 60s early. Secrets are
 * read from server-only env and never leave the server.
 */

const COGNITO_SCOPE = "creatorsapi/default";
const LWA_SCOPE = "creatorsapi::default";
const GRANT_TYPE = "client_credentials";

function tokenEndpoint(version: string): string {
  switch (version) {
    case "2.1": return "https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token";
    case "2.2": return "https://creatorsapi.auth.eu-south-2.amazoncognito.com/oauth2/token";
    case "2.3": return "https://creatorsapi.auth.us-west-2.amazoncognito.com/oauth2/token";
    case "3.1": return "https://api.amazon.com/auth/o2/token";
    case "3.2": return "https://api.amazon.co.uk/auth/o2/token";
    case "3.3": return "https://api.amazon.co.jp/auth/o2/token";
    default:
      throw new AmazonConfigError(
        `Unsupported AMAZON_CREATOR_VERSION "${version}". Supported: 2.1, 2.2, 2.3 (Cognito) or 3.1, 3.2, 3.3 (LWA).`,
      );
  }
}

export function isLwaVersion(version: string): boolean {
  return version.startsWith("3.");
}

export class AmazonConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AmazonConfigError";
  }
}

type Creds = { credentialId: string; credentialSecret: string; version: string };

export function readCredentials(): Creds {
  const credentialId = process.env.AMAZON_CREATOR_CREDENTIAL_ID;
  const credentialSecret = process.env.AMAZON_CREATOR_CREDENTIAL_SECRET;
  const version = process.env.AMAZON_CREATOR_VERSION;
  if (!credentialId || !credentialSecret || !version) {
    throw new AmazonConfigError(
      "Amazon Creators API is not configured. Set AMAZON_CREATOR_CREDENTIAL_ID, AMAZON_CREATOR_CREDENTIAL_SECRET and AMAZON_CREATOR_VERSION.",
    );
  }
  return { credentialId, credentialSecret, version };
}

// Module-level cache (per serverless instance).
let cached: { token: string; expiresAt: number } | null = null;
let inflight: Promise<string> | null = null;

async function fetchToken(creds: Creds): Promise<string> {
  const endpoint = tokenEndpoint(creds.version);
  const lwa = isLwaVersion(creds.version);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": lwa ? "application/json" : "application/x-www-form-urlencoded" },
    body: lwa
      ? JSON.stringify({
          grant_type: GRANT_TYPE,
          client_id: creds.credentialId,
          client_secret: creds.credentialSecret,
          scope: LWA_SCOPE,
        })
      : new URLSearchParams({
          grant_type: GRANT_TYPE,
          client_id: creds.credentialId,
          client_secret: creds.credentialSecret,
          scope: COGNITO_SCOPE,
        }).toString(),
    // token endpoints are fast; don't hang a request forever
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    // Never log the body verbatim (could echo credentials); surface a safe message.
    throw new AmazonConfigError(
      `Amazon OAuth2 token request failed (${res.status}). Check the Credential ID/Secret and that the Version matches your marketplace region.`,
    );
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new AmazonConfigError("Amazon OAuth2 response contained no access_token.");

  const ttlMs = ((data.expires_in ?? 3600) - 60) * 1000;
  cached = { token: data.access_token, expiresAt: Date.now() + Math.max(ttlMs, 30_000) };
  return cached.token;
}

/** A valid access token, using the module cache and de-duping concurrent refreshes. */
export async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return cached.token;
  if (inflight) return inflight;
  const creds = readCredentials();
  inflight = fetchToken(creds).finally(() => {
    inflight = null;
  });
  return inflight;
}

/** The Authorization header value — Version suffix only for Cognito (v2.x). */
export function authorizationHeader(token: string, version: string): string {
  return isLwaVersion(version) ? `Bearer ${token}` : `Bearer ${token}, Version ${version}`;
}
