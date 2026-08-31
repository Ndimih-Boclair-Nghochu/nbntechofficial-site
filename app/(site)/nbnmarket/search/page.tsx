import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { PageView } from "@/components/marketplace/PageView";
import { SearchNoResults } from "@/components/marketplace/SearchNoResults";
import { searchProducts } from "@/lib/marketplace-data";
import { searchCourses } from "@/lib/courses-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { BRAND, sortByAvailability } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

// Internal search results are intentionally not indexable (avoids thin/duplicate
// pages flooding the index) — but still crawlable to follow product links.
export const metadata: Metadata = {
  title: "Search",
  description: "Search the NBN MARKET for products, brands and categories.",
  alternates: { canonical: "/nbnmarket/search" },
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const country = getRequestCountry();
  const q = (searchParams.q || "").trim();
  const [products, courses] = q
    ? await Promise.all([searchProducts(q), searchCourses(q)])
    : [[], []];
  const results = sortByAvailability(products, country);
  const noResults = !!q && results.length === 0 && courses.length === 0;

  return (
    <>
      {q && <PageView event="marketplace_search" params={{ query: q, results: results.length }} />}
      <MarketHeader query={q} />
      <Container className="pb-8 pt-6">
        <h1 className="font-serif text-2xl font-bold text-ink">
          {q ? `Search results for “${q}”` : "Search the marketplace"}
        </h1>
        {q ? (
          <p className="mt-1 text-sm text-ink-muted">
            {results.length} result{results.length === 1 ? "" : "s"}
            {courses.length > 0 && (
              <>
                {" "}·{" "}
                <Link href={`/courses/search?q=${encodeURIComponent(q)}`} className="text-cyan-deep hover:underline">
                  {courses.length} course{courses.length === 1 ? "" : "s"} →
                </Link>
              </>
            )}
          </p>
        ) : (
          <p className="mt-2 max-w-xl text-ink-muted">
            Type a product, brand or category into the search bar above.
          </p>
        )}

        {q && !noResults && (
          <div className="mt-6">
            <ProductGrid
              products={results}
              country={country}
              empty={
                courses.length > 0
                  ? `No products matched “${q}”, but we found related courses above.`
                  : `No products matched “${q}”.`
              }
            />
          </div>
        )}

        {noResults && <SearchNoResults query={q} />}

        <p className="mt-8 text-xs text-ink-muted">
          Looking for {BRAND}? Browse the{" "}
          <a href="/nbnmarket" className="text-cyan-deep hover:underline">marketplace home</a>.
        </p>
      </Container>
    </>
  );
}
