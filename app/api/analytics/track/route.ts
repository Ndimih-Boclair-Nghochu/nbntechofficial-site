import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/amazon/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Privacy-light analytics ingest. Records marketplace events for the admin
 * dashboard. No PII is stored (no IP, no user agent, no user id). Bots are
 * skipped; input is validated and rate-limited. Always returns 204 so the
 * client's best-effort beacon never surfaces an error.
 */

const ALLOWED = new Set([
  "product_view",
  "category_view",
  "guide_view",
  "comparison_view",
  "marketplace_search",
  "offer_view",
  "buy_click",
  "country_selected",
]);

const BOT_RE = /bot|crawler|spider|crawl|slurp|bingpreview|facebookexternalhit|preview|monitor|lighthouse|headless/i;

function clip(v: unknown, n: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s.slice(0, n) : null;
}
function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0] : req.headers.get("x-real-ip")) || "unknown";
}

export async function POST(req: NextRequest) {
  const noContent = new NextResponse(null, { status: 204 });

  // Skip obvious bots — keep the numbers about real people.
  const ua = req.headers.get("user-agent") || "";
  if (BOT_RE.test(ua)) return noContent;

  // Basic flood protection per IP.
  if (!rateLimit(`analytics:${clientIp(req)}`, 120, 60_000).ok) return noContent;

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return noContent;
  }

  const type = clip(body.type, 40);
  if (!type || !ALLOWED.has(type)) return noContent;

  const country =
    clip(body.country, 2)?.toUpperCase() ||
    (req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "").toUpperCase() ||
    null;

  try {
    await prisma.analyticsEvent.create({
      data: {
        type,
        productSlug: clip(body.product ?? body.productSlug, 120),
        category: clip(body.category, 80),
        provider: clip(body.provider, 20),
        merchant: clip(body.merchant, 120),
        country: country && /^[A-Z]{2}$/.test(country) ? country : null,
        path: clip(body.path, 300),
        query: clip(body.query, 120),
      },
    });
  } catch {
    // Table not created yet (run the SQL) — never break the client.
  }
  return noContent;
}
