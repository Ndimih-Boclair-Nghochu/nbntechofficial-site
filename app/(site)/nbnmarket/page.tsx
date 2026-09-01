import type { Metadata } from "next";
import Link from "next/link";
import type { MarketProduct, Course } from "@prisma/client";
import { ShieldCheck, Globe2, MapPin, ListChecks, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductCard, ProductGrid } from "@/components/marketplace/ProductCard";
import { ProductRail, RailItem } from "@/components/marketplace/ProductRail";
import { ShowcaseRail } from "@/components/marketplace/ShowcaseRail";
import { CategoryMenu } from "@/components/marketplace/CategoryMenu";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { CourseCard } from "@/components/courses/CourseCard";
import { TelegramJoinBanner } from "@/components/marketplace/TelegramJoin";
import { getAllProducts, getAvailableCategories, getCategoryActivity } from "@/lib/marketplace-data";
import { getCourses } from "@/lib/courses-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { BRAND, TAGLINE, marketplaceUrl, sortByAvailability, interleaveByCategory } from "@/lib/marketplace";
import { ensureRates } from "@/lib/currency";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MKT_DESC =
  "NBN MARKET — discover products worth buying. Compare laptops, developer gear, courses and electronics across Amazon and other trusted retailers, with prices and availability for your country.";

export const metadata: Metadata = {
  // Absolute title so the search result reads cleanly as "NBN MARKET …" and the
  // marketplace ranks for "NBN Market" independently of the NBN TECH site.
  title: { absolute: `${BRAND} — ${TAGLINE}` },
  description: MKT_DESC,
  keywords: [
    "NBN MARKET",
    "NBN Market",
    "NBN Market marketplace",
    "Ndimih Boclair Marketplace",
    "product discovery",
    "compare prices",
    "affiliate marketplace",
    "buy on Amazon",
    "online courses",
  ],
  alternates: { canonical: "/nbnmarket" },
  openGraph: { title: `${BRAND} — ${TAGLINE}`, description: MKT_DESC, url: marketplaceUrl(), type: "website", siteName: BRAND },
  twitter: { card: "summary_large_image", title: `${BRAND} — ${TAGLINE}`, description: MKT_DESC },
};

const TRUST = [
  { icon: ShieldCheck, label: "Independent picks", sub: "Real pros & cons — no fluff" },
  { icon: Globe2, label: "Multiple retailers", sub: "Amazon & more platforms" },
  { icon: MapPin, label: "Country-aware", sub: "Prices & availability for you" },
  { icon: ListChecks, label: "Honest data", sub: "Never faked prices or reviews" },
];

/** A section that scrolls sideways (rail) with a heading + optional link. */
function Rail({
  title,
  href,
  products,
  country,
}: {
  title: string;
  href?: string;
  products: MarketProduct[];
  country: string;
}) {
  if (!products.length) return null;
  return (
    <section className="rounded-2xl border border-ink-line bg-surface p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-baseline gap-2 text-lg font-bold tracking-tight text-ink">
          {title}
          <span className="rounded-full bg-sand-soft px-2 py-0.5 text-xs font-semibold text-ink-muted">{products.length}</span>
          <span className="text-xs font-normal text-ink-muted sm:hidden">· swipe →</span>
        </h2>
        {href && (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan/40 bg-cyan/10 px-3.5 py-1.5 text-sm font-bold text-cyan-deep transition hover:bg-cyan/20"
          >
            View all <span aria-hidden>→</span>
          </Link>
        )}
      </div>
      <ProductRail>
        {products.map((p) => (
          <RailItem key={p.id}>
            <ProductCard product={p} country={country} />
          </RailItem>
        ))}
        {href && (
          <RailItem>
            <Link
              href={href}
              className="flex h-full min-h-[200px] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-cyan/50 bg-cyan/5 p-4 text-center font-bold text-cyan-deep transition hover:bg-cyan/10"
            >
              <span className="text-3xl">→</span>
              View all {products.length}
              <span className="text-xs font-medium text-ink-muted">{title}</span>
            </Link>
          </RailItem>
        )}
      </ProductRail>
    </section>
  );
}

