import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { CourseGrid } from "@/components/courses/CourseCard";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import { ArticleHeader, Prose, ArticleBox } from "@/components/blog/ArticleShell";
import { getCourseBySlug, getRelatedCourses } from "@/lib/courses-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { money } from "@/lib/marketplace";
import { siteUrl } from "@/lib/utils";
import { resolveCourseUrl, courseCtaLabel, courseDiscountPercent, courseCategoryLabel, COURSE_DISCLOSURE } from "@/lib/courses";
import { courseBlogTitle, courseBlogDescription, courseBlogKeywords, courseBlogUrl, currentYear, readingTime } from "@/lib/blog";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = await getCourseBySlug(params.slug);
  if (!c) return { title: "Article not found" };
  const title = courseBlogTitle(c.title);
  const description = courseBlogDescription(c.title, c.provider);
  return {
    title,
    description,
    keywords: courseBlogKeywords(c),
    alternates: { canonical: `/nbnmarket/blog/course/${c.slug}` },
    openGraph: { title, description, type: "article", url: courseBlogUrl(c.slug), images: c.image ? [{ url: c.image }] : undefined },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CourseBlogArticle({ params }: Params) {
  const c = await getCourseBySlug(params.slug);
  if (!c) notFound();

  const country = getRequestCountry();
  const url = resolveCourseUrl(c);
  const coursePath = `/courses/${c.slug}`;
  const catName = courseCategoryLabel(c.category) || "Online course";
  const title = courseBlogTitle(c.title);
  const pct = courseDiscountPercent(c);
  const cur = c.currency || "USD";
  const related = (await getRelatedCourses(c, 6)) || [];
  const lead = `${c.shortDescription || c.description || `${c.title} is an online course on ${c.provider}.`} Here’s what you’ll learn, who it’s for, and whether it’s worth enrolling in ${currentYear()}. Course prices on ${c.provider} change often — we link you straight to the live price.`;

  const details: { label: string; value: string }[] = [];
  if (c.level) details.push({ label: "Level", value: c.level });
  if (c.duration) details.push({ label: "Duration", value: c.duration });
  if (c.lectureCount) details.push({ label: "Lectures", value: String(c.lectureCount) });
  if (c.language) details.push({ label: "Language", value: c.language });
  if (c.instructor) details.push({ label: "Instructor", value: c.instructor });
  details.push({ label: "Certificate", value: c.certificateAvailable ? "Yes" : "Not specified" });
  details.push({ label: "Provider", value: c.provider });

  const faqs = [
    {
      q: `Is the ${c.title} course worth it in ${currentYear()}?`,
      a: `If you want to learn ${catName.toLowerCase()}, it's a solid pick${c.rating ? ` — it currently holds a ${c.rating}★ rating${c.reviewCount ? ` from ${Number(c.reviewCount).toLocaleString("en-US")} reviews` : ""}` : ""}. Check the live price and enrol if it fits your goals and budget.`,
    },
    { q: `How much does the ${c.title} course cost?`, a: `Course prices on ${c.provider} change often (and frequently go on sale). Tap through to ${c.provider} to see today's exact price before you enrol.` },
    { q: `Where do I take the ${c.title} course?`, a: `On ${c.provider}. Use the "View course" button here — it opens the official ${c.provider} page where you enrol and access all lessons.` },
  ];
  const rt = readingTime(lead, ...c.whatYouLearn, ...c.requirements, ...faqs.flatMap((f) => [f.q, f.a]));

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "NBN Market", url: "/nbnmarket" },
    { name: "Blog", url: "/nbnmarket/blog" },
    { name: c.title, url: `/nbnmarket/blog/course/${c.slug}` },
  ];

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: courseBlogDescription(c.title, c.provider),
    image: c.image || undefined,
    keywords: courseBlogKeywords(c).join(", "),
    inLanguage: "en",
    author: { "@type": "Organization", name: "NBN TECH" },
    publisher: { "@type": "Organization", name: "NBN MARKET", logo: { "@type": "ImageObject", url: `${siteUrl()}/icon.png` } },
    mainEntityOfPage: courseBlogUrl(c.slug),
  };
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.title,
    description: c.shortDescription || c.description || title,
    provider: { "@type": "Organization", name: c.provider },
    ...(c.instructor ? { instructor: { "@type": "Person", name: c.instructor } } : {}),
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), blogJsonLd, courseJsonLd, faqJsonLd]} />
      <PageView event="blog_view" params={{ post: `course:${c.slug}` }} />
      <MarketHeader />
      <Container className="pb-8 pt-2">
        <Breadcrumbs items={crumbs} />

        <ArticleHeader
          eyebrow={`🎓  ${catName} · Course review · ${currentYear()}`}
          title={title}
          image={c.image}
          imageAlt={c.imageAlt || c.title}
          readMinutes={rt}
        />

        <Prose className="mt-10">
          <p className="lead">{lead}</p>
        </Prose>

        <ArticleBox className="mt-8 flex flex-wrap items-center gap-3">
          <p className="text-sm text-ink-muted">
            {c.price != null ? <>Around <b className="text-ink">{money(c.price, cur)}</b>{pct ? ` · 🔥 ${pct}% off` : ""} — </> : ""}
            live price on {c.provider}.
          </p>
          <div className="ml-auto flex flex-wrap gap-2">
            <Link href={coursePath} className="inline-flex items-center rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
              Course details
            </Link>
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center rounded-lg border border-ink-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-cyan hover:text-cyan-deep">
                {courseCtaLabel(c, "detail")}
              </a>
            )}
          </div>
        </ArticleBox>

        {c.whatYouLearn.length > 0 && (
          <Prose className="mt-12">
            <h2>What you’ll learn</h2>
            <ul>
              {c.whatYouLearn.slice(0, 10).map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </Prose>
        )}

        <section className="mx-auto mt-12 max-w-2xl">
          <h2 className="font-serif text-2xl font-bold text-ink">Course at a glance</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {details.map((d) => (
              <div key={d.label} className="rounded-xl border border-ink-line bg-surface p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{d.label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink">{d.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Prose className="mt-12">
          {c.requirements.length > 0 && (
            <>
              <h2>Requirements</h2>
              <ul>
                {c.requirements.slice(0, 8).map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </>
          )}
          <h2>FAQs</h2>
          {faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <p>
            <Link href="/courses">→ Browse more online courses</Link>
          </p>
        </Prose>

        {related.length > 0 && (
          <section className="mt-14">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-5 font-serif text-2xl font-bold text-ink">Related courses</h2>
              <CourseGrid courses={related} country={country} />
            </div>
          </section>
        )}

        <p className="mx-auto mt-10 max-w-2xl text-xs text-ink-muted">{COURSE_DISCLOSURE}</p>
      </Container>
    </>
  );
}
