import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { Breadcrumbs, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { AmazonSearch } from "@/components/marketplace/AmazonSearch";
import { BRAND } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

// Live third-party (Amazon) results are not our own content — keep out of the
// index to avoid thin/duplicate pages and respect Amazon's data-use terms.
export const metadata: Metadata = {
  title: "Search Amazon",
  description: "Search live Amazon products and check prices across marketplaces.",
  alternates: { canonical: "/nbnmarket/amazon" },
  robots: { index: false, follow: true },
};

export default function AmazonSearchPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "NBN Market", url: "/nbnmarket" },
    { name: "Search Amazon", url: "/nbnmarket/amazon" },
  ];
  return (
    <>
      <MarketHeader />
      <Container className="py-4">
        <Breadcrumbs items={crumbs} />
        <div className="rounded-lg border border-ink-line bg-surface p-4 sm:p-6">
          <h1 className="text-xl font-bold text-ink sm:text-2xl">Search Amazon</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            Search live products across Amazon marketplaces and open them on Amazon to buy. Prices and
            availability come straight from Amazon at search time.
          </p>
          <div className="mt-5">
            <AmazonSearch />
          </div>
          <p className="mt-6 text-xs text-ink-muted">
            {BRAND} may earn a commission from qualifying Amazon purchases, at no extra cost to you.
          </p>
        </div>
      </Container>
    </>
  );
}
