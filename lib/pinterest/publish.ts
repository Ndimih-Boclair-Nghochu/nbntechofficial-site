import "server-only";

import { prisma } from "@/lib/prisma";
import { getAllProducts, getAvailableCategories } from "@/lib/marketplace-data";
import { getAllCourses } from "@/lib/courses-data";
import { categoryLabel } from "@/lib/marketplace";
import { courseCategoryLabel } from "@/lib/courses";
import { siteUrl } from "@/lib/utils";
import {
  pinterestEnabled,
  pinDailyLimit,
  boardNameForCategory,
  COURSES_BOARD_NAME,
  pinterestConfigStatus,
} from "./config";
import { getAccessToken, listBoards, createBoard, createPin } from "./api";
import {
  pinTitle,
  pinDescription,
  pinAltText,
  PIN_VARIANTS,
  type PinItem,
} from "./content";

export type PinPublishSummary = {
  ok: boolean;
  dryRun: boolean;
  published: number;
  failed: number;
  skipped: number;
  results: { item: string; status: string; pinId?: string; error?: string }[];
  finishedAt: string;
};

/** Ensure a board exists for each category with products, plus a courses board.
 *  Returns categorySlug → boardId, and "__courses__" → boardId. */
async function ensureBoards(token: string): Promise<Record<string, string>> {
  const existing = await listBoards(token);
  const byName = new Map(existing.map((b) => [b.name.toLowerCase(), b.id]));
  const map: Record<string, string> = {};

  const cats = await getAvailableCategories();
  for (const c of cats) {
    const name = boardNameForCategory(c.name);
    let id = byName.get(name.toLowerCase());
    if (!id) {
      id = (await createBoard(token, name, `The best ${c.name.toLowerCase()} picks from NBN MARKET — live prices, honest deals.`)).id;
      byName.set(name.toLowerCase(), id);
    }
    map[c.slug] = id;
  }
  // Courses board
  let cid = byName.get(COURSES_BOARD_NAME.toLowerCase());
  if (!cid) cid = (await createBoard(token, COURSES_BOARD_NAME, "Online courses worth taking — reviews, prices and honest picks.")).id;
  map["__courses__"] = cid;
  return map;
}

/** Round-robin products across categories (spread, not dumped) + some courses. */
async function pickItems(limit: number): Promise<PinItem[]> {
  const pinned = new Set(
    (await prisma.pinLog.findMany({ where: { status: "success" }, select: { itemType: true, itemSlug: true } })).map(
      (r) => `${r.itemType}:${r.itemSlug}`,
    ),
  );

  const products = (await getAllProducts()).filter((p) => !pinned.has(`product:${p.slug}`) && p.imageUrl);
  const courses = (await getAllCourses()).filter((c) => !pinned.has(`course:${c.slug}`) && c.image);

  // Group products by category, then round-robin so pins spread across boards.
  const groups = new Map<string, typeof products>();
  for (const p of products) {
    const k = p.category || "other";
    (groups.get(k) || groups.set(k, []).get(k)!).push(p);
  }
  const buckets = Array.from(groups.values());
  const ordered: PinItem[] = [];
  for (let i = 0; ordered.length < products.length; i++) {
    let advanced = false;
    for (const b of buckets) {
      if (i < b.length) {
        const p = b[i];
        ordered.push({
          kind: "product",
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          categoryName: categoryLabel(p.category) || "Products",
          categorySlug: p.category || "other",
          tags: p.tags,
          price: p.price,
          currency: p.currency,
          image: p.imageUrl,
          blurb: p.shortDescription,
        });
        advanced = true;
      }
    }
    if (!advanced) break;
  }

  const courseItems: PinItem[] = courses.map((c) => ({
    kind: "course",
    slug: c.slug,
    name: c.title,
    brand: c.instructor,
    categoryName: courseCategoryLabel(c.category) || "Online course",
    categorySlug: c.category || "other",
    tags: c.tags,
    price: c.price,
    currency: c.currency,
    provider: c.provider,
    image: c.image,
    blurb: c.shortDescription,
  }));

  // Interleave: mostly products, sprinkle courses.
  const out: PinItem[] = [];
  let pi = 0;
  let ci = 0;
  while (out.length < limit && (pi < ordered.length || ci < courseItems.length)) {
    if (pi < ordered.length) out.push(ordered[pi++]);
    if (out.length < limit && ci < courseItems.length && out.length % 4 === 3) out.push(courseItems[ci++]);
  }
  // top up with remaining courses if products ran out
  while (out.length < limit && ci < courseItems.length) out.push(courseItems[ci++]);
  return out.slice(0, limit);
}

