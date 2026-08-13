import type { Prisma } from "@prisma/client";
import type { CourseInput } from "@/lib/validations";

/**
 * Map a validated course input to a Prisma create/update payload. Empty optional
 * strings become null. Shared by the create and update API routes so the mapping
 * lives in one place.
 */
export function toCourseData(data: CourseInput): Prisma.CourseUncheckedCreateInput {
  return {
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    shortDescription: data.shortDescription || null,
    provider: data.provider || "Udemy",
    affiliateNetwork: data.affiliateNetwork || "Impact",
    affiliateUrl: data.affiliateUrl || null,
    image: data.image || null,
    imageAlt: data.imageAlt || null,
    category: data.category || null,
    subcategory: data.subcategory || null,
    instructor: data.instructor || null,
    price: data.price ?? null,
    currency: data.currency || "USD",
    originalPrice: data.originalPrice ?? null,
    discountPercentage: data.discountPercentage ?? null,
    rating: data.rating ?? null,
    reviewCount: data.reviewCount ?? null,
    duration: data.duration || null,
    lectureCount: data.lectureCount ?? null,
    level: data.level || null,
    language: data.language || "English",
    certificateAvailable: data.certificateAvailable,
    bestseller: data.bestseller,
    featured: data.featured,
    lastUpdated: data.lastUpdated || null,
    tags: data.tags,
    whatYouLearn: data.whatYouLearn,
    requirements: data.requirements,
    commissionRate: data.commissionRate ?? null,
    commissionType: data.commissionType || null,
    trackingId: data.trackingId || null,
    externalProductId: data.externalProductId || null,
    externalProductUrl: data.externalProductUrl || null,
    demo: data.demo,
    published: data.published,
    order: data.order,
  };
}
