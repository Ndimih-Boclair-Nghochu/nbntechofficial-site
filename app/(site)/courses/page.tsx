import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Globe2, Scale } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { CourseGrid } from "@/components/courses/CourseCard";
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
  courseCategoriesByGroup,
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

  const groups = courseCategoriesByGroup();
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
            {/* Hero */}
            <section className="overflow-hidden rounded-2xl border border-ink-line bg-gradient-to-br from-navy-950 to-navy-900 p-6 text-white sm:p-8">
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-1 h-8 w-8 shrink-0 text-cyan" />
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Online Courses</h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
                    Discover and compare online courses from trusted providers — from cloud, AWS and DevOps to
                    programming, data science, design and business. {COURSES_TAGLINE}.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {TRUST.map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    title={sub}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-cyan" />
                    <span className="whitespace-nowrap text-xs font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Category groups */}
            <section>
              <h2 className="mb-3 text-lg font-bold text-ink">Browse by category</h2>
              <div className="space-y-5">
                {groups.map((g) => (
                  <div key={g.group}>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">{g.group}</h3>
                    <div className="flex flex-wrap gap-2">
                      {g.categories.map((c) => {
                        const has = availableSlugs.has(c.slug);
                        return (
                          <Link
                            key={c.slug}
                            href={coursePath(c.slug)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-ink-line bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-sm transition hover:border-cyan hover:text-cyan-deep"
                          >
                            <span aria-hidden>{c.icon}</span>
                            {c.name}
                            {has && <span className="text-xs text-cyan-deep">•</span>}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured */}
            {featured.length > 0 && (
              <section className="rounded-2xl border border-ink-line bg-surface p-4 shadow-card sm:p-5">
                <h2 className="mb-4 text-lg font-bold tracking-tight text-ink">Featured courses</h2>
                <CourseGrid courses={featured} country={country} />
              </section>
            )}

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
