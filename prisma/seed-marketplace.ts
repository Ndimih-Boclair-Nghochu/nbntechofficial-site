import type { PrismaClient } from "@prisma/client";
import { DEMO_PRODUCTS, demoToData } from "../lib/marketplace-demo";

/**
 * Seed NBN MARKET demo products (real photos + full info). Idempotent: upserts
 * by unique slug, so re-running is safe and never duplicates. Every product is
 * deletable from /admin/marketplace.
 */
export async function seedMarketplace(prisma: PrismaClient) {
  for (const p of DEMO_PRODUCTS) {
    const data = demoToData(p);
    await prisma.marketProduct.upsert({ where: { slug: p.slug }, update: data, create: data });
  }
  console.log(`✔ ${DEMO_PRODUCTS.length} marketplace demo products seeded`);
}