function variantFor(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return (h % PIN_VARIANTS) + 1;
}

function destinationLink(it: PinItem): string {
  const path = it.kind === "product" ? `/nbnmarket/product/${it.slug}` : `/courses/${it.slug}`;
  return `${siteUrl()}${path}?ref=pin&utm_source=pinterest&utm_medium=pin`;
}
function pinImageUrl(it: PinItem, variant: number): string {
  return `${siteUrl()}/api/pin-image/${it.kind}/${encodeURIComponent(it.slug)}?v=${variant}`;
}

/** Publish up to the daily limit of new pins, spread across boards. */
export async function runPinPublish(opts: { dryRun?: boolean; limit?: number } = {}): Promise<PinPublishSummary> {
  const dryRun = !!opts.dryRun;
  const results: PinPublishSummary["results"] = [];
  let published = 0;
  let failed = 0;
  let skipped = 0;

  const limit = opts.limit ?? pinDailyLimit();
  const items = await pickItems(limit);
  if (items.length === 0) {
    return { ok: true, dryRun, published: 0, failed: 0, skipped: 0, results: [], finishedAt: new Date().toISOString() };
  }

  if (dryRun) {
    for (const it of items) results.push({ item: `${it.kind}:${it.slug}`, status: "would-pin" });
    return { ok: true, dryRun, published: 0, failed: 0, skipped: items.length, results, finishedAt: new Date().toISOString() };
  }

  const token = await getAccessToken();
  const boards = await ensureBoards(token);

  for (const it of items) {
    const boardId = it.kind === "course" ? boards["__courses__"] : boards[it.categorySlug] || boards["__courses__"];
    if (!boardId) {
      skipped++;
      results.push({ item: `${it.kind}:${it.slug}`, status: "no-board" });
      continue;
    }
    const variant = variantFor(it.slug);
    const imageUrl = pinImageUrl(it, variant);
    const link = destinationLink(it);
    try {
      const pin = await createPin(token, {
        boardId,
        title: pinTitle(it),
        description: pinDescription(it),
        link,
        imageUrl,
        altText: pinAltText(it),
      });
      await prisma.pinLog.upsert({
        where: { itemType_itemSlug: { itemType: it.kind, itemSlug: it.slug } },
        update: { variant, boardId, pinId: pin.id, imageUrl, link, status: "success", error: null },
        create: { itemType: it.kind, itemSlug: it.slug, variant, boardId, pinId: pin.id, imageUrl, link, status: "success" },
      });
      published++;
      results.push({ item: `${it.kind}:${it.slug}`, status: "success", pinId: pin.id });
    } catch (err) {
      failed++;
      const msg = String(err).slice(0, 300);
      await prisma.pinLog
        .upsert({
          where: { itemType_itemSlug: { itemType: it.kind, itemSlug: it.slug } },
          update: { variant, boardId, imageUrl, link, status: "error", error: msg },
          create: { itemType: it.kind, itemSlug: it.slug, variant, boardId, imageUrl, link, status: "error", error: msg },
        })
        .catch(() => {});
      results.push({ item: `${it.kind}:${it.slug}`, status: "error", error: msg });
    }
  }

  return { ok: failed === 0, dryRun, published, failed, skipped, results, finishedAt: new Date().toISOString() };
}

/** Report for the admin: this week's pins, successes, failures. */
export async function getPinReport() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const [total, success, failedRows] = await Promise.all([
    prisma.pinLog.count(),
    prisma.pinLog.count({ where: { status: "success" } }),
    prisma.pinLog.findMany({ where: { status: "error", createdAt: { gte: weekAgo } }, select: { itemSlug: true, error: true }, take: 10 }),
  ]);
  const thisWeek = await prisma.pinLog.count({ where: { status: "success", createdAt: { gte: weekAgo } } });
  return { configured: pinterestConfigStatus(), totalPinned: total, totalSuccess: success, publishedThisWeek: thisWeek, recentFailures: failedRows };
}
