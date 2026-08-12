import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { MarketProduct } from "@prisma/client";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import { AmazonLink } from "@/components/marketplace/AmazonLink";
import { getProductBySlug } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { availabilityFor, ctaLabel, BRAND, money } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

type Params = { params: { pair: string } };
type Spec = { label: string; value: string };

function splitPair(pair: string): [string, string] | null {
  const parts = pair.split("-vs-");
  return parts.length === 2 && parts[0] && parts[1] ? [parts[0], parts[1]] : null;
}
function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}
function specsOf(p: MarketProduct): Spec[] {
  return Array.isArray(p.specs) ? (p.specs as unknown as Spec[]) : [];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const pair = splitPair(params.pair);
  if (!pair) return { title: "Comparison not found" };
  const [a, b] = await Promise.all([getProductBySlug(pair[0]), getProductBySlug(pair[1])]);
  if (!a || !b) return { title: "Comparison not found" };
  const desc = truncate(
    `Compare ${a.name} and ${b.name}: specifications, strengths, weaknesses, pricing and availability across trusted retailers. Find out which is the better buy.`,
    155,
  );
  return {
    title: `${a.name} vs ${b.name} — Comparison`,
    description: desc,
    alternates: { canonical: `/marketplace/compare/${a.slug}-vs-${b.slug}` },
    openGraph: { title: `${a.name} vs ${b.name} | ${BRAND}`, description: desc, type: "article" },
  };
}

export default async function ComparePage({ params }: Params) {
  const pair = splitPair(params.pair);
  if (!pair) notFound();
  const [a, b] = await Promise.all([getProductBySlug(pair[0]), getProductBySlug(pair[1])]);
  if (!a || !b) notFound();

  const country = getRequestCountry();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Marketplace", url: "/marketplace" },
    { name: `${a.name} vs ${b.name}`, url: `/marketplace/compare/${a.slug}-vs-${b.slug}` },
  ];

  // Union of spec labels
  const labels: string[] = [];
  [a, b].forEach((p) => specsOf(p).forEach((s) => { if (s.label && !labels.includes(s.label)) labels.push(s.label); }));
  const valueFor = (p: MarketProduct, label: string) =>
    specsOf(p).find((s) => s.label === label)?.value || "—";

  const col = (p: MarketProduct) => {
    const av = availabilityFor(p, country);
    return (
      <div className="rounded-xl2 border border-ink-line bg-surface p-5 text-center shadow-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.imageUrl || "/logo-mark.png"} alt={p.imageAlt || p.name} width={220} height={165} loading="lazy" className="mx-auto mb-3 aspect-[4/3] w-full max-w-[240px] rounded-lg object-cover" />
        <h2 className="font-serif text-lg font-bold text-ink">
          <Link href={`/marketplace/product/${p.slug}`} className="hover:text-cyan-deep">{p.name}</Link>
        </h2>
        {p.price != null && <p className="mt-1 text-xl font-bold text-ink">{money(p.price, p.currency)}</p>}
        {av.hasLink ? (
          <AmazonLink href={av.url} productSlug={p.slug} country={country} platform={av.platform} className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#ff9900] px-4 py-2.5 text-sm font-bold text-[#231a00] hover:brightness-105">
            {ctaLabel(av) || "Buy now"}
          </AmazonLink>
        ) : (
          <Link href={`/marketplace/product/${p.slug}`} className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-ink-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-cyan hover:text-cyan-deep">
            View details
          </Link>
        )}
      </div>
    );
  };

  const list = (items: string[]) =>
    (items.length ? items : ["—"]).slice(0, 5).map((x, i) => <li key={i}>{x}</li>);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageView event="comparison_view" params={{ pair: `${a.slug}-vs-${b.slug}` }} />
      <MarketHeader />
      <Container className="pb-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-3xl font-bold text-ink">{a.name} vs {b.name}</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          A side-by-side comparison to help you choose the right option for your needs and budget.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">{col(a)}{col(b)}</div>

        {labels.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 font-serif text-xl font-bold text-ink">Specifications compared</h2>
            <div className="overflow-x-auto rounded-xl2 border border-ink-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-line bg-sand-soft text-left">
                    <th className="p-3" />
                    <th className="p-3 font-semibold text-ink">{a.name}</th>
                    <th className="p-3 font-semibold text-ink">{b.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((l) => (
                    <tr key={l} className="border-b border-ink-line">
                      <th scope="row" className="p-3 text-left font-medium text-ink-muted">{l}</th>
                      <td className="p-3 text-ink">{valueFor(a, l)}</td>
                      <td className="p-3 text-ink">{valueFor(b, l)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold text-ink">{a.name} — strengths</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-body marker:text-emerald-500">{list(a.pros)}</ul>
            <h3 className="mt-4 font-semibold text-ink">Weaknesses</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-body marker:text-rose-400">{list(a.cons)}</ul>
          </div>
          <div>
            <h3 className="font-semibold text-ink">{b.name} — strengths</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-body marker:text-emerald-500">{list(b.pros)}</ul>
            <h3 className="mt-4 font-semibold text-ink">Weaknesses</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-body marker:text-rose-400">{list(b.cons)}</ul>
          </div>
        </section>
      </Container>
    </>
  );
}
