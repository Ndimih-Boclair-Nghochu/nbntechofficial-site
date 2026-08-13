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
import { getProducts, getAvailableCategories } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { BRAND, categoryLabel, categoryIcon, slugToLabel, sortByAvailability } from "@/lib/marketplace";
import { ensureRates } from "@/lib/currency";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string }; searchParams: { sort?: string; sub?: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const name = categoryLabel(params.slug);
  const description = `Browse ${name.toLowerCase()} on ${BRAND}, compare offers across Amazon and other trusted retailers, and check availability in your country.`;
  return {
    title: name,
    description,
    alternates: { canonical: `/marketplace/category/${params.slug}` },
    openGraph: { title: `${name} — ${BRAND}`, description, type: "website" },
  };
}

export default async function CategoryPage({ params, searchParams }: Params) {
  const country = getRequestCountry();
  await ensureRates();

  const sub = searchParams.sub;
  let products = await getProducts({ category: params.slug, subcategory: sub });

  // A category "exists" if it currently has published products (known or
  // admin-added). Unknown + empty → 404.
  if (!products.length) {
    const withoutSub = sub ? await getProducts({ category: params.slug }) : products;
    if (!withoutSub.length) notFound();
    products = withoutSub;
  }

  const name = categoryLabel(params.slug);
  const icon = categoryIcon(params.slug);

  // Sub-categories available under this category (from all products in it).
  const cats = await getAvailableCategories();
  const thisCat = cats.find((c) => c.slug === params.slug);
  const subcats = thisCat?.subcategories ?? [];

  const sort = searchParams.sort;
  if (sort === "price-asc") products = [...products].sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
  else if (sort === "price-desc") products = [...products].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  else if (sort === "rating") products = [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  else products = sortByAvailability(products, country);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Marketplace", url: "/marketplace" },
    { name, url: `/marketplace/category/${params.slug}` },
    ...(sub ? [{ name: slugToLabel(sub), url: `/marketplace/category/${params.slug}?sub=${sub}` }] : []),
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageView event="category_view" params={{ category: params.slug }} />
      <MarketHeader activeCategory={params.slug} />

      <Container className="py-4">
        <Breadcrumbs items={crumbs} />

        <div className="rounded-lg border border-ink-line bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="flex items-center gap-2 text-xl font-bold text-ink">
              <span aria-hidden>{icon}</span> {name}
              {sub && <span className="text-ink-muted">· {slugToLabel(sub)}</span>}
              <span className="text-sm font-normal text-ink-muted">
                ({products.length} product{products.length === 1 ? "" : "s"})
              </span>
            </h1>
            <SortSelect value={sort} />
          </div>

          {subcats.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link
                href={`/marketplace/category/${params.slug}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${!sub ? "bg-navy text-white" : "bg-sand-soft text-ink-body hover:text-cyan-deep"}`}
              >
                All
              </Link>
              {subcats.map((s) => (
                <Link
                  key={s.slug}
                  href={`/marketplace/category/${params.slug}?sub=${s.slug}`}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${sub === s.slug ? "bg-navy text-white" : "bg-sand-soft text-ink-body hover:text-cyan-deep"}`}
                >
                  {s.name} <span className="opacity-70">({s.count})</span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-5">
            <ProductGrid products={products} country={country} empty="No products in this category yet — check back soon." />
          </div>
        </div>
      </Container>
    </>
  );
}
