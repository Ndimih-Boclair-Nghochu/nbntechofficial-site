import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Globe2, MapPin, ListChecks } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { getProducts } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { BRAND, TAGLINE, marketplaceUrl, sortByAvailability } from "@/lib/marketplace";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${BRAND} — ${TAGLINE}`,
  description:
    "Shop carefully selected products on NBN MARKET. Compare laptops, developer gear and electronics, and check Amazon availability in your country.",
  alternates: { canonical: "/marketplace" },
  openGraph: { title: `${BRAND} — ${TAGLINE}`, url: marketplaceUrl(), type: "website" },
};

const TRUST = [
  { icon: ShieldCheck, label: "Independent picks", sub: "Real pros & cons — no fluff" },
  { icon: Globe2, label: "5 Amazon marketplaces", sub: "DE · UK · FR · IT · ES" },
  { icon: MapPin, label: "Country-aware", sub: "Availability for where you shop" },
  { icon: ListChecks, label: "Honest data", sub: "Never faked prices or reviews" },
];

/** A product panel — the storefront's building block. */
function Panel({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink-line bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
        {href && (
          <Link href={href} className="text-sm font-semibold text-cyan-deep hover:underline">
            See more
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default async function MarketplaceHome() {
  const country = getRequestCountry();
  const [featuredRaw, trendingRaw, latestRaw] = await Promise.all([
    getProducts({ featured: true, take: 10 }),
    getProducts({ trending: true, take: 10 }),
    getProducts({ take: 10 }),
  ]);
  // Products available in the shopper's country surface first.
  const featured = sortByAvailability(featuredRaw, country);
  const trending = sortByAvailability(trendingRaw, country);
  const latest = sortByAvailability(latestRaw, country);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND,
    url: marketplaceUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl()}/marketplace/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <MarketHeader />

      <Container className="space-y-5 py-5">
        <h1 className="sr-only">{BRAND} — {TAGLINE}</h1>

        {/* Slim trust strip — mature, not a hero */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-ink-line bg-surface px-4 py-3 shadow-card">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan/10 text-cyan-deep">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-ink">{label}</span>
                <span className="block truncate text-xs text-ink-muted">{sub}</span>
              </span>
            </div>
          ))}
        </section>

        {featured.length > 0 && (
          <Panel title="Featured products">
            <ProductGrid products={featured} country={country} />
          </Panel>
        )}

        {trending.length > 0 && (
          <Panel title="Trending now">
            <ProductGrid products={trending} country={country} />
          </Panel>
        )}

        <Panel title={featured.length || trending.length ? "New arrivals" : "All products"}>
          <ProductGrid
            products={latest}
            country={country}
            empty="Products are being added to NBN MARKET. Check back shortly."
          />
        </Panel>
      </Container>
    </>
  );
}
