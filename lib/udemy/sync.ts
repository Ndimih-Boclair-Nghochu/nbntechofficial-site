import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getUdemySyncConfig,
  buildUdemyAffiliateUrl,
  udemyCourseSlug,
  UDEMY_SYNC_MARKER,
  type UdemySyncConfig,
} from "@/lib/udemy/config";
import {
  normalizeCatalogItem,
  CandidateBuffer,
  type CandidateCourse,
} from "@/lib/udemy/scoring";
import { streamCatalogItems } from "@/lib/udemy/impact-client";

export type SyncSummary = {
  ok: boolean;
  dryRun: boolean;
  processed: number; // catalogue items scanned
  candidates: number; // items that passed the filter
  selected: number; // items kept (≤ maxCourses)
  inserted: number;
  updated: number;
  unchanged: number;
  deactivated: number;
  errors: string[];
  finishedAt: string;
};

function deriveDiscount(price: number | null, original: number | null): number | null {
  if (price != null && original != null && original > price && original > 0) {
    return Math.round(((original - price) / original) * 100);
  }
  return null;
}

function toCourseData(cand: CandidateCourse, rank: number, cfg: UdemySyncConfig): Prisma.CourseUncheckedCreateInput {
  return {
    title: cand.title,
    slug: udemyCourseSlug(cand.externalId),
    provider: "Udemy",
    affiliateNetwork: "Impact",
    // Per-course tracked deep link (or null → admin can paste one; raw URL kept below).
    affiliateUrl: buildUdemyAffiliateUrl(cand.courseUrl, cfg),
    externalProductId: cand.externalId,
    externalProductUrl: cand.courseUrl,
    trackingId: UDEMY_SYNC_MARKER,
    image: cand.image,
    imageAlt: cand.title,
    category: cand.category,
    instructor: cand.instructor,
    shortDescription: cand.description ? cand.description.slice(0, 300) : null,
    price: cand.price,
    originalPrice: cand.originalPrice,
    currency: cand.currency || "USD",
    discountPercentage: deriveDiscount(cand.price, cand.originalPrice),
    rating: cand.rating,
    reviewCount: cand.reviewCount,
    duration: cand.duration,
    level: cand.level,
    language: cand.language || "English",
    lastUpdated: cand.updatedLabel,
    tags: [cand.category ?? "", "udemy"].filter(Boolean),
    demo: false,
    published: true,
    order: rank,
  };
}

/** Fields whose change warrants a DB write (avoids pointless updates). */
type ExistingSynced = {
  externalProductId: string | null;
  rating: number | null;
  price: number | null;
  reviewCount: number | null;
  affiliateUrl: string | null;
  order: number;
  published: boolean;
  title: string;
};

function changed(a: ExistingSynced, b: Prisma.CourseUncheckedCreateInput): boolean {
  return (
    a.rating !== (b.rating ?? null) ||
    a.price !== (b.price ?? null) ||
    a.reviewCount !== (b.reviewCount ?? null) ||
    a.affiliateUrl !== (b.affiliateUrl ?? null) ||
    a.order !== (b.order ?? 0) ||
    a.published !== (b.published ?? true) ||
    a.title !== b.title
  );
}

/**
 * Run one synchronization pass:
 *   fetch (paginated) → normalize → filter → score → rank → cap at maxCourses →
 *   upsert selected (write only when changed) → deactivate synced rows that no
 *   longer qualify (never deleted — history preserved, never touches manual rows).
 */
export async function runUdemySync(opts: { dryRun?: boolean } = {}): Promise<SyncSummary> {
  const dryRun = !!opts.dryRun;
  const cfg = getUdemySyncConfig();
  const errors: string[] = [];
  const buffer = new CandidateBuffer(cfg);
  let processed = 0;

  for await (const page of streamCatalogItems(cfg)) {
    for (const raw of page) {
      processed++;
      const cand = normalizeCatalogItem(raw);
      if (cand) buffer.add(cand);
    }
  }

  const selected = buffer.top(); // guaranteed ≤ cfg.maxCourses
  const selectedIds = selected.map((c) => c.externalId);

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;
  let deactivated = 0;

  if (!dryRun && selected.length) {
    // Load existing synced rows once, keyed by external id, for change detection.
    const existingRows = await prisma.course.findMany({
      where: { trackingId: UDEMY_SYNC_MARKER },
      select: {
        externalProductId: true, rating: true, price: true, reviewCount: true,
        affiliateUrl: true, order: true, published: true, title: true,
      },
    });
    const existing = new Map<string, ExistingSynced>();
    for (const r of existingRows) if (r.externalProductId) existing.set(r.externalProductId, r);

    for (let i = 0; i < selected.length; i++) {
      const data = toCourseData(selected[i], i + 1, cfg);
      try {
        const prev = existing.get(selected[i].externalId);
        if (!prev) {
          await prisma.course.upsert({ where: { slug: data.slug }, update: data, create: data });
          inserted++;
        } else if (changed(prev, data)) {
          await prisma.course.update({ where: { slug: data.slug }, data });
          updated++;
        } else {
          unchanged++;
        }
      } catch (err) {
        errors.push(`upsert ${selected[i].externalId}: ${String(err)}`);
      }
    }

    // Deactivate synced rows that fell out of the selection (keep the record).
    try {
      const res = await prisma.course.updateMany({
        where: {
          trackingId: UDEMY_SYNC_MARKER,
          published: true,
          externalProductId: selectedIds.length ? { notIn: selectedIds } : undefined,
        },
        data: { published: false },
      });
      deactivated = res.count;
    } catch (err) {
      errors.push(`deactivate: ${String(err)}`);
    }
  }

  return {
    ok: errors.length === 0,
    dryRun,
    processed,
    candidates: buffer.size,
    selected: selected.length,
    inserted,
    updated,
    unchanged,
    deactivated,
    errors,
    finishedAt: new Date().toISOString(),
  };
}

/** Lightweight status for the admin panel (no extra table needed). */
export async function getUdemySyncStatus() {
  const cfg = getUdemySyncConfig();
  const [total, active, latest] = await Promise.all([
    prisma.course.count({ where: { trackingId: UDEMY_SYNC_MARKER } }),
    prisma.course.count({ where: { trackingId: UDEMY_SYNC_MARKER, published: true } }),
    prisma.course.findFirst({
      where: { trackingId: UDEMY_SYNC_MARKER },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
  ]);
  return {
    configured: getUdemyConfigStatus(cfg),
    maxCourses: cfg.maxCourses,
    syncIntervalHours: cfg.syncIntervalHours,
    totalSynced: total,
    active,
    inactive: total - active,
    lastSyncedAt: latest?.updatedAt ?? null,
  };
}

/** What's still needed to run a live sync — names only, never secret values. */
export function getUdemyConfigStatus(cfg = getUdemySyncConfig()) {
  return {
    impactCredentials: !!process.env.IMPACT_ACCOUNT_SID && !!process.env.IMPACT_AUTH_TOKEN,
    catalogId: !!cfg.catalogId,
    deepLinkBase: !!cfg.trackingBase,
  };
}
