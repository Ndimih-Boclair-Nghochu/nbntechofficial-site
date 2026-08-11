import type { Prisma } from "@prisma/client";
import type { MarketProductInput } from "@/lib/validations";

/**
 * Map a validated product input to a Prisma create/update payload. Empty
 * optional strings become null; JSON fields pass through as-is. Shared by the
 * create and update API routes so the mapping lives in one place.
 */
export function toProductData(
  data: MarketProductInput,
): Prisma.MarketProductUncheckedCreateInput {
  return {
    name: data.name,
    slug: data.slug,
    brand: data.brand || null,
    category: data.category || null,
    shortDescription: data.shortDescription || null,
    description: data.description || null,
    whoFor: data.whoFor || null,
    whyRecommend: data.whyRecommend || null,
    imageUrl: data.imageUrl || null,
    imageAlt: data.imageAlt || null,
    gallery: data.gallery,
    price: data.price ?? null,
    currency: data.currency || "EUR",
    rating: data.rating ?? null,
    reviewCount: data.reviewCount ?? null,
    features: data.features,
    pros: data.pros,
    cons: data.cons,
    tags: data.tags,
    related: data.related,
    guides: data.guides,
    specs: data.specs as unknown as Prisma.InputJsonValue,
    faqs: data.faqs as unknown as Prisma.InputJsonValue,
    amazonAvailability: data.amazonAvailability as unknown as Prisma.InputJsonValue,
    sku: data.sku || null,
    featured: data.featured,
    trending: data.trending,
    published: data.published,
    order: data.order,
  };
}
