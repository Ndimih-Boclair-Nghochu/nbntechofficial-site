import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { courseSchema } from "@/lib/validations";
import { toCourseData } from "@/lib/courses-write";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

/** Refresh the courses storefront so an edit/delete shows immediately. */
function revalidateCourses() {
  try {
    revalidatePath("/courses");
    revalidatePath("/courses/[slug]", "page");
    revalidatePath("/sitemap.xml");
  } catch {
    /* dynamic pages anyway — best-effort */
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = courseSchema.parse(body);
    const course = await prisma.course.update({ where: { id: params.id }, data: toCourseData(data) });
    revalidateCourses();
    return jsonOk(course);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("Validation failed", 422, { slug: "That slug is already in use." });
    }
    return jsonError("Could not update course", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    // deleteMany makes deleting an already-removed course a harmless no-op
    // (idempotent) rather than a 500.
    await prisma.course.deleteMany({ where: { id: params.id } });
    revalidateCourses();
    return jsonOk({ id: params.id, deleted: true });
  } catch {
    return jsonError("Could not delete course", 500);
  }
}
