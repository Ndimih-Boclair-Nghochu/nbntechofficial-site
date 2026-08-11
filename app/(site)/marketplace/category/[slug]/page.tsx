import type { Metadata } from "next";
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
import { BRAND, CATEGORY_MAP } from "@/lib/marketplace";

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

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageView event="category_view" params={{ category: cat.slug }} />
      <MarketHeader activeCategory={cat.slug} />

      <Container className="py-4">
        <Breadcrumbs items={crumbs} />

        <div className="rounded-lg border border-ink-line bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="flex items-center gap-2 text-xl font-bold text-ink">
              <span aria-hidden>{cat.icon}</span> {cat.name}
              <span className="text-sm font-normal text-ink-muted">
                ({products.length} product{products.length === 1 ? "" : "s"})
              </span>
            </h1>
            <SortSelect value={sort} />
          </div>

          <div className="mt-5">
            <ProductGrid products={products} country={country} empty="No products in this category yet — check back soon." />
          </div>
        </div>
      </Container>
    </>
  );
}
