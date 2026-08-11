import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { getProducts } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { BRAND, TAGLINE, CATEGORIES, GUIDES, marketplaceUrl } from "@/lib/marketplace";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${BRAND} — ${TAGLINE}`,
  description:
    "Ndimih Boclair Marketplace helps you discover products worth buying. Compare laptops, developer gear and electronics, check Amazon availability in your country, and buy with confidence.",
  alternates: { canonical: "/marketplace" },
  openGraph: {
    title: `${BRAND} — ${TAGLINE}`,
    description:
      "Discover products worth buying. Compare options and check Amazon availability across Germany, the UK, France, Italy and Spain.",
    url: marketplaceUrl(),
    type: "website",
  },
};

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

export default async function MarketplaceHome() {
  const country = getRequestCountry();
  const [featured, trending, latest] = await Promise.all([
    getProducts({ featured: true, take: 8 }),
    getProducts({ trending: true, take: 8 }),
    getProducts({ take: 8 }),
  ]);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND,
    url: marketplaceUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl()}/marketplace/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <MarketHeader />

      <Container className="pb-4">
        {/* Hero */}
        <section className="relative mt-6 overflow-hidden rounded-xl2 bg-gradient-to-br from-navy-950 via-navy to-navy-800 px-6 py-12 text-white shadow-card sm:px-10 sm:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-cyan/20 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-soft">{BRAND}</p>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              Discover Products Worth Buying
            </h1>
            <p className="mt-4 text-white/80">
              Explore carefully selected products, compare your options, and find the right products
              for your needs — with clear availability across Amazon in Germany, the UK, France, Italy
              and Spain.
            </p>
            <form action="/marketplace/search" method="get" role="search" className="mt-6 flex max-w-lg rounded-xl bg-white p-1.5 shadow-lg">
              <input
                type="search"
                name="q"
                placeholder="Search products, categories, brands…"
                aria-label="Search products"
                className="flex-1 rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none"
              />
              <button type="submit" className="rounded-lg bg-[#ff9900] px-5 text-sm font-bold text-[#231a00] hover:brightness-105">
                Search
              </button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-white/60">Popular:</span>
              <Link href="/marketplace/guides/best-laptops-for-programming" className="rounded-full border border-white/20 bg-white/10 px-3 py-1 hover:bg-white/20">
                Laptops for programming
              </Link>
              <Link href="/marketplace/category/student-essentials" className="rounded-full border border-white/20 bg-white/10 px-3 py-1 hover:bg-white/20">
                Student essentials
              </Link>
              <Link href="/marketplace/guides/best-monitors-for-programmers" className="rounded-full border border-white/20 bg-white/10 px-3 py-1 hover:bg-white/20">
                Monitors for developers
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-ink">Browse categories</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/marketplace/category/${c.slug}`}
                className="group flex flex-col gap-1.5 rounded-xl2 border border-ink-line bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:border-cyan/40 hover:shadow-card-hover"
              >
                <span className="text-2xl" aria-hidden>{c.icon}</span>
                <span className="font-semibold text-ink">{c.name}</span>
                <span className="text-sm text-ink-muted">{c.blurb}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured / trending / latest */}
        {featured.length > 0 && (
          <Section title="Featured products">
            <ProductGrid products={featured} country={country} />
          </Section>
        )}
        {trending.length > 0 && (
          <Section title="Trending now">
            <ProductGrid products={trending} country={country} />
          </Section>
        )}
        {featured.length === 0 && trending.length === 0 && (
          <Section title="Latest products">
            <ProductGrid
              products={latest}
              country={country}
              empty="Products are being added to the marketplace. Check back shortly."
            />
          </Section>
        )}

        {/* Guides */}
        <section className="mt-14">
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <h2 className="font-serif text-2xl font-bold text-ink">Buying guides</h2>
            <Link href="/marketplace/guides" className="text-sm font-semibold text-cyan-deep">
              All guides →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/marketplace/guides/${g.slug}`}
                className="flex flex-col gap-2 rounded-xl2 border border-ink-line bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-[#c77b00]">Buying guide</span>
                <strong className="text-lg text-ink">{g.title}</strong>
                <span className="text-sm text-ink-muted">{truncate(g.intro, 120)}</span>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 font-serif text-2xl font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
