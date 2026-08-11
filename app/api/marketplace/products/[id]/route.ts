import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { marketProductSchema } from "@/lib/validations";
import { toProductData } from "@/lib/marketplace-write";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = marketProductSchema.parse(body);
    const product = await prisma.marketProduct.update({
      where: { id: params.id },
      data: toProductData(data),
    });
    return jsonOk(product);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("Validation failed", 422, { slug: "That slug is already in use." });
    }
    return jsonError("Could not update product", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    await prisma.marketProduct.delete({ where: { id: params.id } });
    return jsonOk({ id: params.id });
  } catch {
    return jsonError("Could not delete product", 500);
  }
}
