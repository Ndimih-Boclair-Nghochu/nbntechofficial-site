import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { skillSchema } from "@/lib/validations";
import { ZodError } from "zod";

export const runtime = "nodejs";

export async function GET() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  return jsonOk(skills);
}

export async function POST(req: NextRequest) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = skillSchema.parse(body);
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        category: data.category,
        proficiency: data.proficiency ?? null,
        icon: data.icon || null,
        order: data.order,
      },
    });
    return jsonOk(skill, 201);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    return jsonError("Could not create skill", 500);
  }
}
