import { CATEGORIES, CATEGORY_MAP, categoryLabel, marketplaceUrl } from "@/lib/marketplace";

/**
 * NBN MARKET blog — auto-generated, SEO-first buying articles.
 *
 * There is one article per product category. Each article pulls the LIVE
 * products in that category and links to every one of them (real internal
 * linking is what makes search engines crawl and rank the product pages).
 * Adding a category to CATEGORIES (or a synced category with products) yields a
 * new article automatically — no per-post authoring required.
 *
 * We never fabricate product claims, ratings or prices in the copy; the article
 * frames honest buying guidance and lets the live product cards speak for price.
 */

export type BlogPost = {
  /** URL slug: /nbnmarket/blog/<slug>. Stable (no year) to avoid link churn. */
  slug: string;
  /** The product category this article covers. */
  categorySlug: string;
  categoryName: string;
  blurb: string;
};

export function blogSlugForCategory(categorySlug: string): string {
  return `best-${categorySlug}`;
}

/** One post per curated category. Synced/admin categories still resolve live. */
export const BLOG_POSTS: BlogPost[] = CATEGORIES.map((c) => ({
  slug: blogSlugForCategory(c.slug),
  categorySlug: c.slug,
  categoryName: c.name,
  blurb: c.blurb,
}));

export const BLOG_POST_MAP: Record<string, BlogPost> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p]),
);

/** Resolve a blog slug to a post — known category, or any live category slug. */
export function blogPostForSlug(slug: string): BlogPost | null {
  if (BLOG_POST_MAP[slug]) return BLOG_POST_MAP[slug];
  // Allow best-<any-live-category> even if not in the curated CATEGORIES list.
  const m = slug.match(/^best-(.+)$/);
  if (m) {
    const categorySlug = m[1];
    return {
      slug,
      categorySlug,
      categoryName: categoryLabel(categorySlug) || categorySlug,
      blurb: CATEGORY_MAP[categorySlug]?.blurb || "",
    };
  }
  return null;
}

export function blogPath(slug: string): string {
  return `/nbnmarket/blog/${slug}`;
}

export function blogUrl(slug: string): string {
  return marketplaceUrl(`/blog/${slug}`);
}

export function currentYear(): number {
  return new Date().getFullYear();
}

/** Rough reading time in minutes (~200 wpm), min 1. */
export function readingTime(...parts: (string | null | undefined)[]): number {
  const words = parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function blogTitle(categoryName: string): string {
  return `Best ${categoryName} in ${currentYear()}: Top Picks, Prices & Deals`;
}

export function blogDescription(categoryName: string): string {
  return `Discover the best ${categoryName.toLowerCase()} to buy in ${currentYear()} on NBN MARKET — compare current prices, ratings and availability, and buy from trusted retailers. Updated regularly.`;
}

export function blogIntro(categoryName: string, blurb: string, count: number): string {
  const lead = blurb ? `${blurb} ` : "";
  const many = count > 0 ? `We've gathered ${count} option${count === 1 ? "" : "s"} worth your money` : "We're gathering the best options";
  return `${lead}${many} in ${categoryName.toLowerCase()} for ${currentYear()}. Every pick below links straight to the retailer with its live price, rating and availability for your country — so you can compare honestly and buy with confidence. Prices update automatically, and we only earn a commission if you choose to buy, at no extra cost to you.`;
}

/* ------------------------------------------------------------------ *
 * Per-product & per-course articles — one auto-generated blog post for every
 * item, created the moment it's added (rendered live from its own data; the
 * sitemap lists them all so search engines discover each one).
 * ------------------------------------------------------------------ */

export function productBlogPath(slug: string): string {
  return `/nbnmarket/blog/product/${slug}`;
}
export function courseBlogPath(slug: string): string {
  return `/nbnmarket/blog/course/${slug}`;
}
export function productBlogUrl(slug: string): string {
  return marketplaceUrl(`/blog/product/${slug}`);
}
export function courseBlogUrl(slug: string): string {
  return marketplaceUrl(`/blog/course/${slug}`);
}

function uniq(a: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of a) {
    const s = (x || "").trim();
    if (s && !seen.has(s.toLowerCase())) {
      seen.add(s.toLowerCase());
      out.push(s);
    }
  }
  return out;
}

export function productBlogTitle(name: string): string {
  return `${name} — Review, Features & Where to Buy (${currentYear()})`;
}
export function productBlogDescription(name: string, categoryName: string): string {
  return `Full ${name} review for ${currentYear()}: key features, live price and where to buy. Compare it with the best ${categoryName.toLowerCase()} on NBN MARKET before you buy.`;
}
/** Likely search keywords a shopper would type — woven into meta + copy. */
export function productBlogKeywords(p: {
  name: string;
  brand?: string | null;
  category?: string | null;
  tags?: string[];
}): string[] {
  const catName = categoryLabel(p.category) || "";
  return uniq([
    p.name,
    `${p.name} review`,
    `${p.name} price`,
    `buy ${p.name}`,
    `${p.name} deal`,
    `is ${p.name} worth it`,
    p.brand || "",
    catName ? `best ${catName.toLowerCase()}` : "",
    catName ? `${catName.toLowerCase()} ${currentYear()}` : "",
    ...(p.tags || []),
  ]).slice(0, 16);
}

export function courseBlogTitle(title: string): string {
  return `${title} — Review: What You'll Learn & Is It Worth It (${currentYear()})`;
}
export function courseBlogDescription(title: string, provider: string): string {
  return `Is the ${title} course on ${provider} worth it in ${currentYear()}? Read what you'll learn, who it's for, the price and our honest take, then enrol through NBN MARKET.`;
}
export function courseBlogKeywords(c: {
  title: string;
  provider?: string | null;
  category?: string | null;
  instructor?: string | null;
  tags?: string[];
}): string[] {
  const catName = categoryLabel(c.category) || "";
  return uniq([
    c.title,
    `${c.title} review`,
    `${c.title} ${currentYear()}`,
    `is ${c.title} worth it`,
    `${c.title} free`,
    c.provider ? `${c.title} ${c.provider}` : "",
    catName ? `best ${catName.toLowerCase()} course` : "",
    catName ? `learn ${catName.toLowerCase()}` : "",
    catName ? `${catName.toLowerCase()} course online` : "",
    c.instructor || "",
    ...(c.tags || []),
  ]).slice(0, 16);
}

/** Honest, category-agnostic buying tips (never fabricated product claims). */
export const BLOG_BUYING_TIPS: string[] = [
  "Compare the live price across retailers — the cheapest listing isn't always the best value once ratings and shipping are factored in.",
  "Check the rating and number of reviews on the retailer's own page before buying.",
  "Confirm the item ships to your country and note the delivery estimate at checkout.",
  "Be wary of inflated “was” prices — a genuine discount shows a realistic original price.",
  "Set your delivery country on NBN MARKET so prices show in your own currency.",
];
