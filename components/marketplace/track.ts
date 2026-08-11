/**
 * Best-effort analytics for the marketplace. Pushes GA4 / GTM-friendly events
 * to window.dataLayer (and window.gtag when present). No PII is collected.
 * The most important conversion event is the outbound Amazon click.
 */
type EventParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
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
}
