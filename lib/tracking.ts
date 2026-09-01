import { siteUrl } from "./utils";

/**
 * Link intelligence — our own click-tracking redirect (`/r`).
 *
 * Outbound affiliate links from surfaces that can't run client JS (the Telegram
 * bot, channel posts, Pinterest pins) are wrapped so a click is recorded
 * server-side before forwarding to the real destination. The redirector only
 * ever forwards to an allow-listed set of affiliate/partner hosts, so it can
 * never become an open redirect.
 */

/**
 * Registrable-domain patterns we will forward to. Each is END-anchored to an
 * explicit TLD so a look-alike host (e.g. amazon.co.uk.evil.com) can NEVER match
 * — the redirector must not become an open redirect. Anything else is refused.
 */
const ALLOWED_HOST_PATTERNS: RegExp[] = [
  /(^|\.)amazon\.(com|co\.uk|de|fr|it|es|nl|com\.be|se|pl|ca|co\.za|eg)$/i,
  /(^|\.)amzn\.to$/i,
  /(^|\.)selar\.(com|co)$/i,
  /(^|\.)awin1\.com$/i, // Awin deep links (cread.php)
  /(^|\.)tidd\.ly$/i, // Awin short links
  /(^|\.)udemy\.com$/i, // covers trk.udemy.com
  /(^|\.)advancedbionutritionals\.com$/i,
  /(^|\.)t\.me$/i, // Telegram
  /(^|\.)pinterest\.(com|co\.uk|ca|fr|de|es|it|nl)$/i,
];

export function isAllowedDestination(rawUrl: string): boolean {
  try {
    const u = new URL(rawUrl);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    return ALLOWED_HOST_PATTERNS.some((re) => re.test(u.hostname));
  } catch {
    return false;
  }
}

export type TrackParams = {
  url: string;
  /** affiliate source/provider: amazon | selar | awin | udemy … */
  source?: string;
  /** product or course slug */
  product?: string;
  category?: string;
  /** where the click came from: bot | channel | pin | miniapp … */
  placement?: string;
  country?: string;
};

/**
 * Wrap a destination in a tracked `/r` link (absolute). Non-allow-listed URLs
 * are returned unchanged (never break a link; never wrap something we won't
 * forward). Use for bot/channel/pin buttons.
 */
export function trackedUrl(p: TrackParams): string {
  if (!p.url || !isAllowedDestination(p.url)) return p.url;
  const q = new URLSearchParams();
  q.set("u", p.url);
  if (p.source) q.set("s", p.source);
  if (p.product) q.set("pid", p.product);
  if (p.category) q.set("c", p.category);
  if (p.placement) q.set("pl", p.placement);
  if (p.country) q.set("co", p.country);
  return `${siteUrl()}/r?${q.toString()}`;
}
