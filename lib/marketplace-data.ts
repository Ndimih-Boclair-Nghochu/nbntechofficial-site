import type { MarketProduct } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { type Guide, CATEGORIES, categoryLabel, categoryIcon, slugToLabel } from "@/lib/marketplace";

/**
 * Resilient read layer for the marketplace, mirroring lib/data.ts: every query
 * degrades gracefully so a missing/unreachable database renders empty sections
 * rather than crashing. This also lets `next build` succeed without a database.
 */

function logDbIssue(where: string, err: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[marketplace] ${where}: falling back to defaults —`, (err as Error)?.message);
  }
}

const publishedWhere = { published: true } as const;

/**
 * Demand signal per category — how many tracked analytics events (product/
 * category views, buy clicks, searches) each category has drawn over the last
 * `days`. Used to order the home-page category sections by real activity, so the
 * most-clicked / most-demanded categories rise to the top. Degrades to {} if the
 * analytics table is empty or unreachable.
 */
export async function getCategoryActivity(days = 30): Promise<Record<string, number>> {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const rows = await prisma.analyticsEvent.groupBy({
      by: ["category"],
      where: { category: { not: null }, createdAt: { gte: since } },
      _count: { _all: true },
    });
    const out: Record<string, number> = {};
    for (const r of rows) if (r.category) out[r.category] = r._count._all;
    return out;
  } catch (err) {
    logDbIssue("getCategoryActivity", err);
    return {};
  }
}

export async function getProducts(opts?: {
  category?: string;
  subcategory?: string;
  featured?: boolean;
  trending?: boolean;
  take?: number;
}): Promise<MarketProduct[]> {
  try {
    return await prisma.marketProduct.findMany({
      where: {
        ...publishedWhere,
        ...(opts?.category ? { category: opts.category } : {}),
        ...(opts?.subcategory ? { subcategory: opts.subcategory } : {}),
        ...(opts?.featured ? { featured: true } : {}),
        ...(opts?.trending ? { trending: true } : {}),
      },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
      take: opts?.take,
    });
  } catch (err) {
    logDbIssue("getProducts", err);
    return [];
  }
}

export type AvailableCategory = {
  slug: string;
  name: string;
  icon: string;
  count: number;
  subcategories: { slug: string; name: string; count: number }[];
};

/**
 * Categories (and sub-categories) that ACTUALLY have published products right
 * now — so every category shown in the UI leads to real products. Known
 * categories keep their curated name/icon/order; admin-added or synced ones get
 * a derived label and sort after, by product count.
 */
export async function getAvailableCategories(): Promise<AvailableCategory[]> {
  try {
    const rows = await prisma.marketProduct.findMany({
      where: publishedWhere,
      select: { category: true, subcategory: true },
    });
    const map = new Map<string, { count: number; subs: Map<string, number> }>();
    for (const r of rows) {
      const cat = (r.category || "").trim();
      if (!cat) continue;
      const e = map.get(cat) || { count: 0, subs: new Map<string, number>() };
      e.count += 1;
      const sub = (r.subcategory || "").trim();
      if (sub) e.subs.set(sub, (e.subs.get(sub) || 0) + 1);
      map.set(cat, e);
    }
    const knownOrder = new Map(CATEGORIES.map((c, i) => [c.slug, i]));
    return Array.from(map.entries())
      .map(([slug, e]) => ({
        slug,
        name: categoryLabel(slug),
        icon: categoryIcon(slug),
        count: e.count,
        subcategories: Array.from(e.subs.entries())
          .map(([s, count]) => ({ slug: s, name: slugToLabel(s), count }))
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => {
        const ka = knownOrder.has(a.slug) ? knownOrder.get(a.slug)! : 1000;
        const kb = knownOrder.has(b.slug) ? knownOrder.get(b.slug)! : 1000;
        if (ka !== kb) return ka - kb;
        return b.count - a.count || a.name.localeCompare(b.name);
      });
  } catch (err) {
    logDbIssue("getAvailableCategories", err);
    return [];
  }
}

export async function getAllProducts(): Promise<MarketProduct[]> {
  return getProducts();
}

/** Admin listing — includes drafts. */
export async function getAllProductsAdmin(): Promise<MarketProduct[]> {
  try {
    return await prisma.marketProduct.findMany({
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
    });
  } catch (err) {
    logDbIssue("getAllProductsAdmin", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<MarketProduct | null> {
  try {
    return await prisma.marketProduct.findFirst({ where: { slug, ...publishedWhere } });
  } catch (err) {
    logDbIssue("getProductBySlug", err);
    return null;
  }
}

export async function getProductsBySlugs(slugs: string[]): Promise<MarketProduct[]> {
  if (!slugs.length) return [];
  try {
    return await prisma.marketProduct.findMany({
      where: { slug: { in: slugs }, ...publishedWhere },
    });
  } catch (err) {
    logDbIssue("getProductsBySlugs", err);
    return [];
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.marketProduct.findMany({
      where: publishedWhere,
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch (err) {
    logDbIssue("getAllProductSlugs", err);
    return [];
  }
}

export async function searchProducts(q: string): Promise<MarketProduct[]> {
  const term = q.trim();
  if (!term) return [];
  try {
    return await prisma.marketProduct.findMany({
      where: {
        ...publishedWhere,
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { brand: { contains: term, mode: "insensitive" } },
          { shortDescription: { contains: term, mode: "insensitive" } },
          { category: { contains: term, mode: "insensitive" } },
          { tags: { has: term.toLowerCase() } },
        ],
      },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
      take: 60,
    });
  } catch (err) {
    logDbIssue("searchProducts", err);
    return [];
  }
}

/** Products matching a guide, by category or tag. */
export async function getProductsForGuide(guide: Guide): Promise<MarketProduct[]> {
  try {
    const cats = guide.categories || [];
    const tags = (guide.tags || []).map((t) => t.toLowerCase());
    return await prisma.marketProduct.findMany({
      where: {
        ...publishedWhere,
        OR: [
          ...(cats.length ? [{ category: { in: cats } }] : []),
          ...(tags.length ? [{ tags: { hasSome: tags } }] : []),
        ],
      },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
      take: 12,
    });
  } catch (err) {
    logDbIssue("getProductsForGuide", err);
    return [];
  }
}

/** Related products: explicit `related` slugs first, then same-category fill. */
export async function getRelatedProducts(product: MarketProduct): Promise<MarketProduct[]> {
  let related: MarketProduct[] = [];
  if (product.related?.length) {
    related = await getProductsBySlugs(product.related);
  }
  if (related.length < 3 && product.category) {
    const more = await getProducts({ category: product.category });
    const seen = new Set(related.map((r) => r.slug));
    for (const m of more) {
      if (m.slug !== product.slug && !seen.has(m.slug)) {
        related.push(m);
        seen.add(m.slug);
      }
    }
  }
  return related.filter((r) => r.slug !== product.slug).slice(0, 4);
}

export async function countProducts(): Promise<number> {
  try {
    return await prisma.marketProduct.count();
  } catch (err) {
    logDbIssue("countProducts", err);
    return 0;
  }
}
