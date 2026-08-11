import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { marketProductSchema } from "@/lib/validations";
import { toProductData } from "@/lib/marketplace-write";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  const products = await prisma.marketProduct.findMany({
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });
  return jsonOk(products);
}

export async function POST(req: NextRequest) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = marketProductSchema.parse(body);
    const product = await prisma.marketProduct.create({ data: toProductData(data) });
    return jsonOk(product, 201);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("Validation failed", 422, { slug: "That slug is already in use." });
    }
    return jsonError("Could not create product", 500);
  }
}
