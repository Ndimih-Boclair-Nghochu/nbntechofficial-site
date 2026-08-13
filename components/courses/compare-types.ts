/**
 * Serializable, display-ready shape of a course used by the client-side compare
 * feature. The server pre-localizes prices into display strings (see
 * toCompareCourse in lib/courses-price.ts) so the client tray needs no currency
 * logic. Kept dependency-free so both server and client modules can import it.
 */
export type CompareCourse = {
  slug: string;
  title: string;
  provider: string;
  image: string | null;
  categoryLabel: string;
  priceLabel: string;
  originalLabel: string;
  rating: number | null;
  reviewCount: number | null;
  duration: string | null;
  level: string | null;
  lectureCount: number | null;
  certificate: boolean;
  url: string | null;
};

export const COMPARE_MAX = 4;
export const COMPARE_STORAGE_KEY = "nbn_course_compare";
