import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { projectSchema } from "@/lib/validations";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = projectSchema.parse(body);
    const project = await prisma.project.update({
      where: { id: params.id },
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
    return jsonOk(project);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("Validation failed", 422, { slug: "That slug is already in use." });
    }
    return jsonError("Could not update project", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return jsonOk({ id: params.id });
  } catch {
    return jsonError("Could not delete project", 500);
  }
}
