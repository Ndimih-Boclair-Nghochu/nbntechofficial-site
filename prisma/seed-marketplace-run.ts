/**
 * Standalone marketplace seeder — adds only demo products, nothing else.
 *
 *   npm run db:seed:marketplace
 *
 * Safe to run on production: it upserts a handful of demo products by slug and
 * touches no other tables (unlike the full `db:seed`, which resets testimonials).
 * Every demo product is deletable from the admin panel at /admin/marketplace.
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";
import { seedMarketplace } from "./seed-marketplace";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding marketplace demo products…\n");
  await seedMarketplace(prisma as unknown as PrismaClient);
  console.log("\n✅ Demo products ready. Manage them at /admin/marketplace.");
}

main()
  .catch((e) => {
    console.error("Marketplace seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
