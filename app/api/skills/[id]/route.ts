import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { skillSchema } from "@/lib/validations";
import { ZodError } from "zod";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = skillSchema.parse(body);
    const skill = await prisma.skill.update({
      where: { id: params.id },
      data: {
        name: data.name,
        category: data.category,
        proficiency: data.proficiency ?? null,
        icon: data.icon || null,
        order: data.order,
      },
    });
    return jsonOk(skill);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    return jsonError("Could not update skill", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    await prisma.skill.delete({ where: { id: params.id } });
    return jsonOk({ id: params.id });
  } catch {
    return jsonError("Could not delete skill", 500);
  }
}
