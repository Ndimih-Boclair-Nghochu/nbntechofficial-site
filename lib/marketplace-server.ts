import "server-only";
import { cookies, headers } from "next/headers";
import { COUNTRY_MAP, resolveCountry } from "@/lib/marketplace";

/**
 * The request's shopping country. Precedence:
 *   1. `nbm_country` cookie — the user's explicit choice.
 *   2. Real geo-location from the edge (Vercel sets `x-vercel-ip-country`;
 *      Cloudflare sets `cf-ipcountry`) — accurate to the visitor's country.
 *   3. The default country.
 *
 * Reading these makes marketplace pages dynamic, which is what we want — they
 * are DB-backed and personalised by country. Server-only.
 */
export function getRequestCountry(): string {
  const cookieCode = cookies().get("nbm_country")?.value;
  if (cookieCode && COUNTRY_MAP[cookieCode.toUpperCase()]) return cookieCode.toUpperCase();

  const h = headers();
  const geo = (h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || "").toUpperCase();
  if (geo && COUNTRY_MAP[geo]) return geo;

  return resolveCountry(null).code;
}
