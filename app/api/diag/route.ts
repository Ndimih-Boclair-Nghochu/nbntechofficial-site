import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonOk, jsonError } from "@/lib/api";

/** TEMPORARY — token-guarded. Creates the GalleryImage table. REMOVE after. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = "nbn-diag-8462";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  if (sp.get("token") !== TOKEN) return new Response("Not found", { status: 404 });

  const out: Record<string, unknown> = {};

  if (sp.get("action") === "create-gallery-table") {
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "GalleryImage" (
          "id" TEXT NOT NULL,
          "url" TEXT NOT NULL,
          "alt" TEXT NOT NULL,
          "caption" TEXT,
          "featured" BOOLEAN NOT NULL DEFAULT false,
          "order" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
        );`);
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "GalleryImage_order_idx" ON "GalleryImage"("order");`,
      );
      out.tableCreated = true;
    } catch (e) {
      return jsonError("DDL failed: " + (e as Error).message?.slice(0, 300), 500);
    }
  }

  try {
    out.galleryCount = await prisma.galleryImage.count();
  } catch (e) {
    out.galleryError = (e as Error).message?.slice(0, 200);
  }
  return jsonOk(out);
}
