import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { getAvailableCategories } from "@/lib/marketplace-data";
import { BRAND, categoryIcon } from "@/lib/marketplace";
import { blogSlugForCategory, blogTitle, currentYear, blogUrl } from "@/lib/blog";

export const dynamic = "force-dynamic";

const DESC = `Buying guides and deal roundups from NBN MARKET — the best products to buy in ${new Date().getFullYear()} across electronics, home, kitchen, fitness, car and more, with live prices and honest picks.`;

export const metadata: Metadata = {
  title: { absolute: `NBN MARKET Blog — Buying Guides & Best-Of Roundups ${new Date().getFullYear()}` },
  description: DESC,
  alternates: { canonical: "/nbnmarket/blog" },
  openGraph: { title: `${BRAND} Blog`, description: DESC, type: "website" },
};

export default async function BlogIndex() {
  // One article per category that currently has products — always leads to real picks.
  const categories = (await getAvailableCategories()).filter((c) => c.count > 0);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "NBN Market", url: "/nbnmarket" },
    { name: "Blog", url: "/nbnmarket/blog" },
  ];

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${BRAND} Blog`,
    itemListElement: categories.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: blogUrl(blogSlugForCategory(c.slug)),
      name: blogTitle(c.name),
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), itemList]} />
      <MarketHeader />
      <Container className="pb-8">
        <Breadcrumbs items={crumbs} />
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c77b00]">NBN MARKET · Buying guides</p>
          <h1 className="mt-3 font-serif text-[2rem] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-[2.75rem]">
            The Blog
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-body">
            Buying guides and best-of roundups for {currentYear()} — updated with live prices and honest picks.
            Pick a topic to see what&apos;s worth buying right now.
          </p>
        </header>

        {categories.length === 0 ? (
          <p className="mx-auto mt-10 max-w-2xl text-center text-ink-muted">Guides are being written — check back soon.</p>
        ) : (
          <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/nbnmarket/blog/${blogSlugForCategory(c.slug)}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-line bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan/50 hover:shadow-card-hover"
              >
                <span className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-cyan transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-sand-soft text-2xl transition group-hover:bg-cyan/10" aria-hidden>
                  {categoryIcon(c.slug)}
                </span>
                <h2 className="mt-4 font-serif text-lg font-bold leading-snug text-ink group-hover:text-cyan-deep">
                  Best {c.name} in {currentYear()}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  {c.count} pick{c.count === 1 ? "" : "s"} · live prices &amp; honest deals
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-deep">
                  Read the guide
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
