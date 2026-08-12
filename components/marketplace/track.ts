/**
 * Best-effort analytics for the marketplace.
 *  1. Pushes GA4 / GTM-friendly events to window.dataLayer (+ window.gtag) so any
 *     analytics you connect keeps working.
 *  2. Persists key events to our own DB (POST /api/analytics/track) so the admin
 *     dashboard can show real, first-party stats.
 * No PII is collected. The most important conversion event is the outbound
 * affiliate (buy) click.
 */
type EventParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Events we persist server-side (others still go to dataLayer only).
const PERSISTED = new Set([
  "product_view",
  "category_view",
  "guide_view",
  "comparison_view",
  "marketplace_search",
  "offer_view",
  "buy_click",
  "country_selected",
]);

function persist(event: string, params: EventParams) {
  try {
    const payload = JSON.stringify({
      type: event,
      path: typeof location !== "undefined" ? location.pathname : undefined,
      ...params,
    });
    // sendBeacon survives page unload (crucial for outbound buy clicks).
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon("/api/analytics/track", blob)) return;
    }
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* best-effort */
  }
}

export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    if (typeof window.gtag === "function") window.gtag("event", event, params);
  } catch {
    /* analytics is best-effort */
  }
  if (PERSISTED.has(event)) persist(event, params);
}
