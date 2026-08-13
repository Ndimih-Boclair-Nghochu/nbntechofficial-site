import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import { getProductsForGuide } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { BRAND, GUIDE_MAP, GUIDES, marketplaceUrl, sortByAvailability } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string } };

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const guide = GUIDE_MAP[params.slug];
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: truncate(guide.intro, 155),
    alternates: { canonical: `/nbnmarket/guides/${guide.slug}` },
    openGraph: { title: guide.metaTitle, description: truncate(guide.intro, 155), type: "article" },
  };
}

export default async function GuidePage({ params }: Params) {
  const guide = GUIDE_MAP[params.slug];
  if (!guide) notFound();

  const country = getRequestCountry();
  const products = sortByAvailability(await getProductsForGuide(guide), country);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "NBN Market", url: "/nbnmarket" },
    { name: "Buying guides", url: "/nbnmarket/guides" },
    { name: guide.title, url: `/nbnmarket/guides/${guide.slug}` },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: truncate(guide.intro, 200),
    author: { "@type": "Organization", name: "NBN TECH" },
    publisher: { "@type": "Organization", name: "NBN TECH" },
    mainEntityOfPage: marketplaceUrl(`/guides/${guide.slug}`),
  };
  const otherGuides = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), articleJsonLd]} />
      <PageView event="guide_view" params={{ guide: guide.slug }} />
      <MarketHeader />
      <Container className="pb-4">
        <Breadcrumbs items={crumbs} />
        <article className="mx-auto max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wide text-[#c77b00]">Buying guide</span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-body">{guide.intro}</p>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-ink">What to look for</h2>
            <ul className="mt-4 grid gap-2.5">
              {guide.criteria.map((c, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded bg-emerald-50 text-xs font-bold text-emerald-600">✓</span>
                  <span className="text-ink-body">{c}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <section className="mt-12">
          <h2 className="mb-5 font-serif text-2xl font-bold text-ink">Our recommended picks</h2>
          <ProductGrid
            products={products}
            country={country}
            empty="We are still curating picks for this guide — check back soon."
          />
        </section>

        <aside className="mx-auto mt-12 max-w-3xl rounded-xl bg-sand-soft p-4 text-sm">
          <strong className="text-ink">Related guides:</strong>{" "}
          {otherGuides.map((g, i) => (
            <span key={g.slug}>
              {i > 0 && " · "}
              <Link href={`/nbnmarket/guides/${g.slug}`} className="font-medium text-cyan-deep hover:underline">
                {g.title}
              </Link>
            </span>
          ))}
        </aside>
      </Container>
    </>
  );
}
