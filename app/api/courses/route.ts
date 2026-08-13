import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { courseSchema } from "@/lib/validations";
import { toCourseData } from "@/lib/courses-write";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const courses = await prisma.course.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
    return jsonOk(courses);
  } catch {
    return jsonError("Could not load courses. Has the database table been created (npm run db:push)?", 500);
  }
}

export async function POST(req: NextRequest) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = courseSchema.parse(body);
    const course = await prisma.course.create({ data: toCourseData(data) });
    revalidatePath("/courses");
    return jsonOk(course, 201);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("Validation failed", 422, { slug: "That slug is already in use." });
    }
    return jsonError("Could not create course", 500);
  }
}