export default async function MarketplaceHome() {
  const country = getRequestCountry();
  await ensureRates();

  const [all, categories, courses, activity] = await Promise.all([
    getAllProducts(),
    getAvailableCategories(),
    // Top courses for the "Udemy Courses" rail — featured first, then highest-rated.
    getCourses({ sort: "rating", take: 12 }),
    // Real demand signal per category (clicks/views/searches, last 30 days).
    getCategoryActivity(30),
  ]);

  // The first "Featured" band mixes products from EVERY category (round-robin so
  // consecutive cards differ), then rotates continuously in a marquee.
  const showcase = interleaveByCategory(sortByAvailability(all, country)).slice(0, 50);
  const trending = interleaveByCategory(sortByAvailability(all.filter((p) => p.trending), country)).slice(0, 12);

  const byCat = new Map<string, MarketProduct[]>();
  for (const p of all) {
    if (!p.category) continue;
    const arr = byCat.get(p.category) || [];
    arr.push(p);
    byCat.set(p.category, arr);
  }

  // Order category sections by demand: most analytics activity first, then by
  // how many products the category has (so busy categories rise to the top).
  const orderedCategories = [...categories].sort((a, b) => {
    const diff = (activity[b.slug] || 0) - (activity[a.slug] || 0);
    if (diff !== 0) return diff;
    return (byCat.get(b.slug)?.length || 0) - (byCat.get(a.slug)?.length || 0);
  });

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND,
    alternateName: "NBN Market",
    url: marketplaceUrl(),
    description: MKT_DESC,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl()}/nbnmarket/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND,
    alternateName: "NBN Market",
    url: marketplaceUrl(),
    logo: `${siteUrl()}/icon.png`,
    parentOrganization: { "@type": "Organization", name: "NBN TECH", url: siteUrl() },
  };

  return (
    <>
      <JsonLd data={[websiteJsonLd, orgJsonLd]} />
      <MarketHeader />

      <Container className="space-y-5 py-5">
        <h1 className="sr-only">{BRAND} — {TAGLINE}</h1>

        {/* Trust strip — tiny pills, swipe sideways on mobile */}
        <section className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 lg:flex-wrap lg:justify-center">
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
        </section>

        {/* Prominent category dropdown — right before the products */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <CategoryMenu categories={categories} />
            <p className="text-sm text-ink-muted">Browse everything available on NBN MARKET right now.</p>
          </div>
        )}

        {/* Telegram deal-alerts banner — secondary to the shopping CTAs */}
        <TelegramJoinBanner start="market_home" />

        {/* Featured — a continuously-rotating mix of products from every category */}
        {showcase.length > 0 && (
          <section className="rounded-2xl border border-ink-line bg-surface p-4 shadow-card sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold tracking-tight text-ink">Featured — from every category</h2>
              <span className="hidden text-xs text-ink-muted sm:inline">auto-rotating · hover to pause</span>
            </div>
            <ShowcaseRail>
              {showcase.map((p) => (
                <ProductCard key={p.id} product={p} country={country} />
              ))}
            </ShowcaseRail>
          </section>
        )}

        <Rail title="Trending now" products={trending} country={country} />

        {/* Udemy Courses — a sideways rail linking into the Online Courses section */}
        {courses.length > 0 && (
          <section className="rounded-2xl border border-ink-line bg-surface p-4 shadow-card sm:p-5">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="flex items-baseline gap-2 text-lg font-bold tracking-tight text-ink">
                <GraduationCap className="h-5 w-5 self-center text-cyan-deep" />
                Udemy Courses
                <span className="text-xs font-normal text-ink-muted sm:hidden">· swipe →</span>
              </h2>
              <Link href="/courses" className="shrink-0 text-sm font-semibold text-cyan-deep hover:underline">
                See all
              </Link>
            </div>
            <p className="-mt-2 mb-4 max-w-2xl text-sm text-ink-muted">
              Online courses worth taking — compare cloud, AWS, DevOps, programming, data science and more.
            </p>
            <ProductRail>
              {courses.map((c: Course) => (
                <RailItem key={c.id}>
                  <CourseCard course={c} country={country} showCompare={false} />
                </RailItem>
              ))}
            </ProductRail>
          </section>
        )}

        {/* Per-category rails, ordered by demand (most active first) */}
        {orderedCategories.map((c) => (
          <Rail
            key={c.slug}
            title={c.name}
            href={`/nbnmarket/category/${c.slug}`}
            products={sortByAvailability(byCat.get(c.slug) || [], country)}
            country={country}
          />
        ))}

        {all.length === 0 && (
          <ProductGrid products={[]} country={country} empty="Products are being added to NBN MARKET. Check back shortly." />
        )}
      </Container>
    </>
  );
}
