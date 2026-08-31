import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { PageView } from "@/components/marketplace/PageView";
import { TelegramJoinBanner } from "@/components/marketplace/TelegramJoin";
import { ArticleHeader, Prose } from "@/components/blog/ArticleShell";
import { getProducts } from "@/lib/marketplace-data";
import { getRequestCountry } from "@/lib/marketplace-server";
import { sortByAvailability, marketplaceUrl, categoryIcon } from "@/lib/marketplace";
import { siteUrl } from "@/lib/utils";
import {
  blogPostForSlug,
  blogTitle,
  blogDescription,
  blogIntro,
  blogUrl,
  currentYear,
  readingTime,
  BLOG_BUYING_TIPS,
  BLOG_POSTS,
} from "@/lib/blog";
import { COURSE_DISCLOSURE } from "@/lib/courses";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = blogPostForSlug(params.slug);
  if (!post) return { title: "Article not found" };
  const title = blogTitle(post.categoryName);
  const description = blogDescription(post.categoryName);
  return {
    title,
    description,
    alternates: { canonical: `/nbnmarket/blog/${post.slug}` },
    openGraph: { title, description, type: "article", url: blogUrl(post.slug) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogArticle({ params }: Params) {
  const post = blogPostForSlug(params.slug);
  if (!post) notFound();

  const country = getRequestCountry();
  const products = sortByAvailability(await getProducts({ category: post.categorySlug }), country);
  const title = blogTitle(post.categoryName);
  const intro = blogIntro(post.categoryName, post.blurb, products.length);
  const faqs = [
    {
      q: `How do you choose the best ${post.categoryName.toLowerCase()}?`,
      a: "We surface products from trusted retailers and rank the ones our shoppers engage with most. We never invent ratings or prices — every figure comes from the retailer's live listing.",
    },
    {
      q: "Are these the cheapest prices available?",
      a: "Prices shown update automatically and are localized to your country, but the retailer's checkout is always the final word — tap a product to confirm its current price before buying.",
    },
    {
      q: "Do you earn a commission?",
      a: "Yes — NBN MARKET may earn a commission if you buy through our links, at no extra cost to you. It never changes which products we show.",
    },
  ];
  const rt = readingTime(intro, ...BLOG_BUYING_TIPS, ...faqs.flatMap((f) => [f.q, f.a]));

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "NBN Market", url: "/nbnmarket" },
    { name: "Blog", url: "/nbnmarket/blog" },
    { name: post.categoryName, url: `/nbnmarket/blog/${post.slug}` },
  ];

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: blogDescription(post.categoryName),
    inLanguage: "en",
    author: { "@type": "Organization", name: "NBN TECH" },
    publisher: { "@type": "Organization", name: "NBN MARKET", logo: { "@type": "ImageObject", url: `${siteUrl()}/icon.png` } },
    mainEntityOfPage: blogUrl(post.slug),
  };
  const itemListJsonLd = products.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: title,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 30).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: marketplaceUrl(`/product/${p.slug}`),
          name: p.name,
        })),
      }
    : null;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 6);

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), blogJsonLd, faqJsonLd, ...(itemListJsonLd ? [itemListJsonLd] : [])]} />
      <PageView event="blog_view" params={{ post: post.slug }} />
      <MarketHeader />
      <Container className="pb-8 pt-2">
        <Breadcrumbs items={crumbs} />

        <ArticleHeader
          eyebrow={`${categoryIcon(post.categorySlug)}  ${post.categoryName} · Buying guide · ${currentYear()}`}
          title={title}
          readMinutes={rt}
        />

        <Prose className="mt-10">
          <p className="lead">{intro}</p>
          <h2>What to look for</h2>
          <ul>
            {BLOG_BUYING_TIPS.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Prose>

        <section className="mt-14">
          <div className="mx-auto mb-6 max-w-5xl">
            <h2 className="font-serif text-2xl font-bold text-ink">Our top {post.categoryName.toLowerCase()} picks</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Live prices, localized to your country.{" "}
              <Link href={`/nbnmarket/category/${post.categorySlug}`} className="font-medium text-cyan-deep hover:underline">
                See the full {post.categoryName} category →
              </Link>
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <ProductGrid products={products} country={country} empty="We're adding picks for this guide — check back soon." />
          </div>
        </section>

        <div className="mx-auto mt-14 max-w-2xl space-y-10">
          <TelegramJoinBanner start="blog" />

          <Prose>
            <h2>Frequently asked questions</h2>
            {faqs.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </Prose>

          <aside className="not-prose rounded-2xl border border-ink-line bg-sand-soft p-5 text-sm">
            <strong className="text-ink">More buying guides:</strong>{" "}
            {related.map((g, i) => (
              <span key={g.slug}>
                {i > 0 && " · "}
                <Link href={`/nbnmarket/blog/${g.slug}`} className="font-medium text-cyan-deep hover:underline">
                  Best {g.categoryName}
                </Link>
              </span>
            ))}
          </aside>

          <p className="text-xs text-ink-muted">{COURSE_DISCLOSURE}</p>
        </div>
      </Container>
    </>
  );
}
