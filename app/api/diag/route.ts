import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api";

/** TEMPORARY diagnostic — token-guarded. REMOVE after debugging. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = "nbn-diag-8462";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("token") !== TOKEN) {
    return new Response("Not found", { status: 404 });
  }
  const out: Record<string, unknown> = {};
  try {
    const projects = await prisma.project.findMany({
      select: { slug: true, category: true, coverImageUrl: true, featured: true },
      orderBy: { order: "asc" },
    });
    out.projectCount = projects.length;
    out.projects = projects;
  } catch (e) {
    out.projectError = (e as Error).message?.slice(0, 300);
  }
  try {
    // list the enum values Postgres actually has for ProjectCategory
    const rows = await prisma.$queryRawUnsafe<{ enumlabel: string }[]>(
      `SELECT e.enumlabel FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid WHERE t.typname = 'ProjectCategory' ORDER BY e.enumsortorder;`,
    );
    out.projectCategoryEnum = rows.map((r) => r.enumlabel);
  } catch (e) {
    out.enumError = (e as Error).message?.slice(0, 300);
  }
  return jsonOk(out);
}
