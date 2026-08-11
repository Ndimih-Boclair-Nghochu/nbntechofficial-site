import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import { AvailabilityPanel, type AvailabilityEntry, AvailabilityBadge } from "@/components/marketplace/AvailabilityPanel";
import { AmazonLink } from "@/components/marketplace/AmazonLink";
import { getProductBySlug, getRelatedProducts } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { availabilityFor, CATEGORY_MAP, COUNTRIES, money } from "@/lib/marketplace";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string } };
type Spec = { label: string; value: string };
type Faq = { q: string; a: string };

function truncate(s: string, n: number) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}
function abs(u?: string | null) {
  if (!u) return undefined;
  return u.startsWith("http") ? u : `${siteUrl()}${u}`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getProductBySlug(params.slug);
  if (!p) return { title: "Product not found" };
  const desc = truncate(
    `${p.shortDescription || p.description || p.name} Key features, specifications${
      p.price != null ? `, price from ${money(p.price, p.currency)}` : ""
    } and Amazon availability in Germany, the UK, France, Italy and Spain.`,
    155,
  );
  const title = `${p.name} — Price & Amazon Availability | Ndimih Boclair`;
  const image = abs(p.imageUrl);
  return {
    title: `${p.name} — Price & Amazon Availability`,
    description: desc,
    alternates: { canonical: `/marketplace/product/${p.slug}` },
    openGraph: { title, description: desc, type: "website", images: image ? [{ url: image }] : undefined },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function ProductPage({ params }: Params) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const country = getRequestCountry();
  const cat = product.category ? CATEGORY_MAP[product.category] : undefined;
  const related = await getRelatedProducts(product);

  const specs: Spec[] = Array.isArray(product.specs) ? (product.specs as unknown as Spec[]) : [];
  const faqs: Faq[] = Array.isArray(product.faqs)
    ? (product.faqs as unknown as Faq[]).filter((f) => f && f.q && f.a)
    : [];

  const availData: Record<string, AvailabilityEntry> = {};
  for (const c of COUNTRIES) {
    const a = availabilityFor(product, c.code);
    availData[c.code] = {
      status: a.status, url: a.url, hasDirectUrl: a.hasDirectUrl,
      priceLabel: a.priceLabel, countryName: c.name, flag: c.flag,
    };
  }

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Marketplace", url: "/marketplace" },
    ...(cat ? [{ name: cat.name, url: `/marketplace/category/${cat.slug}` }] : []),
    { name: product.name, url: `/marketplace/product/${product.slug}` },
  ];

  // ---- Structured data (assert only what is present & truthful) ----
  const offers = COUNTRIES.map((c) => availabilityFor(product, c.code))
    .filter((a) => a.status === "AVAILABLE" && a.hasDirectUrl)
    .map((a) => ({
      "@type": "Offer",
      url: a.url,
      priceCurrency: a.currency,
      ...(a.price != null ? { price: a.price } : {}),
      availability: "https://schema.org/InStock",
      areaServed: a.country.name,
    }));
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.imageUrl ? { image: [abs(product.imageUrl)] } : {}),
    ...(product.shortDescription || product.description
      ? { description: truncate(product.shortDescription || product.description || "", 300) }
      : {}),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(offers.length ? { offers } : {}),
    ...(product.rating != null && product.reviewCount
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount } }
      : {}),
  };
  const faqJsonLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }
    : null;

  const showRating = product.rating != null && product.reviewCount;

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), productJsonLd, faqJsonLd]} />
      <PageView event="product_view" params={{ product: product.slug, country }} />
      <MarketHeader activeCategory={product.category || undefined} />

      <Container className="py-4">
        <Breadcrumbs items={crumbs} />

        {/* Buy-box layout: image · details · availability */}
        <div className="grid gap-6 rounded-lg border border-ink-line bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)]">
          {/* Image */}
          <div>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl || "/logo-mark.png"}
                alt={product.imageAlt || product.name}
                width={600}
                height={600}
                className="h-full w-full object-contain p-4"
              />
            </div>
            {product.gallery.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.gallery.slice(0, 6).map((g, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={g} alt={`${product.name} — view ${i + 1}`} loading="lazy" width={64} height={64}
                    className="h-16 w-16 rounded-md border border-ink-line bg-white object-contain p-1" />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-snug text-ink sm:text-2xl">{product.name}</h1>
            {product.brand && <p className="mt-1 text-sm text-cyan-deep">by {product.brand}</p>}
            {showRating && (
              <p className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-amber-500" aria-hidden>{"★★★★★".slice(0, Math.round(Number(product.rating)))}<span className="text-ink-line">{"★★★★★".slice(Math.round(Number(product.rating)))}</span></span>
                <span className="text-ink-muted">{Number(product.rating).toFixed(1)} · {product.reviewCount} ratings</span>
              </p>
            )}
            {product.price != null && (
              <p className="mt-3 border-t border-ink-line pt-3 text-2xl font-bold text-ink">
                {money(product.price, product.currency)}
                <span className="ml-2 text-xs font-normal text-ink-muted">indicative — live price on Amazon</span>
              </p>
            )}
            {product.shortDescription && <p className="mt-3 text-sm text-ink-body">{product.shortDescription}</p>}

            {product.features.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-bold text-ink">About this item</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-body marker:text-cyan">
                  {product.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Buy box */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <AvailabilityPanel productSlug={product.slug} productName={product.name} data={availData} />
          </div>
        </div>

        {/* Lower detail sections — concise */}
        {product.description && (
          <Section title="Product description">
            <p className="max-w-prose text-sm leading-relaxed text-ink-body">{product.description}</p>
          </Section>
        )}

        {specs.length > 0 && (
          <Section title="Product details">
            <div className="overflow-x-auto">
              <table className="w-full max-w-2xl text-sm">
                <tbody>
                  {specs.map((s, i) => (
                    <tr key={i} className="border-b border-ink-line">
                      <th scope="row" className="w-2/5 bg-sand-soft py-2 pl-3 pr-4 text-left font-medium text-ink-muted">{s.label}</th>
                      <td className="py-2 pl-3 text-ink">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        <Section title="Availability by country">
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl text-sm">
              <thead>
                <tr className="border-b border-ink-line text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="py-2 pr-4">Country</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {COUNTRIES.map((c) => {
                  const a = availabilityFor(product, c.code);
                  return (
                    <tr key={c.code} className="border-b border-ink-line">
                      <td className="py-2 pr-4 text-ink">{c.flag} {c.name}</td>
                      <td className="py-2 pr-4"><AvailabilityBadge status={a.status} /></td>
                      <td className="py-2 pr-4 text-ink">{a.price != null ? money(a.price, a.currency) : "—"}</td>
                      <td className="py-2">
                        <AmazonLink href={a.url} productSlug={product.slug} country={c.code} className="font-medium text-cyan-deep hover:underline">
                          {a.hasDirectUrl ? "View" : "Search"} ›
                        </AmazonLink>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            “Availability not verified” means we do not currently hold reliable data for that marketplace — it does not mean the product is unavailable.
          </p>
        </Section>

        {faqs.length > 0 && (
          <Section title="Questions & answers">
            <div className="max-w-2xl space-y-2">
              {faqs.map((f, i) => (
                <details key={i} className="rounded-lg border border-ink-line bg-surface px-4">
                  <summary className="cursor-pointer py-3 text-sm font-medium text-ink">{f.q}</summary>
                  <p className="pb-3 text-sm text-ink-body">{f.a}</p>
                </details>
              ))}
            </div>
          </Section>
        )}

        {related.length > 0 && (
          <section className="mt-8 rounded-lg border border-ink-line bg-surface p-4 sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-ink">Products related to this item</h2>
            <ProductGrid products={related} country={country} />
          </section>
        )}
      </Container>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-lg border border-ink-line bg-surface p-4 sm:p-5">
      <h2 className="mb-3 text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
