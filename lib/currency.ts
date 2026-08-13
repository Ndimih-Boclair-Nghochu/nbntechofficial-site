import "server-only";

/**
 * Live currency conversion. Fetches current exchange rates (USD base) from a
 * free, no-key, reputable source and caches them in memory. Used to show a
 * product's price in the shopper's country currency — like Amazon's localized
 * pricing.
 *
 * Resilient: if rates are unavailable the caller shows the original price
 * unchanged (never a wrong or fabricated number). Rates refresh every ~6h.
 */

const ENDPOINT = "https://open.er-api.com/v6/latest/USD";
const TTL_MS = 6 * 60 * 60 * 1000;

let cache: { rates: Record<string, number>; expiresAt: number } | null = null;
let inflight: Promise<Record<string, number> | null> | null = null;

async function fetchRates(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch(ENDPOINT, { signal: AbortSignal.timeout(6000), next: { revalidate: 21600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
    if (data.result !== "success" || !data.rates || typeof data.rates.USD !== "number") return null;
    cache = { rates: data.rates, expiresAt: Date.now() + TTL_MS };
    return data.rates;
  } catch {
    return null;
  }
}

/** Ensure rates are loaded (call once per request before rendering prices). */
export async function ensureRates(): Promise<void> {
  if (cache && Date.now() < cache.expiresAt) return;
  if (inflight) {
    await inflight;
    return;
  }
  inflight = fetchRates().finally(() => {
    inflight = null;
  });
  await inflight;
}

export function ratesReady(): boolean {
  return !!cache && Date.now() < cache.expiresAt;
}

/**
 * Convert an amount between currencies using the cached USD-based rates.
 * Returns null when a rate is missing (caller keeps the original price).
 * Synchronous — relies on ensureRates() having populated the cache.
 */
export function convert(amount: number, from: string, to: string): number | null {
  if (amount == null || Number.isNaN(amount)) return null;
  const f = from?.toUpperCase();
  const t = to?.toUpperCase();
  if (!f || !t) return null;
  if (f === t) return amount;
  const rates = cache?.rates;
  if (!rates || !rates[f] || !rates[t]) return null;
  const usd = amount / rates[f];
  return usd * rates[t];
}

/** Sensible rounding for a displayed converted price. */
export function roundPrice(amount: number): number {
  if (amount >= 100) return Math.round(amount);
  if (amount >= 10) return Math.round(amount * 10) / 10;
  return Math.round(amount * 100) / 100;
}
