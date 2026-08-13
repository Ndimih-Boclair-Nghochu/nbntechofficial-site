import Link from "next/link";
import type { Course } from "@prisma/client";
import { Clock, BarChart3, Award } from "lucide-react";
import { ensureRates } from "@/lib/currency";
import {
  coursePath,
  courseCategoryLabel,
  courseCtaLabel,
  courseDiscountPercent,
  resolveCourseUrl,
} from "@/lib/courses";
import { localizedCoursePrice, toCompareCourse } from "@/lib/courses-price";
import { AmazonLink } from "@/components/marketplace/AmazonLink";
import { CompareToggle } from "./CompareToggle";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-sm leading-none text-amber-500" aria-hidden>
      {"★★★★★".slice(0, full)}
      <span className="text-ink-line">{"★★★★★".slice(full)}</span>
    </span>
  );
}

/**
 * Course card — consistent with the NBN Market product card. Image with badges
 * (Demo / Bestseller / discount), provider badge, title, short description,
 * rating, level + duration, localized price, and a tracked CTA. The CTA uses the
 * centrally-resolved affiliate URL; when none is set yet it shows a disabled
 * "link coming soon" state instead of a dead link.
 */
export async function CourseCard({ course, country }: { course: Course; country: string }) {
  await ensureRates();
  const href = coursePath(course.slug);
  const url = resolveCourseUrl(course);
  const discount = courseDiscountPercent(course);
  const { price, original, isFree, hasPrice } = localizedCoursePrice(course, country);
  const showRating = course.rating != null && course.reviewCount;
  const image = course.image || "/logo-mark.png";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-ink-line bg-surface transition-shadow hover:shadow-card-hover">
      <Link href={href} className="relative block aspect-video overflow-hidden bg-sand-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={course.imageAlt || course.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-2 top-2 flex flex-wrap gap-1">
          {course.demo && (
            <span className="rounded bg-navy-950/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Demo
            </span>
          )}
          {course.bestseller && !course.demo && (
            <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#231a00]">
              Bestseller
            </span>
          )}
        </span>
        {discount != null && (
          <span className="absolute right-2 top-2 rounded bg-rose-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
            {discount}% OFF
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded bg-cyan/10 px-1.5 py-0.5 text-[11px] font-semibold text-cyan-deep">
            {course.provider}
          </span>
          {course.category && (
            <span className="truncate text-[11px] text-ink-muted">{courseCategoryLabel(course.category)}</span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-ink">
          <Link href={href} className="hover:text-cyan-deep">{course.title}</Link>
        </h3>

        {course.shortDescription && (
          <p className="mt-1 line-clamp-2 text-xs text-ink-body">{course.shortDescription}</p>
        )}

        {showRating && (
          <span className="mt-1.5 flex items-center gap-1.5">
            <Stars rating={Number(course.rating)} />
            <span className="text-xs font-medium text-ink">{Number(course.rating).toFixed(1)}</span>
            <span className="text-xs text-ink-muted">({Number(course.reviewCount).toLocaleString("en-GB")})</span>
          </span>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
          {course.level && (
            <span className="inline-flex items-center gap-1">
              <BarChart3 className="h-3 w-3" /> {course.level}
            </span>
          )}
          {course.duration && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {course.duration}
            </span>
          )}
          {course.certificateAvailable && (
            <span className="inline-flex items-center gap-1">
              <Award className="h-3 w-3" /> Certificate
            </span>
          )}
        </div>

        {hasPrice && (
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink">{isFree ? "Free" : price}</span>
            {original && <span className="text-xs text-ink-muted line-through">{original}</span>}
          </div>
        )}

        <div className="mt-3 space-y-2 pt-1">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={href}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-ink-line px-3 py-2 text-sm font-semibold text-ink transition hover:border-cyan hover:text-cyan-deep"
            >
              Details
            </Link>
            <CompareToggle course={toCompareCourse(course, country)} />
          </div>
          {url ? (
            <AmazonLink
              href={url}
              productSlug={course.slug}
              country={country}
              platform={course.provider}
              className="flex w-full items-center justify-center rounded-lg bg-[#ff9900] px-3 py-2 text-sm font-bold text-[#231a00] transition hover:brightness-105"
            >
              {courseCtaLabel(course, "card")}
            </AmazonLink>
          ) : (
            <span
              title="Affiliate link coming soon"
              className="flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-ink-line/60 px-3 py-2 text-sm font-bold text-ink-muted"
            >
              Link coming soon
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function CourseGrid({
  courses,
  country,
  empty,
}: {
  courses: Course[];
  country: string;
  empty?: string;
}) {
  if (!courses.length) {
    return (
      <div className="rounded-lg border border-dashed border-ink-line bg-surface p-10 text-center text-ink-muted">
        {empty || "No courses here yet — check back soon."}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} country={country} />
      ))}
    </div>
  );
}
