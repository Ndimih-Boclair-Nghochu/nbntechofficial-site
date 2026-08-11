import "server-only";
import { cookies } from "next/headers";
import { resolveCountry } from "@/lib/marketplace";

/**
 * The request's shopping country, from the `nbm_country` cookie (falls back to
 * the default). Reading it makes marketplace pages dynamic, which is what we
 * want — they are DB-backed and personalised by country. Server-only.
 */
export function getRequestCountry(): string {
  const raw = cookies().get("nbm_country")?.value;
  return resolveCountry(raw).code;
}
