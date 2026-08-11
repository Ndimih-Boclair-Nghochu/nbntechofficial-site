import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api";
import { searchAmazonProducts, AmazonApiError } from "@/lib/amazon/creators";
import { AmazonConfigError } from "@/lib/amazon/token";
import { rateLimit } from "@/lib/amazon/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0] : req.headers.get("x-real-ip")) || "unknown";
}

export async function GET(req: NextRequest) {
  // Per-IP rate limit — this route proxies a paid/quota'd API to the public.
  const limited = rateLimit(`amazon:search:${clientIp(req)}`, 20, 60_000);
  if (!limited.ok) return jsonError("Too many searches. Please slow down.", 429);

  const { searchParams } = new URL(req.url);
  const keyword = (searchParams.get("q") || "").trim();
  if (!keyword) return jsonError("Please enter a search term.", 400);
  if (keyword.length > 120) return jsonError("Search term is too long.", 400);

  const marketplace = searchParams.get("country") || undefined;
  const page = Number(searchParams.get("page") || "1") || 1;
  const searchIndex = searchParams.get("searchIndex") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;

  try {
    const result = await searchAmazonProducts({ keyword, marketplace, page, searchIndex, sortBy });
    return jsonOk(result);
  } catch (err) {
    if (err instanceof AmazonConfigError) return jsonError(err.message, 501);
    if (err instanceof AmazonApiError) return jsonError(err.message, err.status);
    return jsonError("Amazon search is temporarily unavailable.", 502);
  }
}
