import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import { SortSelect } from "@/components/marketplace/SortSelect";
import { getProducts } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { BRAND, CATEGORY_MAP, GUIDES } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string }; searchParams: { sort?: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const cat = CATEGORY_MAP[params.slug];
  if (!cat) return { title: "Category not found" };
  const description = `${cat.blurb} Browse ${cat.name.toLowerCase()} on ${BRAND} and check Amazon availability in Germany, the UK, France, Italy and Spain.`;
  return {
    title: cat.name,
    description,
    alternates: { canonical: `/marketplace/category/${cat.slug}` },
    openGraph: { title: `${cat.name} — ${BRAND}`, description, type: "website" },
  };
}

export default async function CategoryPage({ params, searchParams }: Params) {
  const cat = CATEGORY_MAP[params.slug];
  if (!cat) notFound();

  const country = getRequestCountry();
  let products = await getProducts({ category: cat.slug });

  const sort = searchParams.sort;
  if (sort === "price-asc") products = [...products].sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
  else if (sort === "price-desc") products = [...products].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  else if (sort === "rating") products = [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Marketplace", url: "/marketplace" },
    { name: cat.name, url: `/marketplace/category/${cat.slug}` },
  ];
  const relatedGuides = GUIDES.filter((g) => g.categories.includes(cat.slug)).slice(0, 3);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageView event="category_view" params={{ category: cat.slug }} />
      <MarketHeader activeCategory={cat.slug} />

      <Container className="pb-4">
        <Breadcrumbs items={crumbs} />

        <div className="flex items-center gap-4">
          <span className="text-4xl" aria-hidden>{cat.icon}</span>
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink">{cat.name}</h1>
            <p className="mt-1 max-w-2xl text-ink-muted">{cat.blurb}</p>
          </div>
        </div>

        <div className="my-6 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-ink-muted">
            {products.length} product{products.length === 1 ? "" : "s"}
          </span>
          <SortSelect value={sort} />
        </div>

        <ProductGrid products={products} country={country} empty="No products in this category yet — check back soon." />

        {relatedGuides.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-xl font-bold text-ink">Related buying guides</h2>
            <ul className="mt-3 space-y-2">
              {relatedGuides.map((g) => (
                <li key={g.slug}>
                  <Link href={`/marketplace/guides/${g.slug}`} className="font-medium text-cyan-deep hover:underline">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  );
}
