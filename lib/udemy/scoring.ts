/**
 * Udemy-via-Impact sync — pure catalogue parsing, filtering, scoring & selection.
 *
 * No network, no database, no secrets. This is the "filter BEFORE insert" brain
 * that guarantees 313k catalogue items can never become 313k database rows.
 * Everything here is deterministic and unit-tested.
 */

import { PRIORITY_TOPICS, type UdemySyncConfig } from "./config";

/** A raw Impact catalog item — flat string key/values (as the Catalog API returns). */
export type RawCatalogItem = Record<string, string | number | null | undefined>;

/** A normalized course candidate, mapped to our own shape. */
export type CandidateCourse = {
  externalId: string;
  title: string;
  courseUrl: string;
  image: string | null;
  rawCategory: string | null;
  /** Mapped site category slug (from PRIORITY_TOPICS), or null if it didn't map. */
  category: string | null;
  instructor: string | null;
  price: number | null;
  originalPrice: number | null;
  currency: string | null;
  rating: number | null;
  reviewCount: number | null;
  enrollment: number | null;
  language: string | null;
  level: string | null;
  duration: string | null;
  updatedLabel: string | null;
  description: string | null;
  /** Computed 0..1 quality/demand score (filled by scoreCandidate). */
  score: number;
};

/** First present, non-empty value among candidate keys (case-insensitive). */
function pick(item: RawCatalogItem, keys: string[]): string | null {
  const lowerMap = new Map<string, string | number>();
  for (const [k, v] of Object.entries(item)) {
    if (v != null && `${v}`.trim() !== "") lowerMap.set(k.toLowerCase(), v);
  }
  for (const key of keys) {
    const v = lowerMap.get(key.toLowerCase());
    if (v != null) return `${v}`.trim();
  }
  return null;
}

