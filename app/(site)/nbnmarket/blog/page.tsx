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
        <header className="mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">NBN MARKET Blog</h1>
          <p className="mt-3 text-lg text-ink-body">
            Buying guides and best-of roundups for {currentYear()} — updated with live prices and honest picks.
            Choose a topic to see the products worth buying right now.
          </p>
        </header>

        {categories.length === 0 ? (
          <p className="mx-auto mt-8 max-w-3xl text-ink-muted">Guides are being written — check back soon.</p>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/nbnmarket/blog/${blogSlugForCategory(c.slug)}`}
                className="group flex flex-col rounded-xl border border-ink-line bg-surface p-5 transition hover:border-cyan hover:shadow-card"
              >
                <span className="text-2xl" aria-hidden>{categoryIcon(c.slug)}</span>
                <h2 className="mt-3 font-serif text-lg font-bold text-ink group-hover:text-cyan-deep">
                  Best {c.name} in {currentYear()}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {c.count} pick{c.count === 1 ? "" : "s"} · live prices &amp; honest deals →
                </p>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
