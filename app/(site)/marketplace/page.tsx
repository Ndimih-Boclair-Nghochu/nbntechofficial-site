import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { getProducts } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { BRAND, TAGLINE, CATEGORIES, marketplaceUrl } from "@/lib/marketplace";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${BRAND} — ${TAGLINE}`,
  description:
    "Shop carefully selected products on the Ndimih Boclair Marketplace. Compare laptops, developer gear and electronics, and check Amazon availability in your country.",
  alternates: { canonical: "/marketplace" },
  openGraph: { title: `${BRAND} — ${TAGLINE}`, url: marketplaceUrl(), type: "website" },
};

/** A white product panel with a heading — the storefront's building block. */
function Panel({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-ink-line bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
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
  const [featured, trending, latest] = await Promise.all([
    getProducts({ featured: true, take: 10 }),
    getProducts({ trending: true, take: 10 }),
    getProducts({ take: 10 }),
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

      <Container className="space-y-4 py-4">
        <h1 className="sr-only">{BRAND} — {TAGLINE}</h1>

        {/* Shop by category — compact tiles */}
        <section className="rounded-lg border border-ink-line bg-surface p-4 sm:p-5">
          <h2 className="mb-4 text-lg font-bold text-ink">Shop by category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/marketplace/category/${c.slug}`}
                className="flex flex-col items-center gap-2 rounded-lg border border-ink-line p-3 text-center transition-colors hover:border-cyan/50 hover:bg-sand-soft"
              >
                <span className="text-2xl" aria-hidden>{c.icon}</span>
                <span className="text-xs font-medium leading-tight text-ink">{c.name}</span>
              </Link>
            ))}
          </div>
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
            empty="Products are being added to the marketplace. Check back shortly."
          />
        </Panel>
      </Container>
    </>
  );
}
