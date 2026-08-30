import { test } from "node:test";
import assert from "node:assert/strict";

import {
  normalizeCatalogItem,
  mapCategory,
  passesFilter,
  scoreCandidate,
  selectTopCandidates,
  CandidateBuffer,
  type CandidateCourse,
} from "../lib/udemy/scoring";
import { buildUdemyAffiliateUrl, udemyCourseSlug, type UdemySyncConfig } from "../lib/udemy/config";

const cfg: UdemySyncConfig = {
  maxCourses: 100,
  syncIntervalHours: 24,
  minRating: 4.3,
  minReviews: 100,
  maxPages: 50,
  pageSize: 100,
  maxCandidates: 4000,
  catalogId: "123",
  trackingBase: "https://trk.udemy.com/aNDLqW",
  deeplinkParam: "u",
};

function cand(over: Partial<CandidateCourse> = {}): CandidateCourse {
  return {
    externalId: "1", title: "AWS Certified Solutions Architect", courseUrl: "https://www.udemy.com/course/aws-sa/",
    image: null, rawCategory: "IT & Software", category: "aws", instructor: "X",
    price: 15, originalPrice: 90, currency: "USD", rating: 4.7, reviewCount: 5000,
    enrollment: 100000, language: "English", level: "All Levels", duration: "24h",
    updatedLabel: "2025-01", description: "d", score: 0, ...over,
  };
}

/* ---------------------------- parsing ---------------------------- */

test("normalizeCatalogItem maps flat catalog fields", () => {
  const item = {
    CatalogItemId: "abc123", Name: "The Complete Python Bootcamp", Url: "https://www.udemy.com/course/py-ds/",
    ImageUrl: "https://img/x.jpg", Category: "Development", CurrentPrice: "14.99", OriginalPrice: "99.99",
    Currency: "USD", Rating: "4.6", NumberOfReviews: "45210", NumberOfStudents: "300000",
  };
  const n = normalizeCatalogItem(item)!;
  assert.equal(n.externalId, "abc123");
  assert.equal(n.title, "The Complete Python Bootcamp");
  assert.equal(n.category, "python");
  assert.equal(n.price, 14.99);
  assert.equal(n.originalPrice, 99.99);
  assert.equal(n.rating, 4.6);
  assert.equal(n.reviewCount, 45210);
});

test("normalizeCatalogItem returns null when required fields are missing", () => {
  assert.equal(normalizeCatalogItem({ Name: "No id or url" }), null);
});

test("mapCategory routes titles to priority categories", () => {
  assert.equal(mapCategory("AWS Certified Solutions Architect"), "aws");
  assert.equal(mapCategory("ChatGPT & Generative AI Masterclass"), "artificial-intelligence");
  assert.equal(mapCategory("Underwater Basket Weaving"), null);
});

/* ---------------------------- filtering -------------------------- */

test("passesFilter rejects low rating, few reviews, and unmapped categories", () => {
  assert.equal(passesFilter(cand(), cfg), true);
  assert.equal(passesFilter(cand({ rating: 3.9 }), cfg), false);
  assert.equal(passesFilter(cand({ reviewCount: 10 }), cfg), false);
  assert.equal(passesFilter(cand({ category: null }), cfg), false);
  assert.equal(passesFilter(cand({ rating: null, reviewCount: null, enrollment: null }), cfg), false);
});

/* ----------------------------- scoring --------------------------- */

test("scoreCandidate rewards stronger demand & quality, ignores price", () => {
  const strong = scoreCandidate(cand({ rating: 4.8, reviewCount: 50000, enrollment: 500000 }));
  const weak = scoreCandidate(cand({ rating: 4.4, reviewCount: 150, enrollment: 400 }));
  assert.ok(strong > weak, `${strong} should beat ${weak}`);
  // Price must not drive the score.
  const cheap = scoreCandidate(cand({ price: 10 }));
  const pricey = scoreCandidate(cand({ price: 200 }));
  assert.equal(cheap, pricey);
});

/* ------------------- DATABASE PROTECTION (the point) ------------- */

test("313,073 catalog items never yield more than maxCourses selections", () => {
  const many: CandidateCourse[] = [];
  for (let i = 0; i < 313073; i++) {
    many.push(cand({
      externalId: String(i),
      rating: 4.3 + (i % 7) / 10,
      reviewCount: 100 + (i % 9000),
      enrollment: 1000 + (i % 200000),
    }));
  }
  const selected = selectTopCandidates(many, cfg);
  assert.ok(selected.length <= cfg.maxCourses, `got ${selected.length}`);
  assert.equal(selected.length, 100);
  // sorted by score, descending
  for (let i = 1; i < selected.length; i++) assert.ok(selected[i - 1].score >= selected[i].score);
});

test("duplicate external ids collapse to one row (update, not insert)", () => {
  const dupes = [
    cand({ externalId: "same", rating: 4.5, reviewCount: 200 }),
    cand({ externalId: "same", rating: 4.9, reviewCount: 90000 }),
    cand({ externalId: "same", rating: 4.6, reviewCount: 500 }),
  ];
  const selected = selectTopCandidates(dupes, cfg);
  assert.equal(selected.length, 1);
  assert.equal(selected[0].rating, 4.9); // kept the higher-scored duplicate
});

test("CandidateBuffer stays bounded and returns a capped top set", () => {
  const buf = new CandidateBuffer({ ...cfg, maxCandidates: 500 });
  for (let i = 0; i < 50000; i++) buf.add(cand({ externalId: String(i), reviewCount: 100 + (i % 5000) }));
  assert.ok(buf.size <= 1000, `buffer grew to ${buf.size}`);
  assert.ok(buf.top().length <= cfg.maxCourses);
});

/* ------------------------- affiliate URLs ------------------------ */

test("each course gets its OWN deep-linked affiliate URL, never mutated", () => {
  const a = buildUdemyAffiliateUrl("https://www.udemy.com/course/aws-sa/", cfg);
  const b = buildUdemyAffiliateUrl("https://www.udemy.com/course/py-ds/", cfg);
  assert.notEqual(a, b);
  assert.ok(a!.startsWith("https://trk.udemy.com/aNDLqW?u="));
  assert.ok(a!.includes(encodeURIComponent("https://www.udemy.com/course/aws-sa/")));
});

test("affiliate URL builder returns null when deep-link base is unconfigured", () => {
  assert.equal(buildUdemyAffiliateUrl("https://www.udemy.com/course/x/", { ...cfg, trackingBase: null }), null);
});

test("course slug is deterministic per external id (dedupe key)", () => {
  assert.equal(udemyCourseSlug("ABC 123"), "udemy-abc-123");
  assert.equal(udemyCourseSlug("42"), udemyCourseSlug("42"));
});
