import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api";
import { getOffersForProduct } from "@/lib/affiliate/link-service";
import { getRequestCountry } from "@/lib/marketplace-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Provider-independent offers for a product. The frontend never needs to know
 * which affiliate network an offer came from — it just receives normalized
 * offers (no credentials, no secrets). Accepts a product id or slug.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const key = params.id;
    const product = /^[a-z0-9]{20,}$/i.test(key)
      ? await prisma.marketProduct.findUnique({ where: { id: key } })
      : await prisma.marketProduct.findUnique({ where: { slug: key } });
    if (!product) return jsonError("Product not found", 404);

    const country = (new URL(req.url).searchParams.get("country") || getRequestCountry()).toUpperCase();
    const offers = await getOffersForProduct(product, country);
    return jsonOk({ productId: product.id, slug: product.slug, country, offers });
  } catch {
    return jsonError("Could not load offers", 500);
  }
}
