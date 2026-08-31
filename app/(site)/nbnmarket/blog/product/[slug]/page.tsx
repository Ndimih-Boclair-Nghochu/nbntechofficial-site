import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import { getProductBySlug, getRelatedProducts } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import {
  availabilityFor,
  primaryOffer,
  ctaLabel,
  money,
  categoryLabel,
  categoryIcon,
  sortByAvailability,
} from "@/lib/marketplace";
import { siteUrl } from "@/lib/utils";
import {
  productBlogTitle,
  productBlogDescription,
  productBlogKeywords,
  productBlogUrl,
  currentYear,
  blogSlugForCategory,
  BLOG_BUYING_TIPS,
} from "@/lib/blog";
import { COURSE_DISCLOSURE } from "@/lib/courses";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string } };
type Faq = { q: string; a: string };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getProductBySlug(params.slug);
  if (!p) return { title: "Article not found" };
  const catName = categoryLabel(p.category) || "products";
  const title = productBlogTitle(p.name);
  const description = productBlogDescription(p.name, catName);
  return {
    title,
    description,
    keywords: productBlogKeywords(p),
    alternates: { canonical: `/nbnmarket/blog/product/${p.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: productBlogUrl(p.slug),
      images: p.imageUrl ? [{ url: p.imageUrl }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductBlogArticle({ params }: Params) {
  const p = await getProductBySlug(params.slug);
  if (!p) notFound();

  const country = getRequestCountry();
  const av = availabilityFor(p, country);
  const buy = av.hasLink ? av : primaryOffer(p);
  const catName = categoryLabel(p.category) || "Products";
  const productPath = `/nbnmarket/product/${p.slug}`;
  const title = productBlogTitle(p.name);
  const related = sortByAvailability(await getRelatedProducts(p), country).slice(0, 8);

  const faqs: Faq[] = (Array.isArray(p.faqs) ? (p.faqs as Faq[]) : []).filter((f) => f?.q && f?.a).slice(0, 4);
  if (faqs.length === 0) {
    faqs.push(
      { q: `Is the ${p.name} worth buying?`, a: `It's one of our picks in ${catName.toLowerCase()} — check its live rating and price on the product page, then decide based on your needs and budget.` },
      { q: `Where can I buy the ${p.name}?`, a: `Through the link on its product page, which sends you to ${buy?.platform || "the retailer"} with the current price and delivery options for your country.` },
      { q: `How much does the ${p.name} cost?`, a: `Prices change often, so we show the live price on the product page rather than a fixed number here. Tap through to see today's price.` },
    );
  }

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "NBN Market", url: "/nbnmarket" },
    { name: "Blog", url: "/nbnmarket/blog" },
    { name: p.name, url: `/nbnmarket/blog/product/${p.slug}` },
  ];

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: productBlogDescription(p.name, catName),
    image: p.imageUrl || undefined,
    keywords: productBlogKeywords(p).join(", "),
    inLanguage: "en",
    author: { "@type": "Organization", name: "NBN TECH" },
    publisher: {
      "@type": "Organization",
      name: "NBN MARKET",
      logo: { "@type": "ImageObject", url: `${siteUrl()}/icon.png` },
    },
    mainEntityOfPage: productBlogUrl(p.slug),
    about: p.name,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const priceText = p.price != null ? money(p.price, p.currency || "EUR") : null;

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), blogJsonLd, faqJsonLd]} />
      <PageView event="blog_view" params={{ post: `product:${p.slug}` }} />
      <MarketHeader />
      <Container className="pb-6">
        <Breadcrumbs items={crumbs} />
        <article className="mx-auto max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wide text-[#c77b00]">
            {categoryIcon(p.category)} {catName} · Review · {currentYear()}
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">{title}</h1>

          {p.imageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={p.imageUrl}
              alt={p.imageAlt || p.name}
              loading="lazy"
              className="mt-6 w-full rounded-xl border border-ink-line bg-white object-contain"
            />
          )}

          <p className="mt-6 text-lg leading-relaxed text-ink-body">
            {p.whyRecommend || p.shortDescription || `The ${p.name} is one of our current picks in ${catName.toLowerCase()}.`}{" "}
            Below is what stands out, who it suits and how to buy it at the best price. Prices update automatically
            and we only earn a commission if you choose to buy — at no extra cost to you.
          </p>

          {/* Buy panel */}
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-sand-soft p-4">
            <div className="min-w-0">
              <p className="text-sm text-ink-muted">
                {priceText ? `Around ${priceText} — ` : ""}live price &amp; availability on the product page.
              </p>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <Link href={productPath} className="inline-flex items-center rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
                View details &amp; price
              </Link>
              {buy?.url && (
                <a href={buy.url} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center rounded-lg border border-ink-line px-4 py-2 text-sm font-semibold text-ink hover:border-cyan hover:text-cyan-deep">
                  {ctaLabel(buy) || "Buy now"}
                </a>
              )}
            </div>
          </div>

          {p.features.length > 0 && (
            <section className="mt-10">
              <h2 className="font-serif text-2xl font-bold text-ink">Key features of the {p.name}</h2>
              <ul className="mt-4 grid gap-2.5">
                {p.features.slice(0, 8).map((f, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded bg-emerald-50 text-xs font-bold text-emerald-600">✓</span>
                    <span className="text-ink-body">{f}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(p.pros.length > 0 || p.cons.length > 0) && (
            <section className="mt-10 grid gap-6 sm:grid-cols-2">
              {p.pros.length > 0 && (
                <div>
                  <h3 className="font-bold text-emerald-700">What we like</h3>
                  <ul className="mt-2 space-y-1.5 text-ink-body">{p.pros.map((x, i) => <li key={i}>👍 {x}</li>)}</ul>
                </div>
              )}
              {p.cons.length > 0 && (
                <div>
                  <h3 className="font-bold text-rose-700">Worth noting</h3>
                  <ul className="mt-2 space-y-1.5 text-ink-body">{p.cons.map((x, i) => <li key={i}>⚠️ {x}</li>)}</ul>
                </div>
              )}
            </section>
          )}

          {p.whoFor && (
            <section className="mt-10">
              <h2 className="font-serif text-2xl font-bold text-ink">Who it’s for</h2>
              <p className="mt-3 text-ink-body">{p.whoFor}</p>
            </section>
          )}

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-ink">Before you buy</h2>
            <ul className="mt-4 grid gap-2.5">
              {BLOG_BUYING_TIPS.map((c, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded bg-emerald-50 text-xs font-bold text-emerald-600">✓</span>
                  <span className="text-ink-body">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="mb-4 font-serif text-2xl font-bold text-ink">FAQs</h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold text-ink">{f.q}</h3>
                  <p className="mt-1 text-ink-body">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="mt-8">
            <Link href={`/nbnmarket/blog/${blogSlugForCategory(p.category || "")}`} className="font-medium text-cyan-deep hover:underline">
              → See more of the best {catName} in {currentYear()}
            </Link>
          </p>
        </article>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-serif text-2xl font-bold text-ink">Related picks</h2>
            <ProductGrid products={related} country={country} empty="" />
          </section>
        )}

        <p className="mx-auto mt-10 max-w-3xl text-xs text-ink-muted">{COURSE_DISCLOSURE}</p>
      </Container>
    </>
  );
}
