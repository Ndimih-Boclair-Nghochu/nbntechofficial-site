import type { MarketProduct } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Guide } from "@/lib/marketplace";

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

export async function getProducts(opts?: {
  category?: string;
  featured?: boolean;
  trending?: boolean;
  take?: number;
}): Promise<MarketProduct[]> {
  try {
    return await prisma.marketProduct.findMany({
      where: {
        ...publishedWhere,
        ...(opts?.category ? { category: opts.category } : {}),
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
