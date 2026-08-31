/**
 * Telegram bot — pure formatting & parsing (no network, no DB, unit-tested).
 * Uses Telegram's HTML parse mode, so only &, <, > need escaping in text.
 */

export type InlineButton = { text: string } & ({ url: string } | { callback_data: string });
export type InlineKeyboard = { inline_keyboard: InlineButton[][] };

export function escapeHtml(s: string): string {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Parse a "/command args" message. Handles @botname suffix and /start payloads. */
export function parseCommand(text: string): { command: string; args: string } | null {
  const m = (text || "").trim().match(/^\/([a-zA-Z0-9_]+)(?:@\w+)?(?:\s+([\s\S]*))?$/);
  if (!m) return null;
  return { command: m[1].toLowerCase(), args: (m[2] || "").trim() };
}

export function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

/** A "share this bot with a friend" Telegram intent URL. */
export function shareIntentUrl(username: string, text: string): string {
  const link = `https://t.me/${username}`;
  return `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
}

/** Rich, persuasive-but-honest product/course caption (HTML). */
export function productCaption(p: {
  title: string;
  brand?: string | null;
  rating?: string | null;
  blurb?: string | null;
  priceText?: string | null;
  wasText?: string | null;
  discountText?: string | null;
  source?: string | null;
  note?: string | null;
}): string {
  const lines = [`<b>${escapeHtml(p.title)}</b>`];
  const sub = [p.brand, p.rating].filter(Boolean).map((x) => escapeHtml(String(x))).join("  ·  ");
  if (sub) lines.push(sub);
  if (p.blurb) lines.push(escapeHtml(p.blurb));
  const price: string[] = [];
  if (p.priceText) price.push(`💰 <b>${escapeHtml(p.priceText)}</b>`);
  if (p.wasText) price.push(`<s>${escapeHtml(p.wasText)}</s>`);
  if (p.discountText) price.push(escapeHtml(p.discountText));
  if (price.length) lines.push(price.join("  "));
  if (p.source) lines.push(escapeHtml(p.source));
  if (p.note) lines.push(`<i>${escapeHtml(p.note)}</i>`);
  return lines.join("\n");
}

/** Category grid — 2 per row, callback `cat:<slug>`; optional trailing rows. */
export function categoriesKeyboard(
  cats: { slug: string; name: string; icon?: string }[],
  extraRows: InlineButton[][] = [],
): InlineKeyboard {
  const buttons: InlineButton[] = cats.map((c) => ({
    text: `${c.icon ? c.icon + " " : ""}${c.name}`,
    callback_data: `cat:${c.slug}`,
  }));
  return { inline_keyboard: [...chunk(buttons, 2), ...extraRows] };
}

export function countryKeyboard(countries: { code: string; name: string; flag?: string }[]): InlineKeyboard {
  const buttons: InlineButton[] = countries.map((c) => ({
    text: `${c.flag ? c.flag + " " : ""}${c.name}`,
    callback_data: `country:${c.code}`,
  }));
  return { inline_keyboard: chunk(buttons, 3) };
}

/** Main menu shown by /start. */
export function mainMenuKeyboard(shareUrl: string): InlineKeyboard {
  return {
    inline_keyboard: [
      [
        { text: "🛍️ All products", callback_data: "menu:all" },
        { text: "🔥 Today's Deals", callback_data: "menu:deals" },
      ],
      [
        { text: "🗂️ Categories", callback_data: "menu:categories" },
        { text: "🎓 Online Courses", callback_data: "menu:courses" },
      ],
      [
        { text: "🌍 Delivery country", callback_data: "menu:country" },
        { text: "📣 Share NBN MARKET", url: shareUrl },
      ],
    ],
  };
}

/** Buttons under a product: real affiliate buy link + details + share-the-bot. */
export function productKeyboard(opts: {
  buyUrl?: string | null;
  buyLabel?: string | null;
  siteUrl?: string | null;
  shareUrl?: string | null;
}): InlineKeyboard {
  const rows: InlineButton[][] = [];
  const top: InlineButton[] = [];
  if (opts.buyUrl) top.push({ text: opts.buyLabel || "🛒 Buy now", url: opts.buyUrl });
  if (opts.siteUrl) top.push({ text: "🔎 Details", url: opts.siteUrl });
  if (top.length) rows.push(top);
  if (opts.shareUrl) rows.push([{ text: "📣 Share NBN MARKET on Telegram", url: opts.shareUrl }]);
  return { inline_keyboard: rows };
}

/** Nav shown after a page of cards: Show more + Categories + Share. */
export function pageNavKeyboard(
  moreCallback: string | null,
  remaining: number,
  shareUrl: string,
): InlineKeyboard {
  const rows: InlineButton[][] = [];
  if (moreCallback && remaining > 0) {
    rows.push([{ text: `▶️ Show more (${remaining} left)`, callback_data: moreCallback }]);
  }
  rows.push([
    { text: "🗂️ Categories", callback_data: "menu:categories" },
    { text: "📣 Share", url: shareUrl },
  ]);
  return { inline_keyboard: rows };
}
