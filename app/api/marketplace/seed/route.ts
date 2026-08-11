import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { DEMO_PRODUCTS, demoToData } from "@/lib/marketplace-demo";

export const runtime = "nodejs";

/**
 * Admin-only: load the NBN MARKET demo products (real photos + full info) so the
 * storefront can be seen end-to-end. Idempotent (upsert by slug). Every product
 * is then editable/deletable from /admin/marketplace.
 */
export async function POST() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    for (const p of DEMO_PRODUCTS) {
      const data = demoToData(p);
      await prisma.marketProduct.upsert({ where: { slug: p.slug }, update: data, create: data });
    }
    const products = await prisma.marketProduct.findMany({
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
    });
    return jsonOk({ seeded: DEMO_PRODUCTS.length, products });
  } catch {
    return jsonError("Could not load demo products. Has the database table been created (npm run db:push)?", 500);
  }
}
