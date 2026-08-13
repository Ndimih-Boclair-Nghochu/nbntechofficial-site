import type { Metadata } from "next";
import Link from "next/link";
import type { Course } from "@prisma/client";
import { ShieldCheck, Globe2, Scale } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { CourseCard } from "@/components/courses/CourseCard";
import { ProductRail, RailItem } from "@/components/marketplace/ProductRail";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import {
  getCourses,
  getFeaturedCourses,
  getAvailableCourseCategories,
  getAvailableCourseProviders,
} from "@/lib/courses-data";
import { parseCourseFilters, hasActiveQuery, type RawSearchParams } from "@/lib/courses-params";
import { getRequestCountry } from "@/lib/marketplace-server";
import { ensureRates } from "@/lib/currency";
import {
  COURSES_BRAND,
  COURSES_TAGLINE,
  coursesUrl,
  coursePath,
  COURSE_CATEGORIES,
} from "@/lib/courses";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const DESC =
  "NBN Market Online Courses — discover, compare and enrol in top online courses across cloud computing, AWS, DevOps, cybersecurity, programming, web development, data science, AI, design, business and more. Country-aware pricing.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `Online Courses — ${COURSES_TAGLINE} | ${COURSES_BRAND}` },
    description: DESC,
    keywords: [
      "online courses",
      "NBN Market courses",
      "cloud computing courses",
      "AWS courses",
      "DevOps courses",
      "cybersecurity courses",
      "programming courses",
      "web development courses",
      "data science courses",
      "Udemy courses",
    ],
    alternates: { canonical: "/courses" },
    openGraph: { title: `Online Courses — ${COURSES_TAGLINE}`, description: DESC, url: coursesUrl(), type: "website", siteName: COURSES_BRAND },
    twitter: { card: "summary_large_image", title: `Online Courses — ${COURSES_TAGLINE}`, description: DESC },
  };
}

const TRUST = [
  { icon: ShieldCheck, label: "Honest listings", sub: "Real details — never faked ratings" },
  { icon: Globe2, label: "Top providers", sub: "Udemy & more, one place" },
  { icon: Scale, label: "Compare courses", sub: "Price, rating, level, duration" },
];

/** A sideways-scrolling course rail — same look as the marketplace product rails. */
function Rail({
  title,
  href,
  courses,
  country,
}: {
  title: string;
  href?: string;
  courses: Course[];
  country: string;
}) {
  if (!courses.length) return null;
  return (
    <section className="rounded-2xl border border-ink-line bg-surface p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="flex items-baseline gap-2 text-lg font-bold tracking-tight text-ink">
          {title}
          <span className="text-xs font-normal text-ink-muted sm:hidden">· swipe →</span>
        </h2>
        {href && (
          <Link href={href} className="shrink-0 text-sm font-semibold text-cyan-deep hover:underline">
            See all
          </Link>
        )}
      </div>
      <ProductRail>
        {courses.map((c) => (
          <RailItem key={c.id}>
            <CourseCard course={c} country={country} showCompare={false} />
          </RailItem>
        ))}
      </ProductRail>
    </section>
  );
}

export default async function CoursesHome({ searchParams }: { searchParams: RawSearchParams }) {
  const country = getRequestCountry();
  await ensureRates();
  const { filters, current } = parseCourseFilters(searchParams);
  const browsing = !hasActiveQuery(current) && !current.category;

  const [courses, featured, categories, providers] = await Promise.all([
    getCourses(filters),
    browsing ? getFeaturedCourses(8) : Promise.resolve([]),
    getAvailableCourseCategories(),
    getAvailableCourseProviders(),
  ]);

  const availableSlugs = new Set(categories.map((c) => c.slug));

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Online Courses — ${COURSES_BRAND}`,
    url: coursesUrl(),
    description: DESC,
    isPartOf: { "@type": "WebSite", name: "NBN MARKET", url: `${siteUrl()}/nbnmarket` },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <PageView event="category_view" params={{ category: "courses", country }} />
      <CourseHeader query={current.q} />

      <Container className="space-y-6 py-5">
        {browsing ? (
          <>
            <h1 className="sr-only">Online Courses — {COURSES_TAGLINE}</h1>

            {/* Intro + trust strip — same light styling as the marketplace home */}
            <section className="space-y-3">
              <p className="max-w-3xl text-sm text-ink-body sm:text-base">
                Discover and compare online courses from trusted providers — from cloud, AWS and DevOps to
                programming, data science, design and business. {COURSES_TAGLINE}.
              </p>
              <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 lg:flex-wrap lg:justify-center">
                {TRUST.map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    title={sub}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-ink-line bg-surface px-3 py-1.5 shadow-sm"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-deep" />
                    <span className="whitespace-nowrap text-xs font-semibold text-ink">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Browse by category — compact tile grid */}
            <section>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-bold text-ink">Browse by category</h2>
                <span className="text-xs text-ink-muted">{COURSE_CATEGORIES.length} topics</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {COURSE_CATEGORIES.map((c) => {
                  const has = availableSlugs.has(c.slug);
                  return (
                    <Link
                      key={c.slug}
                      href={coursePath(c.slug)}
                      title={c.blurb}
                      className="group relative flex items-center gap-2.5 rounded-xl border border-ink-line bg-surface px-3 py-2.5 transition hover:border-cyan hover:shadow-card"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sand-soft text-base transition group-hover:bg-cyan/10" aria-hidden>
                        {c.icon}
                      </span>
                      <span className="min-w-0 truncate text-sm font-medium text-ink group-hover:text-cyan-deep">
                        {c.name}
                      </span>
                      {has && (
                        <span
                          className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan"
                          title="Courses available"
                          aria-label="Courses available"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Featured — sideways rail, like the marketplace */}
            <Rail title="Featured courses" href="/courses?sort=rating" courses={featured} country={country} />

            {/* Full catalog */}
            <section>
              <h2 className="mb-3 text-lg font-bold text-ink">All courses</h2>
              <CourseCatalog
                courses={courses}
                country={country}
                categories={categories}
                providers={providers}
                current={current}
                emptyMessage="Courses are being added to NBN Market. Check back shortly."
              />
            </section>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">
              {current.q ? `Courses for “${current.q}”` : "Browse courses"}
            </h1>
            <CourseCatalog
              courses={courses}
              country={country}
              categories={categories}
              providers={providers}
              current={current}
              emptyMessage="No courses match your search. Try different keywords or clear the filters."
            />
          </>
        )}
      </Container>
    </>
  );
}
