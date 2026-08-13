import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Course } from "@prisma/client";
import { Clock, BarChart3, Award, Globe, ListChecks, BookOpen, Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { CourseGrid } from "@/components/courses/CourseCard";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import { AmazonLink } from "@/components/marketplace/AmazonLink";
import {
  getCourseBySlug,
  getRelatedCourses,
  getCourses,
  getAvailableCourseCategories,
  getAvailableCourseProviders,
} from "@/lib/courses-data";
import { parseCourseFilters, type RawSearchParams } from "@/lib/courses-params";
import { getRequestCountry } from "@/lib/marketplace-server";
import { ensureRates } from "@/lib/currency";
import { localizedCoursePrice } from "@/lib/courses-price";
import {
  isCourseCategorySlug,
  courseCategoryLabel,
  courseCategoryIcon,
  COURSE_CATEGORY_MAP,
  coursePath,
  courseCtaLabel,
  courseDiscountPercent,
  resolveCourseUrl,
  COURSE_DISCLOSURE,
  coursesUrl,
} from "@/lib/courses";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string }; searchParams: RawSearchParams };

function truncate(s: string, n: number) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}
function abs(u?: string | null) {
  if (!u) return undefined;
  return u.startsWith("http") ? u : `${siteUrl()}${u}`;
}

type Resolved = { kind: "category"; slug: string } | { kind: "course"; course: Course } | { kind: "none" };