function num(v: string | null): number | null {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/**
 * Map a raw catalog item to our candidate shape. Impact catalog feeds vary by
 * advertiser, so each field tries several likely keys rather than assuming one.
 * (If the live Udemy feed uses different labels, extend the key lists here — no
 * other code changes needed.)
 */
export function normalizeCatalogItem(item: RawCatalogItem): CandidateCourse | null {
  const externalId = pick(item, ["CatalogItemId", "Id", "ItemId", "Sku", "UniqueId", "product_id"]);
  const title = pick(item, ["Name", "Title", "ProductName", "course_title"]);
  const courseUrl = pick(item, ["Url", "ProductUrl", "LandingPage", "course_url", "Link"]);
  if (!externalId || !title || !courseUrl) return null;

  const rawCategory = pick(item, ["Category", "CategoryPath", "SubCategory", "primary_category", "course_category"]);
  const cand: CandidateCourse = {
    externalId,
    title,
    courseUrl,
    image: pick(item, ["ImageUrl", "Image", "ImageLink", "image_url", "course_image"]),
    rawCategory,
    category: mapCategory(`${title} ${rawCategory ?? ""}`),
    instructor: pick(item, ["Manufacturer", "Brand", "Instructor", "Author", "instructor_name", "visible_instructors"]),
    price: num(pick(item, ["CurrentPrice", "SalePrice", "Price", "DiscountPrice", "current_price", "price"])),
    originalPrice: num(pick(item, ["OriginalPrice", "ListPrice", "RegularPrice", "original_price", "list_price"])),
    currency: pick(item, ["Currency", "CurrencyCode", "currency"]),
    rating: num(pick(item, ["Rating", "AverageRating", "StarRating", "rating", "avg_rating"])),
    reviewCount: num(pick(item, ["NumberOfReviews", "ReviewCount", "Reviews", "num_reviews", "rating_count"])),
    enrollment: num(pick(item, ["NumberOfStudents", "Enrollments", "Subscribers", "num_subscribers", "students"])),
    language: pick(item, ["Language", "language", "locale"]),
    level: pick(item, ["Level", "InstructionalLevel", "level", "instructional_level"]),
    duration: pick(item, ["Duration", "ContentLength", "content_info", "duration"]),
    updatedLabel: pick(item, ["LastUpdated", "UpdatedDate", "last_update_date", "published_time"]),
    description: pick(item, ["Description", "ShortDescription", "headline", "description"]),
    score: 0,
  };
  return cand;
}

/** Map free text to a site category slug via priority-topic keywords. */
export function mapCategory(text: string): string | null {
  const hay = ` ${text.toLowerCase()} `;
  let best: { category: string; weight: number } | null = null;
  for (const topic of PRIORITY_TOPICS) {
    if (topic.keywords.some((kw) => hay.includes(kw))) {
      if (!best || topic.weight > best.weight) best = { category: topic.category, weight: topic.weight };
    }
  }
  return best?.category ?? null;
}

/** Relevance to the priority topics (0..1) — the best-matching topic's weight. */
export function relevanceScore(cand: CandidateCourse): number {
  const hay = ` ${cand.title.toLowerCase()} ${(cand.rawCategory ?? "").toLowerCase()} `;
  let best = 0;
  for (const topic of PRIORITY_TOPICS) {
    if (topic.keywords.some((kw) => hay.includes(kw))) best = Math.max(best, topic.weight);
  }
  return best;
}

/**
 * Aggressive pre-insert filter. Rejects anything that isn't a strong, relevant,
 * commercially-useful course. Runs BEFORE scoring/insertion — this is the first
 * line of defence against importing the whole catalogue.
 */
export function passesFilter(cand: CandidateCourse, cfg: UdemySyncConfig): boolean {
  if (!cand.category) return false; // must map to a priority category
  if (cand.rating != null && cand.rating < cfg.minRating) return false;
  if (cand.reviewCount != null && cand.reviewCount < cfg.minReviews) return false;
  // Require at least one real demand signal so we don't keep brand-new empty courses.
  if (cand.rating == null && cand.reviewCount == null && cand.enrollment == null) return false;
  return true;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Score a candidate 0..1 from demand + quality + relevance + freshness.
 * Deliberately NOT price-driven: expensive ≠ good. Weights are fixed here but
 * the inputs (thresholds, topics) are configurable.
 */
export function scoreCandidate(cand: CandidateCourse): number {
  // Quality: rating on a 3.5..5.0 curve.
  const quality = cand.rating != null ? clamp01((cand.rating - 3.5) / 1.5) : 0.4;
  // Demand: log-scaled reviews + enrollments.
  const reviews = cand.reviewCount ?? 0;
  const students = cand.enrollment ?? 0;
  const demand = clamp01(
    (Math.log10(1 + reviews) / 5) * 0.5 + (Math.log10(1 + students) / 6) * 0.5,
  );
  // Relevance to priority topics.
  const relevance = relevanceScore(cand);
  // Freshness: a recent 4-digit year in the update label nudges the score.
  let freshness = 0.5;
  const year = (cand.updatedLabel ?? "").match(/20\d{2}/);
  if (year) {
    const y = Number(year[0]);
    const now = new Date().getFullYear();
    freshness = clamp01(1 - (now - y) / 5); // this year → 1, 5+ yrs old → 0
  }
  const score = quality * 0.34 + demand * 0.34 + relevance * 0.22 + freshness * 0.1;
  return Number(score.toFixed(6));
}

/**
 * The database-protection core: from an arbitrarily large candidate stream,
 * dedupe by external id, keep only items that pass the filter, score them, sort
 * by score, and return AT MOST `cfg.maxCourses`. Guaranteed bounded output.
 */
export function selectTopCandidates(
  candidates: CandidateCourse[],
  cfg: UdemySyncConfig,
): CandidateCourse[] {
  const byId = new Map<string, CandidateCourse>();
  for (const raw of candidates) {
    if (!passesFilter(raw, cfg)) continue;
    const scored = { ...raw, score: scoreCandidate(raw) };
    const existing = byId.get(scored.externalId);
    // On duplicate external id, keep the higher-scored one (update, don't add).
    if (!existing || scored.score > existing.score) byId.set(scored.externalId, scored);
  }
  return Array.from(byId.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(0, cfg.maxCourses));
}

/**
 * Bounded accumulator used during streaming so we never hold the whole catalogue
 * in memory. Push items; the buffer is trimmed to the best `maxCandidates` once
 * it grows too large. At the end call `.top(max)` for the final selection.
 */
export class CandidateBuffer {
  private items: CandidateCourse[] = [];
  constructor(private cfg: UdemySyncConfig) {}

  add(cand: CandidateCourse): void {
    if (!passesFilter(cand, this.cfg)) return;
    cand.score = scoreCandidate(cand);
    this.items.push(cand);
    if (this.items.length > this.cfg.maxCandidates * 2) this.trim();
  }

  private trim(): void {
    this.items.sort((a, b) => b.score - a.score);
    this.items.length = Math.min(this.items.length, this.cfg.maxCandidates);
  }

  get size(): number {
    return this.items.length;
  }

  top(): CandidateCourse[] {
    return selectTopCandidates(this.items, this.cfg);
  }
}
