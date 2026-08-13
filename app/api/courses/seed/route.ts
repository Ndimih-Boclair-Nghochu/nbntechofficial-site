import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { DEMO_COURSES } from "@/lib/courses-demo";

export const runtime = "nodejs";

/**
 * Admin-only: load the clearly-marked DEMO courses so the Online Courses UI can
 * be previewed before real Udemy/Impact courses exist. Idempotent (upsert by
 * slug). Demo courses have no affiliate link and a "Demo" badge; delete them or
 * replace them with real courses at any time.
 */
export async function POST() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    for (const c of DEMO_COURSES) {
      await prisma.course.upsert({ where: { slug: c.slug }, update: c, create: c });
    }
    const courses = await prisma.course.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
    return jsonOk({ seeded: DEMO_COURSES.length, courses });
  } catch {
    return jsonError("Could not add demo courses. Has the database table been created (npm run db:push)?", 500);
  }
}
