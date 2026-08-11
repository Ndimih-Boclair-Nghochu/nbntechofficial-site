import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { BRAND, GUIDES } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

export const metadata: Metadata = {
  title: "Buying Guides",
  description:
    "Independent buying guides for laptops, monitors, keyboards and developer gear. Learn what matters, compare top picks and check Amazon availability.",
  alternates: { canonical: "/marketplace/guides" },
  openGraph: { title: `Buying Guides — ${BRAND}`, type: "website" },
};

export default function GuidesIndex() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Marketplace", url: "/marketplace" },
    { name: "Buying guides", url: "/marketplace/guides" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <MarketHeader />
      <Container className="pb-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-3xl font-bold text-ink">Buying guides</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Practical, independent guides that explain what actually matters — then point you to
          products we recommend and where to buy them.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/marketplace/guides/${g.slug}`}
              className="flex flex-col gap-2 rounded-xl2 border border-ink-line bg-surface p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-[#c77b00]">Buying guide</span>
              <strong className="text-lg text-ink">{g.title}</strong>
              <span className="text-sm text-ink-muted">{truncate(g.intro, 160)}</span>
              <span className="mt-1 text-sm font-semibold text-cyan-deep">Read guide →</span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
