import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { galleryImageSchema } from "@/lib/validations";
import { ZodError } from "zod";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const data = galleryImageSchema.parse(await req.json());
    const item = await prisma.galleryImage.update({
      where: { id: params.id },
      data: {
        url: data.url,
        alt: data.alt,
        caption: data.caption || null,
        featured: data.featured,
        order: data.order,
      },
    });
    return jsonOk(item);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    return jsonError("Could not update image", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    await prisma.galleryImage.delete({ where: { id: params.id } });
    return jsonOk({ id: params.id });
  } catch {
    return jsonError("Could not delete image", 500);
  }
}
