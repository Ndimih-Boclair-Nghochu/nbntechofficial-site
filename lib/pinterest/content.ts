/**
 * Pinterest pin copy — pure, keyword-rich, honest. No fabricated claims; the
 * affiliate disclosure is ALWAYS appended. Unit-tested.
 */

export type PinItem = {
  kind: "product" | "course";
  slug: string;
  name: string;
  brand?: string | null;
  categoryName: string;
  categorySlug: string;
  tags?: string[];
  price?: number | null;
  currency?: string | null;
  provider?: string | null;
  image?: string | null;
  blurb?: string | null;
};

/** How many visual variants the pin-image endpoint can render. */
export const PIN_VARIANTS = 3;

function year() {
  return new Date().getFullYear();
}
function clean(s: string, max: number) {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}
function hashtags(it: PinItem): string {
  const base = [it.categorySlug.replace(/-/g, ""), ...(it.tags || []).slice(0, 3).map((t) => t.replace(/[^a-z0-9]/gi, ""))]
    .filter(Boolean)
    .slice(0, 4)
    .map((t) => `#${t}`);
  return base.join(" ");
}

/** Pin title (≤ 100 chars) — purchase-intent phrasing, not just the name. */
export function pinTitle(it: PinItem): string {
  if (it.kind === "course") {
    return clean(`${it.name} — Online Course Review (${year()})`, 100);
  }
  return clean(`${it.name} — Best ${it.categoryName} to Buy (${year()})`, 100);
}

/** Pin description (≤ 500) — keyword-rich, benefit-led, disclosure appended. */
export function pinDescription(it: PinItem): string {
  const lead = it.blurb ? clean(it.blurb, 200) : `${it.name} — one of our top ${it.categoryName.toLowerCase()} picks for ${year()}.`;
  const cta =
    it.kind === "course"
      ? "See what you'll learn, the live price and our honest take."
      : "Compare the live price and buy from a trusted retailer.";
  const tags = hashtags(it);
  const disclosure = "(affiliate link — we may earn a commission at no extra cost to you)";
  return clean(`${lead} ${cta} ${tags} ${disclosure}`, 500);
}

/** Alt text for accessibility (≤ 500). */
export function pinAltText(it: PinItem): string {
  return clean(`${it.name} — ${it.categoryName} on NBN MARKET`, 250);
}

/** Short punchy headline shown ON the pin image. */
export function pinImageHeadline(it: PinItem): string {
  return clean(it.name, 70);
}
export function pinImageEyebrow(it: PinItem): string {
  return it.kind === "course" ? "ONLINE COURSE" : it.categoryName.toUpperCase();
}
