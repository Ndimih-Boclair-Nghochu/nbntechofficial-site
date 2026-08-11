import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import { AvailabilityPanel, type AvailabilityEntry } from "@/components/marketplace/AvailabilityPanel";
import { AmazonLink } from "@/components/marketplace/AmazonLink";
import { AvailabilityBadge } from "@/components/marketplace/AvailabilityPanel";
import { getProductBySlug, getRelatedProducts } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import {
  availabilityFor,
  BRAND,
  CATEGORY_MAP,
  COUNTRIES,
  GUIDES,
  money,
} from "@/lib/marketplace";
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
    `${p.shortDescription || p.description || p.name} See key features, specifications, pros, cons${
      p.price != null ? `, pricing from ${money(p.price, p.currency)}` : ""
    } and Amazon availability in Germany, the UK, France, Italy and Spain.`,
    155,
  );
  const title = `${p.name} — Features, Price & Amazon Availability | Ndimih Boclair`;
  const image = abs(p.imageUrl);
  return {
    title: `${p.name} — Features, Price & Amazon Availability`,
    description: desc,
    alternates: { canonical: `/marketplace/product/${p.slug}` },
    openGraph: {
      title,
      description: desc,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
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

  // Per-country availability payload for the interactive panel (all rendered = crawlable).
  const availData: Record<string, AvailabilityEntry> = {};
  for (const c of COUNTRIES) {
    const a = availabilityFor(product, c.code);
    availData[c.code] = {
      status: a.status,
      url: a.url,
      hasDirectUrl: a.hasDirectUrl,
      priceLabel: a.priceLabel,
      countryName: c.name,
      flag: c.flag,
    };
  }

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Marketplace", url: "/marketplace" },
    ...(cat ? [{ name: cat.name, url: `/marketplace/category/${cat.slug}` }] : []),
    { name: product.name, url: `/marketplace/product/${product.slug}` },
  ];

  const relatedGuides = GUIDES.filter(
    (g) => (product.category && g.categories.includes(product.category)) || product.guides.includes(g.slug),
  ).slice(0, 3);

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
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  const faqJsonLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const showRating = product.rating != null && product.reviewCount;

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), productJsonLd, faqJsonLd]} />
      <PageView event="product_view" params={{ product: product.slug, country }} />
      <MarketHeader activeCategory={product.category || undefined} />

      <Container className="pb-4">
        <Breadcrumbs items={crumbs} />

        <article className="rounded-xl2 border border-ink-line bg-surface p-5 shadow-card sm:p-7">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Gallery */}
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl || "/logo-mark.png"}
                alt={product.imageAlt || product.name}
                width={600}
                height={450}
                className="aspect-[4/3] w-full rounded-xl border border-ink-line bg-sand object-cover"
              />
              {product.gallery.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.gallery.slice(0, 6).map((g, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={g}
                      alt={`${product.name} — view ${i + 1}`}
                      loading="lazy"
                      width={80}
                      height={60}
                      className="h-16 w-20 rounded-lg border border-ink-line object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {cat && (
                <Link href={`/marketplace/category/${cat.slug}`} className="text-xs font-semibold uppercase tracking-wide text-cyan-deep">
                  {cat.name}
                </Link>
              )}
              <h1 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">{product.name}</h1>
              {product.brand && <p className="mt-1 text-ink-muted">by {product.brand}</p>}
              {showRating && (
                <p className="mt-2 font-medium text-amber-600">
                  ★ {Number(product.rating).toFixed(1)}{" "}
                  <span className="text-ink-muted">({product.reviewCount} reviews)</span>
                </p>
              )}
              {product.shortDescription && <p className="mt-3 text-ink-body">{product.shortDescription}</p>}
              {product.price != null && (
                <p className="mt-4 text-2xl font-bold text-ink">
                  {money(product.price, product.currency)}{" "}
                  <span className="text-xs font-normal text-ink-muted">indicative — see live price on Amazon</span>
                </p>
              )}

              <div className="mt-5">
                <AvailabilityPanel productSlug={product.slug} productName={product.name} data={availData} />
              </div>
            </div>
          </div>

          {/* Content sections */}
          {product.description && (
            <Block title="Overview">
              <p>{product.description}</p>
            </Block>
          )}
          {product.whoFor && (
            <Block title="Who is it for?">
              <p>{product.whoFor}</p>
            </Block>
          )}
          {product.features.length > 0 && (
            <Block title="Key features">
              <ul className="grid gap-2.5">
                {product.features.map((f, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded bg-emerald-50 text-xs font-bold text-emerald-600">✓</span>
                    <span className="text-ink-body">{f}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}
          {(product.pros.length > 0 || product.cons.length > 0) && (
            <Block title="Pros & cons">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-emerald-700">Pros</h3>
                  <ul className="mt-2 space-y-1.5">
                    {(product.pros.length ? product.pros : ["—"]).map((p, i) => (
                      <li key={i} className="text-ink-body"><span className="mr-2 font-bold text-emerald-600">+</span>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-rose-700">Cons</h3>
                  <ul className="mt-2 space-y-1.5">
                    {(product.cons.length ? product.cons : ["—"]).map((c, i) => (
                      <li key={i} className="text-ink-body"><span className="mr-2 font-bold text-rose-600">–</span>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Block>
          )}
          {specs.length > 0 && (
            <Block title="Specifications">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((s, i) => (
                      <tr key={i} className="border-b border-ink-line">
                        <th scope="row" className="w-2/5 py-2.5 pr-4 text-left font-medium text-ink-muted">{s.label}</th>
                        <td className="py-2.5 text-ink">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Block>
          )}
          {product.whyRecommend && (
            <div className="mt-8 rounded-xl2 bg-cyan/5 p-6">
              <h2 className="font-serif text-xl font-bold text-cyan-deep">Why we recommend it</h2>
              <p className="mt-2 max-w-prose leading-relaxed text-ink-body">{product.whyRecommend}</p>
            </div>
          )}

          {/* Availability table (all countries) */}
          <Block title="Availability by country">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-line text-left text-xs uppercase tracking-wide text-ink-muted">
                    <th className="py-2.5 pr-4">Country</th>
                    <th className="py-2.5 pr-4">Amazon</th>
                    <th className="py-2.5 pr-4">Status</th>
                    <th className="py-2.5 pr-4">Price</th>
                    <th className="py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {COUNTRIES.map((c) => {
                    const a = availabilityFor(product, c.code);
                    return (
                      <tr key={c.code} className="border-b border-ink-line">
                        <td className="py-2.5 pr-4 text-ink">{c.flag} {c.name}</td>
                        <td className="py-2.5 pr-4 text-ink-muted">{c.amazon}</td>
                        <td className="py-2.5 pr-4"><AvailabilityBadge status={a.status} /></td>
                        <td className="py-2.5 pr-4 text-ink">{a.price != null ? money(a.price, a.currency) : "—"}</td>
                        <td className="py-2.5">
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
            <p className="mt-3 text-xs text-ink-muted">
              “Availability not verified” means we do not currently hold reliable availability data for
              that marketplace — it does not mean the product is unavailable.
            </p>
          </Block>

          {faqs.length > 0 && (
            <Block title="Frequently asked questions">
              <div className="space-y-2.5">
                {faqs.map((f, i) => (
                  <details key={i} className="rounded-xl border border-ink-line bg-white px-4">
                    <summary className="cursor-pointer py-3 font-medium text-ink">{f.q}</summary>
                    <p className="pb-3 text-ink-body">{f.a}</p>
                  </details>
                ))}
              </div>
            </Block>
          )}

          {relatedGuides.length > 0 && (
            <div className="mt-8 rounded-xl bg-sand-soft p-4 text-sm">
              <strong className="text-ink">Helpful guides:</strong>{" "}
              {relatedGuides.map((g, i) => (
                <span key={g.slug}>
                  {i > 0 && " · "}
                  <Link href={`/marketplace/guides/${g.slug}`} className="font-medium text-cyan-deep hover:underline">
                    {g.title}
                  </Link>
                </span>
              ))}
            </div>
          )}
        </article>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-serif text-2xl font-bold text-ink">Related products</h2>
            <ProductGrid products={related} country={country} />
          </section>
        )}
      </Container>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 border-t border-ink-line pt-6">
      <h2 className="mb-3 font-serif text-xl font-bold text-ink">{title}</h2>
      <div className="max-w-prose leading-relaxed text-ink-body [&>p]:text-ink-body">{children}</div>
    </section>
  );
}
