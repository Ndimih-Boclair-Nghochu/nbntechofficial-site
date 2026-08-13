import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { marketProductSchema } from "@/lib/validations";
import { toProductData } from "@/lib/marketplace-write";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

/** Refresh the storefront so a deleted/updated product disappears immediately. */
function revalidateStorefront() {
  try {
    revalidatePath("/nbnmarket");
    revalidatePath("/nbnmarket/product/[slug]", "page");
    revalidatePath("/nbnmarket/category/[slug]", "page");
    revalidatePath("/sitemap.xml");
  } catch {
    /* revalidation is best-effort; pages are dynamic anyway */
  }
}

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
    revalidateStorefront();
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
    // Look up the slug first so we can also purge analytics rows keyed by slug.
    const existing = await prisma.marketProduct.findUnique({
      where: { id: params.id },
      select: { slug: true },
    });

    // Hard-delete the product and everything that references it, in one
    // transaction. We delete related rows explicitly (rather than relying on the
    // DB cascade) so a product is always fully removed even if an older FK
    // constraint was created without ON DELETE CASCADE. deleteMany is used so a
    // missing product/offer doesn't throw — the operation is idempotent.
    await prisma.$transaction([
      prisma.productOffer.deleteMany({ where: { productId: params.id } }),
      prisma.marketProduct.deleteMany({ where: { id: params.id } }),
    ]);

    // Best-effort cleanup of analytics events tied to this product's slug so no
    // trace of the product is left behind in the database.
    if (existing?.slug) {
      await prisma.analyticsEvent
        .deleteMany({ where: { productSlug: existing.slug } })
        .catch(() => {});
    }

    revalidateStorefront();
    return jsonOk({ id: params.id, deleted: true });
  } catch {
    return jsonError("Could not delete product", 500);
  }
}
