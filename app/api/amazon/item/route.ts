import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api";
import { getAmazonItem, AmazonApiError } from "@/lib/amazon/creators";
import { AmazonConfigError } from "@/lib/amazon/token";
import { rateLimit } from "@/lib/amazon/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0] : req.headers.get("x-real-ip")) || "unknown";
}

export async function GET(req: NextRequest) {
  const limited = rateLimit(`amazon:item:${clientIp(req)}`, 30, 60_000);
  if (!limited.ok) return jsonError("Too many requests. Please slow down.", 429);

  const { searchParams } = new URL(req.url);
  const asin = (searchParams.get("asin") || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(asin)) return jsonError("A valid 10-character ASIN is required.", 400);
  const marketplace = searchParams.get("country") || undefined;

  try {
    const item = await getAmazonItem(asin, marketplace);
    if (!item) return jsonError("Product not found on this Amazon marketplace.", 404);
    return jsonOk(item);
  } catch (err) {
    if (err instanceof AmazonConfigError) return jsonError(err.message, 501);
    if (err instanceof AmazonApiError) return jsonError(err.message, err.status);
    return jsonError("Amazon lookup is temporarily unavailable.", 502);
  }
}
