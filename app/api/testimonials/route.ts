import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { testimonialSchema } from "@/lib/validations";
import { ZodError } from "zod";

export const runtime = "nodejs";

export async function GET() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  const items = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return jsonOk(items);
}

export async function POST(req: NextRequest) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = testimonialSchema.parse(body);
    const item = await prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role || null,
        quote: data.quote,
        avatarUrl: data.avatarUrl || null,
        order: data.order,
      },
    });
    return jsonOk(item, 201);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    return jsonError("Could not create testimonial", 500);
  }
}
