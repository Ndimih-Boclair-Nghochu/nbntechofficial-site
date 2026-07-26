import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { testimonialSchema } from "@/lib/validations";
import { ZodError } from "zod";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = testimonialSchema.parse(body);
    const item = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        name: data.name,
        role: data.role || null,
        quote: data.quote,
        avatarUrl: data.avatarUrl || null,
        order: data.order,
      },
    });
    return jsonOk(item);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    return jsonError("Could not update testimonial", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    await prisma.testimonial.delete({ where: { id: params.id } });
    return jsonOk({ id: params.id });
  } catch {
    return jsonError("Could not delete testimonial", 500);
  }
}