async function resolveSlug(slug: string): Promise<Resolved> {
  if (isCourseCategorySlug(slug)) return { kind: "category", slug };
  const course = await getCourseBySlug(slug);
  if (course) return { kind: "course", course };
  const cats = await getAvailableCourseCategories();
  if (cats.some((c) => c.slug === slug)) return { kind: "category", slug };
  return { kind: "none" };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const r = await resolveSlug(params.slug);
  if (r.kind === "none") return { title: "Not found" };

  if (r.kind === "category") {
    const name = courseCategoryLabel(r.slug);
    const title = `${name} Courses — Compare & Enrol | NBN MARKET`;
    const desc = `Discover and compare the best ${name} online courses on NBN Market. Ratings, level, duration and pricing for your country — enrol through trusted providers.`;
    return {
      title: `${name} Courses`,
      description: desc,
      alternates: { canonical: `/courses/${r.slug}` },
      openGraph: { title, description: desc, type: "website" },
      twitter: { card: "summary_large_image", title, description: desc },
    };
  }

  const c = r.course;
  const title = `${c.title} — ${c.provider} | NBN MARKET`;
  const desc = truncate(c.shortDescription || c.description || c.title, 155);
  const image = abs(c.image);
  return {
    title: c.title,
    description: desc,
    alternates: { canonical: `/courses/${c.slug}` },
    openGraph: { title, description: desc, type: "website", images: image ? [{ url: image }] : undefined },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function CourseOrCategoryPage({ params, searchParams }: Params) {
  const r = await resolveSlug(params.slug);
  if (r.kind === "none") notFound();

  const country = getRequestCountry();
  await ensureRates();

  if (r.kind === "category") {
    return <CategoryView slug={r.slug} country={country} searchParams={searchParams} />;
  }
  return <CourseDetailView course={r.course} country={country} />;
}

/* ------------------------------------------------------------------ *
 * Category listing
 * ------------------------------------------------------------------ */
async function CategoryView({
  slug,
  country,
  searchParams,
}: {
  slug: string;
  country: string;
  searchParams: RawSearchParams;
}) {
  const name = courseCategoryLabel(slug);
  const icon = courseCategoryIcon(slug);
  const meta = COURSE_CATEGORY_MAP[slug];
  const { filters, current } = parseCourseFilters({ ...searchParams, category: slug });

  const [courses, categories, providers] = await Promise.all([
    getCourses({ ...filters, category: slug }),
    getAvailableCourseCategories(),
    getAvailableCourseProviders(),
  ]);

  const crumbs: Crumb[] = [
    { name: "NBN Market", url: "/nbnmarket" },
    { name: "Online Courses", url: "/courses" },
    { name, url: `/courses/${slug}` },
  ];

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${name} Courses`,
    url: coursesUrl(`/${slug}`),
    numberOfItems: courses.length,
  };

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), itemList]} />
      <PageView event="category_view" params={{ category: slug, country }} />
      <CourseHeader activeCategory={slug} />

      <Container className="space-y-4 py-5">
        <Breadcrumbs items={crumbs} />
        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden>{icon}</span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">{name} Courses</h1>
            {meta?.blurb && <p className="mt-1 max-w-2xl text-sm text-ink-body">{meta.blurb}</p>}
          </div>
        </div>

        <CourseCatalog
          courses={courses}
          country={country}
          categories={categories}
          providers={providers}
          current={current}
          hideCategory
          emptyMessage={`No ${name} courses yet — check back soon, or browse all courses.`}
        />
      </Container>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Course detail
 * ------------------------------------------------------------------ */
async function CourseDetailView({ course, country }: { course: Course; country: string }) {
  const cat = course.category ? COURSE_CATEGORY_MAP[course.category] : undefined;
  const url = resolveCourseUrl(course);
  const discount = courseDiscountPercent(course);
  const { price, original, isFree, hasPrice } = localizedCoursePrice(course, country);
  const showRating = course.rating != null && course.reviewCount;
  const related = await getRelatedCourses(course);

  const crumbs: Crumb[] = [
    { name: "NBN Market", url: "/nbnmarket" },
    { name: "Online Courses", url: "/courses" },
    ...(cat ? [{ name: cat.name, url: coursePath(cat.slug) }] : []),
    { name: course.title, url: coursePath(course.slug) },
  ];

  // Structured data — only assert what is present & truthful. Demo courses carry
  // placeholder data, so they emit NO rating/offer structured data.
  const realData = !course.demo;
  const offers =
    realData && course.price != null
      ? {
          "@type": "Offer",
          ...(url ? { url } : {}),
          price: course.price,
          priceCurrency: course.currency || "USD",
          category: course.price === 0 ? "Free" : "Paid",
          availability: "https://schema.org/InStock",
        }
      : undefined;
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    ...(course.shortDescription || course.description
      ? { description: truncate(course.shortDescription || course.description || "", 300) }
      : {}),
    provider: { "@type": "Organization", name: course.provider },
    ...(course.image ? { image: [abs(course.image)] } : {}),
    ...(course.instructor && realData
      ? { instructor: { "@type": "Person", name: course.instructor } }
      : {}),
    ...(course.language ? { inLanguage: course.language } : {}),
    ...(offers ? { offers } : {}),
    ...(realData && course.rating != null && course.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: course.rating,
            reviewCount: course.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  const CtaButton = ({ full }: { full?: boolean }) =>
    url ? (
      <AmazonLink
        href={url}
        productSlug={course.slug}
        country={country}
        platform={course.provider}
        className={`inline-flex items-center justify-center rounded-lg bg-[#ff9900] px-5 py-3 text-sm font-bold text-[#231a00] transition hover:brightness-105 ${full ? "w-full" : ""}`}
      >
        {courseCtaLabel(course, "detail")}
      </AmazonLink>
    ) : (
      <span
        title="Affiliate link coming soon"
        className={`inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-ink-line/60 px-5 py-3 text-sm font-bold text-ink-muted ${full ? "w-full" : ""}`}
      >
        Link coming soon
      </span>
    );

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), courseJsonLd]} />
      <PageView event="product_view" params={{ product: course.slug, country }} />
      <CourseHeader activeCategory={course.category || undefined} />

      <Container className="py-4">
        <Breadcrumbs items={crumbs} />

        {course.demo && (
          <p className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            This is a clearly-marked demo course used to preview the layout. Its rating, price and instructor are
            placeholder values, and the enrol link is not yet active.
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Main */}
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded bg-cyan/10 px-2 py-0.5 text-xs font-semibold text-cyan-deep">
                {course.provider}
              </span>
              {cat && (
                <span className="text-xs text-ink-muted">
                  {cat.icon} {cat.name}
                </span>
              )}
              {course.bestseller && !course.demo && (
                <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#231a00]">
                  Bestseller
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-ink sm:text-3xl">
              {course.title}
            </h1>
            {course.shortDescription && (
              <p className="mt-2 text-sm text-ink-body sm:text-base">{course.shortDescription}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {showRating && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-amber-500" aria-hidden>
                    {"★★★★★".slice(0, Math.round(Number(course.rating)))}
                    <span className="text-ink-line">{"★★★★★".slice(Math.round(Number(course.rating)))}</span>
                  </span>
                  <span className="text-ink-muted">
                    {Number(course.rating).toFixed(1)} · {Number(course.reviewCount).toLocaleString("en-GB")} ratings
                  </span>
                </span>
              )}
              {course.instructor && <span className="text-ink-muted">By {course.instructor}</span>}
              {course.lastUpdated && <span className="text-ink-muted">Updated {course.lastUpdated}</span>}
            </div>

            {/* Meta chips */}
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {course.level && <Chip icon={<BarChart3 className="h-4 w-4" />}>{course.level}</Chip>}
              {course.duration && <Chip icon={<Clock className="h-4 w-4" />}>{course.duration}</Chip>}
              {course.lectureCount != null && (
                <Chip icon={<BookOpen className="h-4 w-4" />}>{course.lectureCount} lectures</Chip>
              )}
              {course.language && <Chip icon={<Globe className="h-4 w-4" />}>{course.language}</Chip>}
              {course.certificateAvailable && <Chip icon={<Award className="h-4 w-4" />}>Certificate</Chip>}
            </div>

            {course.whatYouLearn.length > 0 && (
              <Section title="What you'll learn">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {course.whatYouLearn.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-body">
                      <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-cyan-deep" />
                      {w}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {course.description && (
              <Section title="Course description">
                <p className="max-w-prose whitespace-pre-line text-sm leading-relaxed text-ink-body">
                  {course.description}
                </p>
              </Section>
            )}

            {course.requirements.length > 0 && (
              <Section title="Requirements">
                <ul className="list-disc space-y-1 pl-5 text-sm text-ink-body marker:text-cyan">
                  {course.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </Section>
            )}

            {course.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {course.tags.map((t) => (
                  <span key={t} className="rounded-full bg-sand-soft px-2.5 py-1 text-xs text-ink-muted">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Enrol box */}
          <aside className="lg:sticky lg:top-4 lg:self-start">
            <div className="overflow-hidden rounded-xl border border-ink-line bg-surface shadow-card">
              {course.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.image}
                  alt={course.imageAlt || course.title}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-4">
                {hasPrice && (
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-ink">{isFree ? "Free" : price}</span>
                    {original && <span className="text-sm text-ink-muted line-through">{original}</span>}
                    {discount != null && (
                      <span className="rounded bg-rose-600 px-1.5 py-0.5 text-xs font-bold text-white">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-1 text-xs text-ink-muted">
                  Price shown for your country · confirm the live price on {course.provider}.
                </p>

                <div className="mt-4">
                  <CtaButton full />
                </div>

                <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-ink-muted">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {COURSE_DISCLOSURE}
                </p>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-8 rounded-lg border border-ink-line bg-surface p-4 sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-ink">Related courses</h2>
            <CourseGrid courses={related} country={country} />
          </section>
        )}
      </Container>
    </>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-line bg-surface px-3 py-1.5 text-ink-body">
      <span className="text-cyan-deep">{icon}</span>
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
