import { test } from "node:test";
import assert from "node:assert/strict";

import { pinTitle, pinDescription, pinAltText, pinImageEyebrow, type PinItem } from "../lib/pinterest/content";

const product: PinItem = {
  kind: "product",
  slug: "knka-air-purifier",
  name: "KNKA Air Purifier for Home",
  brand: "KNKA",
  categoryName: "Home Cleaning",
  categorySlug: "home-cleaning",
  tags: ["air purifier", "hepa"],
  price: 199,
  currency: "USD",
  blurb: "A quiet HEPA air purifier for large rooms.",
};

const course: PinItem = {
  kind: "course",
  slug: "aws-course",
  name: "AWS Certified Solutions Architect",
  categoryName: "AWS",
  categorySlug: "aws",
  provider: "Udemy",
  blurb: "Prepare for the AWS SAA exam.",
};

test("pinTitle is purchase-intent, includes the name, within 100 chars", () => {
  const t = pinTitle(product);
  assert.ok(t.includes("KNKA Air Purifier"));
  assert.ok(t.length <= 100);
  assert.ok(pinTitle(course).includes("AWS Certified Solutions Architect"));
});

test("pinDescription ALWAYS includes the affiliate disclosure + hashtags, ≤500", () => {
  const d = pinDescription(product);
  assert.ok(d.toLowerCase().includes("affiliate"), "must disclose affiliate relationship");
  assert.ok(d.includes("#"), "should include hashtags");
  assert.ok(d.length <= 500);
});

test("pinAltText describes the item", () => {
  assert.ok(pinAltText(product).includes("KNKA Air Purifier"));
});

test("eyebrow reflects the kind", () => {
  assert.equal(pinImageEyebrow(course), "ONLINE COURSE");
  assert.equal(pinImageEyebrow(product), "HOME CLEANING");
});
