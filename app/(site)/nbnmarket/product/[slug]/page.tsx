import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productBlogPath } from "@/lib/blog";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import { AvailabilityPanel, type AvailabilityEntry, AvailabilityBadge } from "@/components/marketplace/AvailabilityPanel";
import { AmazonLink } from "@/components/marketplace/AmazonLink";
import { ProductGallery } from "@/components/marketplace/ProductGallery";
import { getProductBySlug, getRelatedProducts } from "@/lib/marketplace-data";
import { getOffersForProduct } from "@/lib/affiliate/link-service";
import { getRequestCountry } from "@/lib/marketplace-server";
import { availabilityFor, ctaLabel, sortByAvailability, CATEGORY_MAP, COUNTRY_MAP, COUNTRIES, money } from "@/lib/marketplace";
import { ensureRates, convert, roundPrice } from "@/lib/currency";
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
    } and availability across Amazon and other trusted retailers in your country.`,
    155,
  );
  const title = `${p.name} — Price & Availability | NBN MARKET`;
  const image = abs(p.imageUrl);
  return {
    title: `${p.name} — Price & Availability`,
    description: desc,
    alternates: { canonical: `/nbnmarket/product/${p.slug}` },
    openGraph: { title, description: desc, type: "website", images: image ? [{ url: image }] : undefined },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function ProductPage({ params }: Params) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const country = getRequestCountry();
  await ensureRates();
  const cat = product.category ? CATEGORY_MAP[product.category] : undefined;
  // Localize the reference price into the shopper's country currency.
  const priceTarget = COUNTRY_MAP[country]?.currency;
  const mainPriceLabel = (() => {
    if (product.price == null) return "";
    const from = product.currency || "EUR";
    if (priceTarget && priceTarget !== from) {
      const c = convert(product.price, from, priceTarget);
      if (c != null) return money(roundPrice(c), priceTarget);
    }
    return money(product.price, from);
  })();
  const related = sortByAvailability(await getRelatedProducts(product), country);
  const galleryImages = [product.imageUrl, ...(product.gallery || [])].filter(Boolean) as string[];
  // Provider-agnostic offers (Amazon today; Awin/impact/CJ once synced). Shown
  // only when there is more than one, so the current UI is unchanged until then.
  const providerOffers = await getOffersForProduct(product, country);

  const specs: Spec[] = Array.isArray(product.specs) ? (product.specs as unknown as Spec[]) : [];
  const faqs: Faq[] = Array.isArray(product.faqs)
    ? (product.faqs as unknown as Faq[]).filter((f) => f && f.q && f.a)
    : [];

  const availData: Record<string, AvailabilityEntry> = {};
  for (const c of COUNTRIES) {
    const a = availabilityFor(product, c.code);
    availData[c.code] = {
      status: a.status, platform: a.platform, url: a.url,
      hasLink: a.hasLink, hasDirectUrl: a.hasDirectUrl,
      priceLabel: a.priceLabel, countryName: c.name, flag: c.flag,
      cta: ctaLabel(a),
    };
  }

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "NBN Market", url: "/nbnmarket" },
    ...(cat ? [{ name: cat.name, url: `/nbnmarket/category/${cat.slug}` }] : []),
    { name: product.name, url: `/nbnmarket/product/${product.slug}` },
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
          {/* Image gallery */}
          <ProductGallery images={galleryImages} alt={product.imageAlt || product.name} />

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
                {mainPriceLabel}
                <span className="ml-2 text-xs font-normal text-ink-muted">indicative — see live price at the retailer</span>
              </p>
            )}
            {product.shortDescription && <p className="mt-3 text-sm text-ink-body">{product.shortDescription}</p>}
            <Link href={productBlogPath(product.slug)} className="mt-2 inline-block text-sm font-medium text-cyan-deep hover:underline">
              📖 Read our full review &amp; buying guide →
            </Link>

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
            <table className="w-full max-w-3xl text-sm">
              <thead>
                <tr className="border-b border-ink-line text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="py-2 pr-4">Country</th>
                  <th className="py-2 pr-4">Platform</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {COUNTRIES.map((c) => {
                  const a = availabilityFor(product, c.code);
                  // Price for the row: the verified per-country price if set,
                  // otherwise the reference price converted into this currency.
                  let rowPrice = "—";
                  if (a.price != null) rowPrice = money(a.price, a.currency);
                  else if (product.price != null) {
                    const cv = convert(product.price, product.currency || "EUR", c.currency);
                    rowPrice = cv != null ? money(roundPrice(cv), c.currency) : money(product.price, product.currency || "EUR");
                  }
                  return (
                    <tr key={c.code} className="border-b border-ink-line">
                      <td className="py-2 pr-4 text-ink">{c.flag} {c.name}</td>
                      <td className="py-2 pr-4 text-ink-muted">{a.platform || "—"}</td>
                      <td className="py-2 pr-4"><AvailabilityBadge status={a.status} /></td>
                      <td className="py-2 pr-4 text-ink">{rowPrice}</td>
                      <td className="py-2">
                        {a.hasLink ? (
                          <AmazonLink href={a.url} productSlug={product.slug} country={c.code} platform={a.platform} className="whitespace-nowrap font-semibold text-cyan-deep hover:underline">
                            {ctaLabel(a)} ›
                          </AmazonLink>
                        ) : (
                          <span className="text-ink-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            “Availability not verified” means we do not currently hold reliable data for that market — it does not mean the product is unavailable. NBN MARKET links to Amazon and other platforms depending on the country.
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

        {providerOffers.length > 1 && (
          <Section title="More offers">
            <ul className="divide-y divide-ink-line">
              {providerOffers.map((o, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-ink">{o.merchantName || o.provider}</span>
                    {o.availability && (
                      <span className="ml-2 text-xs text-ink-muted">{o.availability}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {o.price != null && (
                      <span className="font-bold text-ink">{money(o.price, o.currency || "EUR")}</span>
                    )}
                    {(o.affiliateUrl || o.destinationUrl) && (
                      <AmazonLink
                        href={(o.affiliateUrl || o.destinationUrl) as string}
                        productSlug={product.slug}
                        country={country}
                        platform={o.provider}
                        className="rounded-lg bg-[#ff9900] px-3 py-1.5 text-sm font-bold text-[#231a00] hover:brightness-105"
                      >
                        View deal
                      </AmazonLink>
                    )}
                  </div>
                </li>
              ))}
            </ul>
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
