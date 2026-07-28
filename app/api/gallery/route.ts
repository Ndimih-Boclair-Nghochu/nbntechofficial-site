import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { galleryImageSchema } from "@/lib/validations";
import { ZodError } from "zod";

export const runtime = "nodejs";

export async function GET() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  const items = await prisma.galleryImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return jsonOk(items);
}

export async function POST(req: NextRequest) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const data = galleryImageSchema.parse(await req.json());
    const item = await prisma.galleryImage.create({
      data: {
        url: data.url,
        alt: data.alt,
        caption: data.caption || null,
        featured: data.featured,
        order: data.order,
      },
    });
    return jsonOk(item, 201);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    return jsonError("Could not add image", 500);
  }
}
