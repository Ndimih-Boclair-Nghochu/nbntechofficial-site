import "server-only";

import { PINTEREST_API, getPinterestApp, getPinterestRefreshToken, pinterestRedirectUri } from "./config";

/**
 * Pinterest API v5 client (server-only). Official endpoints only:
 *   POST /v5/oauth/token   (code / refresh grants, HTTP Basic app auth)
 *   GET/POST /v5/boards
 *   POST /v5/pins          { board_id, title, description, link, media_source }
 * Bearer access tokens are minted from the long-lived refresh token per run, so
 * nothing has to be persisted.
 */

export class PinterestConfigError extends Error {}

const TIMEOUT_MS = 20_000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        if (attempt < 4) {
          const ra = Number(res.headers.get("retry-after"));
          await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : Math.min(15_000, 2 ** attempt * 600));
          continue;
        }
      }
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      if (attempt < 4) await sleep(Math.min(15_000, 2 ** attempt * 600));
    }
  }
  throw new Error(`Pinterest request failed: ${String(lastErr)}`);
}

function basicAuthHeader(): string {
  const app = getPinterestApp();
  if (!app) throw new PinterestConfigError("PINTEREST_APP_ID / PINTEREST_APP_SECRET are not set.");
  return "Basic " + Buffer.from(`${app.id}:${app.secret}`).toString("base64");
}

type TokenResponse = { access_token: string; refresh_token?: string; scope?: string; expires_in?: number };

/** Exchange an OAuth authorization code for tokens (one-time setup helper). */
export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const body = new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: pinterestRedirectUri() });
  const res = await fetchWithRetry(`${PINTEREST_API}/oauth/token`, {
    method: "POST",
    headers: { Authorization: basicAuthHeader(), "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Token exchange failed (HTTP ${res.status}): ${await res.text()}`);
  return (await res.json()) as TokenResponse;
}

/** Mint a fresh access token from the stored refresh token. */
export async function getAccessToken(): Promise<string> {
  const refresh = getPinterestRefreshToken();
  if (!refresh) throw new PinterestConfigError("PINTEREST_REFRESH_TOKEN is not set (run the OAuth connect once).");
  const body = new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh });
  const res = await fetchWithRetry(`${PINTEREST_API}/oauth/token`, {
    method: "POST",
    headers: { Authorization: basicAuthHeader(), "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Token refresh failed (HTTP ${res.status}): ${await res.text()}`);
  const json = (await res.json()) as TokenResponse;
  if (!json.access_token) throw new Error("Token refresh returned no access_token.");
  return json.access_token;
}

function authed(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export type Board = { id: string; name: string };

/** List all boards (paginated). */
export async function listBoards(token: string): Promise<Board[]> {
  const out: Board[] = [];
  let bookmark: string | undefined;
  for (let i = 0; i < 20; i++) {
    const url = `${PINTEREST_API}/boards?page_size=100${bookmark ? `&bookmark=${encodeURIComponent(bookmark)}` : ""}`;
    const res = await fetchWithRetry(url, { headers: authed(token) });
    if (!res.ok) throw new Error(`List boards failed (HTTP ${res.status}): ${await res.text()}`);
    const json = (await res.json()) as { items?: Board[]; bookmark?: string };
    for (const b of json.items || []) out.push({ id: b.id, name: b.name });
    if (!json.bookmark) break;
    bookmark = json.bookmark;
  }
  return out;
}

export async function createBoard(token: string, name: string, description: string): Promise<Board> {
  const res = await fetchWithRetry(`${PINTEREST_API}/boards`, {
    method: "POST",
    headers: authed(token),
    body: JSON.stringify({ name, description, privacy: "PUBLIC" }),
  });
  if (!res.ok) throw new Error(`Create board failed (HTTP ${res.status}): ${await res.text()}`);
  const b = (await res.json()) as Board;
  return { id: b.id, name: b.name };
}

export type CreatePinInput = {
  boardId: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  altText?: string;
};

export async function createPin(token: string, p: CreatePinInput): Promise<{ id: string }> {
  const res = await fetchWithRetry(`${PINTEREST_API}/pins`, {
    method: "POST",
    headers: authed(token),
    body: JSON.stringify({
      board_id: p.boardId,
      title: p.title,
      description: p.description,
      link: p.link,
      alt_text: p.altText,
      media_source: { source_type: "image_url", url: p.imageUrl },
    }),
  });
  if (!res.ok) throw new Error(`Create pin failed (HTTP ${res.status}): ${await res.text()}`);
  const json = (await res.json()) as { id: string };
  return { id: json.id };
}
