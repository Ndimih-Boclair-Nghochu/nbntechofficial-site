import type { Course, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { COURSE_CATEGORIES, courseCategoryLabel, courseCategoryIcon, courseSlugToLabel } from "@/lib/courses";

/**
 * Resilient read layer for Online Courses, mirroring lib/marketplace-data.ts:
 * every query degrades gracefully so a missing/unreachable database (or a table
 * not yet pushed) renders empty sections rather than crashing — and `next build`
 * succeeds without a database.
 */

function logDbIssue(where: string, err: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[courses] ${where}: falling back to defaults —`, (err as Error)?.message);
  }
}

const publishedWhere = { published: true } as const;

export type CourseFilters = {
  q?: string;
  category?: string;
  subcategory?: string;
  provider?: string;
  level?: string;
  language?: string;
  minRating?: number;
  maxPrice?: number;
  freeOnly?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  sort?: string;
  take?: number;
};

function orderByForSort(sort?: string): Prisma.CourseOrderByWithRelationInput[] {
  switch (sort) {
    case "rating":
      return [{ rating: { sort: "desc", nulls: "last" } }, { reviewCount: "desc" }];
    case "popular":
      return [{ reviewCount: { sort: "desc", nulls: "last" } }, { rating: "desc" }];
    case "price-asc":
      return [{ price: { sort: "asc", nulls: "last" } }];
    case "price-desc":
      return [{ price: { sort: "desc", nulls: "last" } }];
    case "newest":
      return [{ createdAt: "desc" }];
    default:
      // Relevance: curated order, then freshest.
      return [{ order: "asc" }, { featured: "desc" }, { updatedAt: "desc" }];
  }
}

function whereForFilters(f: CourseFilters): Prisma.CourseWhereInput {
  const term = (f.q || "").trim();
  const and: Prisma.CourseWhereInput[] = [publishedWhere];

  if (f.category) and.push({ category: f.category });
  if (f.subcategory) and.push({ subcategory: f.subcategory });
  if (f.provider) and.push({ provider: f.provider });
  if (f.level) and.push({ level: f.level });
  if (f.language) and.push({ language: f.language });
  if (f.featured) and.push({ featured: true });
  if (f.bestseller) and.push({ bestseller: true });
  if (f.minRating != null && !Number.isNaN(f.minRating)) and.push({ rating: { gte: f.minRating } });
  if (f.freeOnly) and.push({ price: { equals: 0 } });
  else if (f.maxPrice != null && !Number.isNaN(f.maxPrice)) and.push({ price: { lte: f.maxPrice } });

  if (term) {
    and.push({
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { instructor: { contains: term, mode: "insensitive" } },
        { shortDescription: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        { provider: { contains: term, mode: "insensitive" } },
        { category: { contains: term, mode: "insensitive" } },
        { tags: { has: term.toLowerCase() } },
      ],
    });
  }

  return { AND: and };
}

export async function getCourses(f: CourseFilters = {}): Promise<Course[]> {
  try {
    return await prisma.course.findMany({
      where: whereForFilters(f),
      orderBy: orderByForSort(f.sort),
      take: f.take,
    });
  } catch (err) {
    logDbIssue("getCourses", err);
    return [];
  }
}

export async function getAllCourses(): Promise<Course[]> {
  return getCourses();
}

/** Admin listing — includes drafts. */
export async function getAllCoursesAdmin(): Promise<Course[]> {
  try {
    return await prisma.course.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
  } catch (err) {
    logDbIssue("getAllCoursesAdmin", err);
    return [];
  }
}

export async function getFeaturedCourses(take = 12): Promise<Course[]> {
  return getCourses({ featured: true, sort: "rating", take });
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    return await prisma.course.findFirst({ where: { slug, ...publishedWhere } });
  } catch (err) {
    logDbIssue("getCourseBySlug", err);
    return null;
  }
}

export async function getAllCourseSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.course.findMany({ where: publishedWhere, select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch (err) {
    logDbIssue("getAllCourseSlugs", err);
    return [];
  }
}

export async function searchCourses(q: string): Promise<Course[]> {
  if (!q.trim()) return [];
  return getCourses({ q, take: 60 });
}

/** Related courses: same category, else same provider; excludes the current one. */
export async function getRelatedCourses(course: Course, take = 4): Promise<Course[]> {
  try {
    const rows = await prisma.course.findMany({
      where: {
        ...publishedWhere,
        slug: { not: course.slug },
        OR: [
          ...(course.category ? [{ category: course.category }] : []),
          ...(course.provider ? [{ provider: course.provider }] : []),
        ],
      },
      orderBy: [{ featured: "desc" }, { rating: { sort: "desc", nulls: "last" } }],
      take,
    });
    return rows;
  } catch (err) {
    logDbIssue("getRelatedCourses", err);
    return [];
  }
}

export type AvailableCourseCategory = {
  slug: string;
  name: string;
  icon: string;
  count: number;
};

/**
 * Categories that ACTUALLY have published courses right now, so every category
 * chip shown leads to real courses. Known categories keep their curated
 * name/icon and order; admin-added ones get a derived label and sort after.
 */
export async function getAvailableCourseCategories(): Promise<AvailableCourseCategory[]> {
  try {
    const rows = await prisma.course.findMany({ where: publishedWhere, select: { category: true } });
    const counts = new Map<string, number>();
    for (const r of rows) {
      const c = (r.category || "").trim();
      if (!c) continue;
      counts.set(c, (counts.get(c) || 0) + 1);
    }
    const knownOrder = new Map(COURSE_CATEGORIES.map((c, i) => [c.slug, i]));
    return Array.from(counts.entries())
      .map(([slug, count]) => ({
        slug,
        name: courseCategoryLabel(slug) || courseSlugToLabel(slug),
        icon: courseCategoryIcon(slug),
        count,
      }))
      .sort((a, b) => {
        const ka = knownOrder.has(a.slug) ? knownOrder.get(a.slug)! : 1000;
        const kb = knownOrder.has(b.slug) ? knownOrder.get(b.slug)! : 1000;
        if (ka !== kb) return ka - kb;
        return b.count - a.count || a.name.localeCompare(b.name);
      });
  } catch (err) {
    logDbIssue("getAvailableCourseCategories", err);
    return [];
  }
}

/** Distinct providers that currently have published courses (for the filter). */
export async function getAvailableCourseProviders(): Promise<{ name: string; count: number }[]> {
  try {
    const rows = await prisma.course.groupBy({
      by: ["provider"],
      where: publishedWhere,
      _count: { provider: true },
      orderBy: { _count: { provider: "desc" } },
    });
    return rows.map((r) => ({ name: r.provider, count: r._count.provider }));
  } catch (err) {
    logDbIssue("getAvailableCourseProviders", err);
    return [];
  }
}

export async function countCourses(): Promise<number> {
  try {
    return await prisma.course.count();
  } catch (err) {
    logDbIssue("countCourses", err);
    return 0;
  }
}
