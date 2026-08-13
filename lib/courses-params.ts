import type { CourseFilters } from "@/lib/courses-data";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v || "").trim();
}

/**
 * Parse URL search params into a typed CourseFilters (for the DB query) plus a
 * flat `current` record (for the filter UI's selected values). Shared by the
 * /courses page and the category pages so parsing lives in one place.
 */
export function parseCourseFilters(sp: RawSearchParams): { filters: CourseFilters; current: Record<string, string> } {
  const q = one(sp.q);
  const category = one(sp.category);
  const provider = one(sp.provider);
  const level = one(sp.level);
  const language = one(sp.language);
  const rating = one(sp.rating);
  const maxPrice = one(sp.maxPrice);
  const free = one(sp.free);
  const sort = one(sp.sort);

  const filters: CourseFilters = {
    q: q || undefined,
    category: category || undefined,
    provider: provider || undefined,
    level: level || undefined,
    language: language || undefined,
    minRating: rating ? Number(rating) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    freeOnly: free === "1" || free === "true",
    sort: sort || undefined,
  };

  const current: Record<string, string> = {};
  if (q) current.q = q;
  if (category) current.category = category;
  if (provider) current.provider = provider;
  if (level) current.level = level;
  if (language) current.language = language;
  if (rating) current.rating = rating;
  if (maxPrice) current.maxPrice = maxPrice;
  if (free) current.free = free;
  if (sort) current.sort = sort;

  return { filters, current };
}

/** True when the visitor has an active search or any filter (vs. plain browse). */
export function hasActiveQuery(current: Record<string, string>): boolean {
  return ["q", "provider", "level", "language", "rating", "maxPrice", "free"].some((k) => current[k]);
}
