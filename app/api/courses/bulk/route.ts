import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { courseSchema } from "@/lib/validations";
import { toCourseData } from "@/lib/courses-write";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * Admin-only BULK import of courses. Accepts a JSON array (or { courses: [...] })
 * where each item is a course with its OWN affiliateUrl. Upserts by slug so the
 * whole catalogue — including 100+ courses each with a different Impact tracking
 * URL — can be added or updated in one request, with zero source changes.
 *
 * Each row is validated independently; invalid rows are reported and skipped so
 * one bad entry never blocks the rest. Missing slugs are derived from the title.
 */
export async function POST(req: NextRequest) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Body must be valid JSON.", 400);
  }

  const rawList = Array.isArray(body)
    ? body
    : Array.isArray((body as { courses?: unknown[] })?.courses)
      ? (body as { courses: unknown[] }).courses
      : null;

  if (!rawList) {
    return jsonError("Expected a JSON array of courses (or { \"courses\": [...] }).", 400);
  }
  if (rawList.length === 0) return jsonError("No courses to import.", 400);
  if (rawList.length > 500) return jsonError("Please import at most 500 courses per request.", 400);

  const errors: { index: number; title?: string; error: string }[] = [];
  let imported = 0;

  try {
    for (let i = 0; i < rawList.length; i++) {
      const raw = rawList[i] as Record<string, unknown>;
      // Derive a slug from the title when one isn't supplied.
      if ((!raw.slug || String(raw.slug).trim() === "") && raw.title) {
        raw.slug = slugify(String(raw.title));
      }
      const parsed = courseSchema.safeParse(raw);
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        errors.push({
          index: i,
          title: typeof raw.title === "string" ? raw.title : undefined,
          error: first ? `${first.path.join(".")}: ${first.message}` : "Validation failed",
        });
        continue;
      }
      const data = toCourseData(parsed.data);
      await prisma.course.upsert({ where: { slug: parsed.data.slug }, update: data, create: data });
      imported += 1;
    }
  } catch {
    return jsonError("Import failed while writing to the database. Has the table been created (npm run db:push)?", 500);
  }

  try {
    revalidatePath("/courses");
    revalidatePath("/sitemap.xml");
  } catch {
    /* best-effort */
  }

  const courses = await prisma.course.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
  return jsonOk({ imported, failed: errors.length, errors, courses });
}
