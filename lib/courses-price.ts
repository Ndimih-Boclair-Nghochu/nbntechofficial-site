import type { Course } from "@prisma/client";
import { COUNTRY_MAP, money } from "@/lib/marketplace";
import { convert, roundPrice } from "@/lib/currency";
import { courseCategoryLabel, resolveCourseUrl } from "@/lib/courses";
import type { CompareCourse } from "@/components/courses/compare-types";

/**
 * Localize a course amount into the shopper's country currency, mirroring the
 * marketplace product pricing. Falls back to the original currency when a rate
 * is unavailable (never a fabricated number). Requires ensureRates() to have run.
 */
export function localizeCourseAmount(amount: number | null | undefined, from: string, country: string): string {
  if (amount == null) return "";
  const target = COUNTRY_MAP[country]?.currency;
  const src = from || "USD";
  if (target && target !== src) {
    const c = convert(amount, src, target);
    if (c != null) return money(roundPrice(c), target);
  }
  return money(amount, src);
}

export type LocalizedCoursePrice = {
  /** "Free", the localized price, or "" when no price is set. */
  price: string;
  /** Localized original (strike-through) price, or "". */
  original: string;
  isFree: boolean;
  hasPrice: boolean;
};

export function localizedCoursePrice(course: Course, country: string): LocalizedCoursePrice {
  if (course.price == null) {
    return { price: "", original: "", isFree: false, hasPrice: false };
  }
  if (course.price === 0) {
    return { price: "Free", original: "", isFree: true, hasPrice: true };
  }
  const from = course.currency || "USD";
  const price = localizeCourseAmount(course.price, from, country);
  const original =
    course.originalPrice != null && course.originalPrice > course.price
      ? localizeCourseAmount(course.originalPrice, from, country)
      : "";
  return { price, original, isFree: false, hasPrice: true };
}

/** Serialize a course into the display-ready shape the client compare tray uses. */
export function toCompareCourse(course: Course, country: string): CompareCourse {
  const { price, original } = localizedCoursePrice(course, country);
  return {
    slug: course.slug,
    title: course.title,
    provider: course.provider,
    image: course.image,
    categoryLabel: courseCategoryLabel(course.category),
    priceLabel: price,
    originalLabel: original,
    rating: course.rating,
    reviewCount: course.reviewCount,
    duration: course.duration,
    level: course.level,
    lectureCount: course.lectureCount,
    certificate: course.certificateAvailable,
    url: resolveCourseUrl(course),
  };
}
