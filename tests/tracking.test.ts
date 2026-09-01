import { test } from "node:test";
import assert from "node:assert/strict";

import { isAllowedDestination, trackedUrl } from "../lib/tracking";

test("isAllowedDestination allows affiliate/partner hosts", () => {
  for (const u of [
    "https://www.amazon.co.uk/dp/x",
    "https://amazon.com/dp/x",
    "https://amzn.to/abc",
    "https://selar.com/p/x",
    "https://www.awin1.com/cread.php?awinmid=1",
    "https://tidd.ly/45XtOES",
    "https://trk.udemy.com/aNDLqW",
    "https://t.me/NbnMarketBot",
    "https://www.pinterest.com/pin/1",
  ]) {
    assert.ok(isAllowedDestination(u), `should allow ${u}`);
  }
});

test("isAllowedDestination refuses look-alike/unknown hosts + bad schemes", () => {
  for (const u of [
    "https://amazon.co.uk.evil.com/steal", // look-alike — must NOT match
    "https://evil.com/amazon.com",
    "https://notamazon.com/x",
    "javascript:alert(1)",
    "ftp://amazon.com/x",
    "not a url",
    "",
  ]) {
    assert.equal(isAllowedDestination(u), false, `should refuse ${u}`);
  }
});

test("trackedUrl wraps allow-listed destinations with metadata", () => {
  const u = trackedUrl({ url: "https://amzn.to/abc", source: "amazon", product: "p1", category: "gaming", placement: "bot" });
  assert.ok(u.includes("/r?u="));
  assert.ok(u.includes(encodeURIComponent("https://amzn.to/abc")));
  assert.ok(u.includes("s=amazon"));
  assert.ok(u.includes("pid=p1"));
  assert.ok(u.includes("c=gaming"));
  assert.ok(u.includes("pl=bot"));
});

test("trackedUrl passes non-allow-listed URLs through unchanged (never wraps what we won't forward)", () => {
  assert.equal(trackedUrl({ url: "https://evil.com/x" }), "https://evil.com/x");
});
