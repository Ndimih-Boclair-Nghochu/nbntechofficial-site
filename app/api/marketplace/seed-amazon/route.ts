import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { AMAZON_PICKS, amazonToData } from "@/lib/marketplace-amazon";
import { AMAZON_PICKS_2, amazon2ToData } from "@/lib/marketplace-amazon2";
import { AMAZON_PICKS_3, amazon3ToData } from "@/lib/marketplace-amazon3";

export const runtime = "nodejs";

/**
 * Admin-only: add the real Amazon affiliate products to the marketplace with
 * their exact amzn.to tracking links. Idempotent (upsert by slug), so re-running
 * updates them rather than duplicating. Editable/deletable afterwards.
 *
 * Covers both batches: the original electronics/accessories picks and the
 * kitchen/home/car picks. Prices are the real Amazon amounts in XAF (localized
 * live by the storefront); the "Buy on Amazon" button links to the live listing.
 */
export async function POST() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    for (const p of AMAZON_PICKS) {
      const data = amazonToData(p);
      await prisma.marketProduct.upsert({ where: { slug: p.slug }, update: data, create: data });
    }
    for (const p of AMAZON_PICKS_2) {
      const data = amazon2ToData(p);
      await prisma.marketProduct.upsert({ where: { slug: p.slug }, update: data, create: data });
    }
    for (const p of AMAZON_PICKS_3) {
      const data = amazon3ToData(p);
      await prisma.marketProduct.upsert({ where: { slug: p.slug }, update: data, create: data });
    }
    const products = await prisma.marketProduct.findMany({
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
    });
    return jsonOk({ seeded: AMAZON_PICKS.length + AMAZON_PICKS_2.length + AMAZON_PICKS_3.length, products });
  } catch {
    return jsonError("Could not add Amazon products. Has the database table been created (npm run db:push)?", 500);
  }
}
