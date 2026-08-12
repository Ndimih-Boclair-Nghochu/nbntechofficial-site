import type { NormalizedProduct } from "./types";

/**
 * Confidence-based product matching for deduplication.
 *
 * Identifier strength (highest → lowest):
 *   GTIN/UPC/EAN/ISBN (exact)  >  brand+MPN (high)  >  brand+model (medium)
 *   >  ASIN (medium, same-provider only)  >  title similarity (never auto-merge)
 *
 * Titles alone must NEVER auto-merge; they only ever produce a "review" hint.
 */

export type MatchConfidence = "exact" | "high" | "medium" | "review" | "none";

export type MatchResult = { confidence: MatchConfidence; reason: string; score: number };

function norm(v?: string | null): string {
  return (v || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}

/** GTIN family: strip non-digits; treat UPC-12/EAN-13/ISBN as the same space. */
function gtin(v?: string | null): string {
  const d = (v || "").replace(/\D+/g, "");
  return d.length >= 8 ? d.replace(/^0+/, "") : "";
}

function tokenSetSimilarity(a: string, b: string): number {
  const ta = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const tb = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / new Set([...ta, ...tb]).size;
}

/** Compare two products and return a match confidence. */
export function matchProducts(a: NormalizedProduct, b: NormalizedProduct): MatchResult {
  // 1. GTIN / UPC / EAN / ISBN — exact.
  const ga = gtin(a.gtin);
  const gb = gtin(b.gtin);
  if (ga && gb) {
    if (ga === gb) return { confidence: "exact", reason: "gtin", score: 1 };
    return { confidence: "none", reason: "gtin-mismatch", score: 0 };
  }

  // 2. Brand + MPN — high.
  if (a.brand && b.brand && a.mpn && b.mpn && norm(a.brand) === norm(b.brand) && norm(a.mpn) === norm(b.mpn)) {
    return { confidence: "high", reason: "brand+mpn", score: 0.9 };
  }

  // 3. ASIN — same product on Amazon (medium).
  if (a.asin && b.asin && norm(a.asin) === norm(b.asin)) {
    return { confidence: "medium", reason: "asin", score: 0.75 };
  }

  // 4. Brand + strong title overlap — medium/review, never auto-merge on title.
  if (a.brand && b.brand && norm(a.brand) === norm(b.brand)) {
    const sim = tokenSetSimilarity(a.title, b.title);
    if (sim >= 0.7) return { confidence: "review", reason: "brand+title-similarity", score: 0.6 };
  }

  return { confidence: "none", reason: "no-shared-identifier", score: 0 };
}

/** True only for confidences safe to merge automatically. */
export function canAutoMerge(m: MatchResult): boolean {
  return m.confidence === "exact" || m.confidence === "high";
}
