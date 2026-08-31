import { test } from "node:test";
import assert from "node:assert/strict";

import {
  escapeHtml,
  parseCommand,
  chunk,
  productCaption,
  categoriesKeyboard,
  countryKeyboard,
  productKeyboard,
  shareIntentUrl,
  pageNavKeyboard,
} from "../lib/telegram/format";

test("escapeHtml neutralizes HTML-significant chars", () => {
  assert.equal(escapeHtml("A & B <script>"), "A &amp; B &lt;script&gt;");
});

test("parseCommand extracts command, args, @botname and /start payload", () => {
  assert.deepEqual(parseCommand("/start"), { command: "start", args: "" });
  assert.deepEqual(parseCommand("/search air fryer"), { command: "search", args: "air fryer" });
  assert.deepEqual(parseCommand("/deals@NbnMarketBot"), { command: "deals", args: "" });
  assert.deepEqual(parseCommand("/start alert_123"), { command: "start", args: "alert_123" });
  assert.equal(parseCommand("just text"), null);
});

test("productCaption builds escaped HTML with price and source", () => {
  const cap = productCaption({
    title: "Chair & Desk <deal>",
    brand: "FlexiSeat",
    priceText: "£129.99",
    source: "via Awin",
    availability: "Price may change",
  });
  assert.ok(cap.includes("<b>Chair &amp; Desk &lt;deal&gt;</b>"));
  assert.ok(cap.includes("£129.99"));
  assert.ok(cap.includes("via Awin"));
});

test("chunk splits into rows", () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test("categoriesKeyboard uses cat:<slug> callbacks, 2 per row", () => {
  const kb = categoriesKeyboard([
    { slug: "gaming", name: "Gaming", icon: "🎮" },
    { slug: "fitness", name: "Fitness" },
    { slug: "home-office", name: "Home & Office" },
  ]);
  assert.equal(kb.inline_keyboard[0].length, 2);
  assert.equal(kb.inline_keyboard[1].length, 1);
  assert.deepEqual(kb.inline_keyboard[0][0], { text: "🎮 Gaming", callback_data: "cat:gaming" });
});

test("countryKeyboard uses country:<code> callbacks", () => {
  const kb = countryKeyboard([{ code: "DE", name: "Germany", flag: "🇩🇪" }]);
  assert.deepEqual(kb.inline_keyboard[0][0], { text: "🇩🇪 Germany", callback_data: "country:DE" });
});

test("productKeyboard exposes the real affiliate URL as a URL button", () => {
  const kb = productKeyboard({ buyUrl: "https://amzn.to/xyz", buyLabel: "Buy on Amazon", siteUrl: "https://s/p/1" });
  assert.deepEqual(kb.inline_keyboard[0][0], { text: "Buy on Amazon", url: "https://amzn.to/xyz" });
  assert.equal(kb.inline_keyboard[0][1].text, "🔎 Details");
});

test("productKeyboard omits buy button when there is no link", () => {
  const kb = productKeyboard({ buyUrl: null, siteUrl: "https://s/p/1" });
  // only the Details button remains on the top row
  assert.equal(kb.inline_keyboard[0].length, 1);
  assert.equal(kb.inline_keyboard[0][0].text, "🔎 Details");
});

test("productKeyboard adds a Share-the-bot row when shareUrl is given", () => {
  const kb = productKeyboard({ buyUrl: "https://amzn.to/x", siteUrl: "https://s/p/1", shareUrl: "https://t.me/share/url?url=x" });
  const share = kb.inline_keyboard[1][0];
  assert.ok(share.text.includes("Share"));
  assert.ok("url" in share && share.url.startsWith("https://t.me/share/url"));
});

test("shareIntentUrl builds a Telegram share link to the bot", () => {
  const u = shareIntentUrl("NbnMarketBot", "Deals!");
  assert.ok(u.startsWith("https://t.me/share/url?url="));
  assert.ok(u.includes(encodeURIComponent("https://t.me/NbnMarketBot")));
});

test("pageNavKeyboard shows a Show-more button only when items remain", () => {
  const withMore = pageNavKeyboard("pgall:6", 12, "https://t.me/share/url?url=x");
  assert.ok(withMore.inline_keyboard[0][0].text.includes("Show more"));
  const noMore = pageNavKeyboard(null, 0, "https://t.me/share/url?url=x");
  assert.ok(!JSON.stringify(noMore).includes("Show more"));
});
