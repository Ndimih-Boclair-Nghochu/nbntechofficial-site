import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { projectSchema } from "@/lib/validations";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return jsonOk(projects);
}

export async function POST(req: NextRequest) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = projectSchema.parse(body);
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        description: data.description,
        role: data.role || null,
        techStack: data.techStack,
        coverImageUrl: data.coverImageUrl || null,
        coverImageAlt: data.coverImageAlt || null,
        gallery: data.gallery,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        featured: data.featured,
        order: data.order,
        category: data.category,
      },
    });
    return jsonOk(project, 201);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("Validation failed", 422, { slug: "That slug is already in use." });
    }
    return jsonError("Could not create project", 500);
  }
}
