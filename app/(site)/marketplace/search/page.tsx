import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { PageView } from "@/components/marketplace/PageView";
import { searchProducts } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { BRAND } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

// Internal search results are intentionally not indexable (avoids thin/duplicate
// pages flooding the index) — but still crawlable to follow product links.
export const metadata: Metadata = {
  title: "Search",
  description: "Search the Ndimih Boclair Marketplace for products, brands and categories.",
  alternates: { canonical: "/marketplace/search" },
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const country = getRequestCountry();
  const q = (searchParams.q || "").trim();
  const results = q ? await searchProducts(q) : [];

  return (
    <>
      {q && <PageView event="marketplace_search" params={{ query: q, results: results.length }} />}
      <MarketHeader query={q} />
      <Container className="pb-4 pt-6">
        <h1 className="font-serif text-2xl font-bold text-ink">
          {q ? `Search results for “${q}”` : "Search the marketplace"}
        </h1>
        {q ? (
          <p className="mt-1 text-sm text-ink-muted">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
        ) : (
          <p className="mt-2 max-w-xl text-ink-muted">
            Type a product, brand or category into the search bar above.
          </p>
        )}
        {q && (
          <div className="mt-6">
            <ProductGrid
              products={results}
              country={country}
              empty={`No products matched “${q}”. Try a broader term, or browse our categories.`}
            />
          </div>
        )}
        <p className="mt-8 text-xs text-ink-muted">
          Looking for {BRAND}? Browse the{" "}
          <a href="/marketplace" className="text-cyan-deep hover:underline">marketplace home</a>.
        </p>
      </Container>
    </>
  );
}
