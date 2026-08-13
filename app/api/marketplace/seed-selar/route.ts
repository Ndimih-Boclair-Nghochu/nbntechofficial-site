import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { SELAR_PRODUCTS, selarToData } from "@/lib/marketplace-selar";

export const runtime = "nodejs";

/**
 * Admin-only: add the real Selar affiliate products (digital courses) to the
 * marketplace with their exact affiliate links. Idempotent (upsert by slug), so
 * re-running updates them rather than duplicating. Editable/deletable afterwards.
 */
export async function POST() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    for (const p of SELAR_PRODUCTS) {
      const data = selarToData(p);
      await prisma.marketProduct.upsert({ where: { slug: p.slug }, update: data, create: data });
    }
    const products = await prisma.marketProduct.findMany({
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
    });
    return jsonOk({ seeded: SELAR_PRODUCTS.length, products });
  } catch {
    return jsonError("Could not add Selar products. Has the database table been created (npm run db:push)?", 500);
  }
}
