import type { Course } from "@prisma/client";
import { CourseFilters } from "./CourseFilters";
import { CourseGrid } from "./CourseCard";
import type { AvailableCourseCategory } from "@/lib/courses-data";
import { COURSE_LEVELS, COURSE_LANGUAGES, COURSE_SORTS } from "@/lib/courses";

/**
 * Shared catalog block: filter/sort bar + responsive course grid. Used by both
 * the main /courses page and the category pages so filtering, sorting and card
 * rendering stay identical everywhere.
 */
export function CourseCatalog({
  courses,
  country,
  categories,
  providers,
  current,
  hideCategory = false,
  emptyMessage,
}: {
  courses: Course[];
  country: string;
  categories: AvailableCourseCategory[];
  providers: { name: string; count: number }[];
  current: Record<string, string>;
  hideCategory?: boolean;
  emptyMessage?: string;
}) {
  return (
    <div className="space-y-4">
      <CourseFilters
        categories={categories.map((c) => ({ value: c.slug, label: `${c.name} (${c.count})` }))}
        providers={providers.map((p) => ({ value: p.name, label: `${p.name} (${p.count})` }))}
        levels={COURSE_LEVELS.map((l) => ({ value: l, label: l }))}
        languages={COURSE_LANGUAGES.map((l) => ({ value: l, label: l }))}
        sorts={COURSE_SORTS.map((s) => ({ value: s.value, label: s.label }))}
        current={current}
        hideCategory={hideCategory}
        resultCount={courses.length}
      />
      <CourseGrid courses={courses} country={country} empty={emptyMessage} />
    </div>
  );
}
