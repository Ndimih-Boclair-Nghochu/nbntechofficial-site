import type { Metadata } from "next";
import Link from "next/link";
import type { MarketProduct } from "@prisma/client";
import { ShieldCheck, Globe2, MapPin, ListChecks } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductCard, ProductGrid } from "@/components/marketplace/ProductCard";
import { ProductRail, RailItem } from "@/components/marketplace/ProductRail";
import { CategoryMenu } from "@/components/marketplace/CategoryMenu";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { getAllProducts, getAvailableCategories } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { BRAND, TAGLINE, marketplaceUrl, sortByAvailability } from "@/lib/marketplace";
import { ensureRates } from "@/lib/currency";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${BRAND} — ${TAGLINE}`,
  description:
    "Shop carefully selected products on NBN MARKET. Compare laptops, developer gear, courses and electronics across Amazon and other trusted retailers, and check availability in your country.",
  alternates: { canonical: "/marketplace" },
  openGraph: { title: `${BRAND} — ${TAGLINE}`, url: marketplaceUrl(), type: "website" },
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
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
        {href && (
          <Link href={href} className="shrink-0 text-sm font-semibold text-cyan-deep hover:underline">
            See all
          </Link>
        )}
      </div>
      <ProductRail>
        {products.map((p) => (
          <RailItem key={p.id}>
            <ProductCard product={p} country={country} />
          </RailItem>
        ))}
      </ProductRail>
    </section>
  );
}

export default async function MarketplaceHome() {
  const country = getRequestCountry();
  await ensureRates();

  const [all, categories] = await Promise.all([getAllProducts(), getAvailableCategories()]);

  const featured = sortByAvailability(all.filter((p) => p.featured), country).slice(0, 12);
  const trending = sortByAvailability(all.filter((p) => p.trending), country).slice(0, 12);

  const byCat = new Map<string, MarketProduct[]>();
  for (const p of all) {
    if (!p.category) continue;
    const arr = byCat.get(p.category) || [];
    arr.push(p);
    byCat.set(p.category, arr);
  }

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

        {/* Trust strip */}
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

        {/* Prominent category dropdown — right before the products */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <CategoryMenu categories={categories} />
            <p className="text-sm text-ink-muted">Browse everything available on NBN MARKET right now.</p>
          </div>
        )}

        <Rail title="Featured products" products={featured} country={country} />
        <Rail title="Trending now" products={trending} country={country} />

        {/* Partitioned, per-category rails (courses, laptops, …) */}
        {categories.map((c) => (
          <Rail
            key={c.slug}
            title={c.name}
            href={`/marketplace/category/${c.slug}`}
            products={sortByAvailability(byCat.get(c.slug) || [], country).slice(0, 12)}
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
