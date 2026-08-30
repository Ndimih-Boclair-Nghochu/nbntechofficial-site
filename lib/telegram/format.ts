/**
 * Telegram bot — pure formatting & parsing (no network, no DB, unit-tested).
 * Uses Telegram's HTML parse mode, so only &, <, > need escaping in text.
 */

export type InlineButton = { text: string } & (
  | { url: string }
  | { callback_data: string }
);
export type InlineKeyboard = { inline_keyboard: InlineButton[][] };

/** Escape user/product text for Telegram HTML parse mode. */
export function escapeHtml(s: string): string {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Parse a "/command args" message. Handles @botname suffix and /start payloads. */
export function parseCommand(text: string): { command: string; args: string } | null {
  const m = (text || "").trim().match(/^\/([a-zA-Z0-9_]+)(?:@\w+)?(?:\s+([\s\S]*))?$/);
  if (!m) return null;
  return { command: m[1].toLowerCase(), args: (m[2] || "").trim() };
}

/** Chunk an array into rows of n (for keyboard layout). */
export function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

/** A product/course caption (HTML). Inputs are already-resolved strings. */
export function productCaption(p: {
  title: string;
  brand?: string | null;
  priceText?: string | null;
  source?: string | null;
  availability?: string | null;
}): string {
  const lines = [`<b>${escapeHtml(p.title)}</b>`];
  if (p.brand) lines.push(escapeHtml(p.brand));
  const meta = [p.priceText, p.source].filter(Boolean).map((s) => escapeHtml(String(s)));
  if (meta.length) lines.push(meta.join("  ·  "));
  if (p.availability) lines.push(escapeHtml(p.availability));
  return lines.join("\n");
}

/** Category grid keyboard — 2 per row, callback `cat:<slug>`. */
export function categoriesKeyboard(
  cats: { slug: string; name: string; icon?: string }[],
): InlineKeyboard {
  const buttons: InlineButton[] = cats.map((c) => ({
    text: `${c.icon ? c.icon + " " : ""}${c.name}`,
    callback_data: `cat:${c.slug}`,
  }));
  return { inline_keyboard: chunk(buttons, 2) };
}

/** Country picker — 3 per row, callback `country:<code>`. */
export function countryKeyboard(
  countries: { code: string; name: string; flag?: string }[],
): InlineKeyboard {
  const buttons: InlineButton[] = countries.map((c) => ({
    text: `${c.flag ? c.flag + " " : ""}${c.name}`,
    callback_data: `country:${c.code}`,
  }));
  return { inline_keyboard: chunk(buttons, 3) };
}

/** Main menu shown by /start. */
export function mainMenuKeyboard(): InlineKeyboard {
  return {
    inline_keyboard: [
      [
        { text: "🗂️ Categories", callback_data: "menu:categories" },
        { text: "🔥 Today's Deals", callback_data: "menu:deals" },
      ],
      [
        { text: "🎓 Courses", callback_data: "menu:courses" },
        { text: "🌍 Delivery country", callback_data: "menu:country" },
      ],
    ],
  };
}

/** Buttons under a product: the real affiliate buy link + a view-on-site link. */
export function productKeyboard(opts: {
  buyUrl?: string | null;
  buyLabel?: string | null;
  siteUrl?: string | null;
}): InlineKeyboard {
  const row: InlineButton[] = [];
  if (opts.buyUrl) row.push({ text: opts.buyLabel || "🛒 Buy now", url: opts.buyUrl });
  if (opts.siteUrl) row.push({ text: "🔎 Details", url: opts.siteUrl });
  const rows: InlineButton[][] = [];
  if (row.length) rows.push(row);
  return { inline_keyboard: rows };
}
