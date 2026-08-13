import { siteUrl } from "@/lib/utils";

/**
 * NBN MARKET — static configuration + pure helpers.
 *
 * Products are dynamic (Prisma, editable from the admin panel), but the
 * taxonomy of categories, the supported Amazon marketplaces/countries, and the
 * editorial buying guides are curated here in code. This keeps guides at
 * editorial quality while still letting them pull live products by tag/category.
 *
 * Everything is designed to extend: add a country to COUNTRIES, a category to
 * CATEGORIES, or a guide to GUIDES and the routes, sitemap and internal linking
 * pick it up automatically.
 *
 * The marketplace never processes payments — it is a product-discovery /
 * recommendation platform, and the purchase happens on Amazon. We never
 * fabricate availability, prices, ratings or reviews.
 */

export const BRAND = "NBN MARKET";
export const TAGLINE = "Discover Products Worth Buying";

/** Absolute marketplace base URL (canonical). */
export function marketplaceUrl(path = ""): string {
  return `${siteUrl()}/marketplace${path}`;
}

/* ------------------------------------------------------------------ *
 * Countries / marketplaces
 *
 * NBN MARKET promotes products across multiple digital platforms — Amazon and
 * others (Selar, Jumia, eBay, …). A country therefore has an OPTIONAL default
 * Amazon domain; when it has none, per-product availability supplies the
 * platform + link instead. Grouped by region so the platform can expand into
 * Africa and other markets.
 * ------------------------------------------------------------------ */

export type Country = {
  code: string;
  name: string;
  flag: string;
  currency: string;
  region: string;
  /** Amazon domain if this country has one; otherwise null (use per-product platform). */
  amazon?: string | null;
  hreflang?: string;
};

export const COUNTRIES: Country[] = [
  // Europe — Amazon marketplaces
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", region: "Europe", amazon: "amazon.de", hreflang: "de-DE" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", region: "Europe", amazon: "amazon.co.uk", hreflang: "en-GB" },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR", region: "Europe", amazon: "amazon.fr", hreflang: "fr-FR" },
  { code: "IT", name: "Italy", flag: "🇮🇹", currency: "EUR", region: "Europe", amazon: "amazon.it", hreflang: "it-IT" },
  { code: "ES", name: "Spain", flag: "🇪🇸", currency: "EUR", region: "Europe", amazon: "amazon.es", hreflang: "es-ES" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", currency: "EUR", region: "Europe", amazon: "amazon.nl" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", currency: "EUR", region: "Europe", amazon: "amazon.com.be" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", currency: "SEK", region: "Europe", amazon: "amazon.se" },
  { code: "PL", name: "Poland", flag: "🇵🇱", currency: "PLN", region: "Europe", amazon: "amazon.pl" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", currency: "EUR", region: "Europe", amazon: "amazon.co.uk" },
  { code: "AT", name: "Austria", flag: "🇦🇹", currency: "EUR", region: "Europe", amazon: "amazon.de" },
  // North America
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", region: "North America", amazon: "amazon.com" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", region: "North America", amazon: "amazon.ca" },
  // Africa — mostly non-Amazon (Selar, Jumia, …)
  { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR", region: "Africa", amazon: "amazon.co.za" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", currency: "EGP", region: "Africa", amazon: "amazon.eg" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN", region: "Africa", amazon: null },
  { code: "GH", name: "Ghana", flag: "🇬🇭", currency: "GHS", region: "Africa", amazon: null },
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES", region: "Africa", amazon: null },
  { code: "CM", name: "Cameroon", flag: "🇨🇲", currency: "XAF", region: "Africa", amazon: null },
  { code: "CI", name: "Côte d’Ivoire", flag: "🇨🇮", currency: "XOF", region: "Africa", amazon: null },
];

export const DEFAULT_COUNTRY = "DE";

export const COUNTRY_MAP: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c]),
);

export function resolveCountry(code?: string | null): Country {
  const c = code ? COUNTRY_MAP[code.toUpperCase()] : undefined;
  return c || COUNTRY_MAP[DEFAULT_COUNTRY];
}

/** Countries grouped by region — for a tidy, scannable selector. */
export function countriesByRegion(): { region: string; countries: Country[] }[] {
  const order = ["Europe", "North America", "Africa"];
  const groups: Record<string, Country[]> = {};
  for (const c of COUNTRIES) (groups[c.region] ||= []).push(c);
  return Object.keys(groups)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map((region) => ({ region, countries: groups[region] }));
}

/* ------------------------------------------------------------------ *
 * Categories
 * ------------------------------------------------------------------ */

export type Category = {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
};

export const CATEGORIES: Category[] = [
  { slug: "courses", name: "Courses", icon: "📚", blurb: "Online courses and learning to level up your skills and career." },
  { slug: "health-supplements", name: "Health & Supplements", icon: "💊", blurb: "Supplements and wellness products to support a healthier, more active life." },
  { slug: "technology-electronics", name: "Technology & Electronics", icon: "💻", blurb: "Laptops, monitors, peripherals and the gear that powers modern work." },
  { slug: "laptops", name: "Laptops", icon: "🖥️", blurb: "Portable machines for students, developers and professionals." },
  { slug: "developer-gear", name: "Developer & Cloud Computing Gear", icon: "⌨️", blurb: "Keyboards, monitors and accessories built for people who ship code." },
  { slug: "student-essentials", name: "Student Essentials", icon: "🎓", blurb: "Reliable, affordable tools for coursework and campus life." },
  { slug: "home-office", name: "Home & Office", icon: "🏠", blurb: "Everything you need for a comfortable, productive workspace." },
  { slug: "gaming", name: "Gaming", icon: "🎮", blurb: "Rigs, peripherals and accessories for players who want an edge." },
  { slug: "travel-lifestyle", name: "Travel & Lifestyle", icon: "✈️", blurb: "Gear that keeps up with you on the move." },
  { slug: "accessories", name: "Accessories", icon: "🔌", blurb: "The small upgrades that make a big difference." },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

/** Turn any slug into a readable label (for admin-added / synced categories). */
export function slugToLabel(slug: string): string {
  return (slug || "")
    .split(/[-_/]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Display name for a category slug — known metadata, else a derived label. */
export function categoryLabel(slug?: string | null): string {
  if (!slug) return "";
  return CATEGORY_MAP[slug]?.name || slugToLabel(slug);
}

/** Icon for a category slug — known icon, else a neutral default. */
export function categoryIcon(slug?: string | null): string {
  if (!slug) return "🏷️";
  return CATEGORY_MAP[slug]?.icon || "🏷️";
}

/* ------------------------------------------------------------------ *
 * Editorial buying guides
 * ------------------------------------------------------------------ */

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  intro: string;
  criteria: string[];
  tags: string[];
  categories: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: "best-laptops-for-programming",
    title: "Best Laptops for Programming",
    metaTitle: "Best Laptops for Programming (2026) — Tested Picks | NBN MARKET",
    intro:
      "A great programming laptop disappears into the background: enough RAM to keep a browser, editor and containers open at once, a comfortable keyboard for long sessions, and a screen that is easy on the eyes. Below are the machines we recommend, why each earns its place, and where to buy them across Europe.",
    criteria: [
      "At least 16GB of RAM so you can run an IDE, browser and local services together",
      "A fast SSD (512GB+) for quick builds and plenty of project space",
      "A comfortable, low-fatigue keyboard for long coding sessions",
      "Strong battery life so you are not tethered to a wall socket",
      "A colour-accurate screen that stays readable for hours",
    ],
    tags: ["programming", "developer"],
    categories: ["laptops", "developer-gear"],
  },
  {
    slug: "best-laptops-for-students",
    title: "Best Laptops for Students",
    metaTitle: "Best Laptops for Students (2026) — Budget to Premium | NBN MARKET",
    intro:
      "The right student laptop balances price, portability and battery life. You want something light enough to carry across campus, tough enough to survive a few years, and cheap enough that it will not wreck your budget. These are our picks by use case, from budget all-rounders to machines that can handle heavier coursework.",
    criteria: [
      "Light enough to carry all day between lectures",
      "All-day battery life so you rarely need a charger on campus",
      "Reliable build quality that lasts a full degree",
      "Enough performance for research, writing and light coding",
      "Sensible value — you should not overpay for features you will not use",
    ],
    tags: ["student", "budget"],
    categories: ["laptops", "student-essentials"],
  },
  {
    slug: "best-laptops-for-cloud-computing",
    title: "Best Laptops for Cloud & DevOps Work",
    metaTitle: "Best Laptops for Cloud Computing & DevOps (2026) | NBN MARKET",
    intro:
      "Cloud and DevOps work is less about raw local horsepower and more about running many tools at once — terminals, containers, browser tabs, and remote sessions. The ideal machine has generous memory, a crisp display for reading logs, and battery life that survives a full day of context-switching. Here is what we recommend.",
    criteria: [
      "16GB of RAM or more for containers and multiple terminals",
      "A sharp display that keeps dense logs and dashboards legible",
      "Rock-solid Wi-Fi for remote sessions and cloud consoles",
      "Portability for working from anywhere",
      "A keyboard you can live in for hours",
    ],
    tags: ["cloud", "devops", "developer"],
    categories: ["laptops", "developer-gear"],
  },
  {
    slug: "best-monitors-for-programmers",
    title: "Best Monitors for Programmers",
    metaTitle: "Best Monitors for Programmers & Developers (2026) | NBN MARKET",
    intro:
      "A good monitor is the cheapest large productivity upgrade most developers can make. More vertical space means more code on screen; better colour and sharpness mean less eye strain. We look at resolution, panel type and ergonomics to recommend displays that make long days easier.",
    criteria: [
      "High resolution (1440p or 4K) so more code fits on screen",
      "An IPS panel for consistent colour and wide viewing angles",
      "Comfortable ergonomics — height adjustment matters",
      "Enough size (27\"+) to justify the desk space",
      "Flicker-free backlighting to reduce eye strain",
    ],
    tags: ["monitor", "programming"],
    categories: ["developer-gear", "technology-electronics"],
  },
  {
    slug: "best-keyboards-for-developers",
    title: "Best Keyboards for Developers",
    metaTitle: "Best Keyboards for Developers & Programmers (2026) | NBN MARKET",
    intro:
      "You touch your keyboard more than any other tool, so it is worth getting right. Mechanical switches, a sensible layout and solid build quality all reduce fatigue over a long day. These are the boards we recommend for people who type for a living.",
    criteria: [
      "Comfortable, low-fatigue switches for all-day typing",
      "A layout that keeps common keys within easy reach",
      "Solid build quality that survives heavy use",
      "Optional wireless for a tidy desk",
      "Good value for the typing experience",
    ],
    tags: ["keyboard", "developer"],
    categories: ["developer-gear", "accessories"],
  },
];

export const GUIDE_MAP: Record<string, Guide> = Object.fromEntries(
  GUIDES.map((g) => [g.slug, g]),
);

/* ------------------------------------------------------------------ *
 * Availability + Amazon links (pure helpers)
 * ------------------------------------------------------------------ */

export type AvailabilityStatus = "AVAILABLE" | "UNAVAILABLE" | "AVAILABILITY_UNKNOWN";

export type CountryAvailability = {
  status: AvailabilityStatus;
  /** Selling platform, e.g. "Amazon", "Selar", "Jumia", "eBay". */
  platform?: string;
  url?: string;
  price?: number | null;
  currency?: string;
};

/** The subset of a product the pure helpers need. */
export type ProductLike = {
  name: string;
  brand?: string | null;
  /** Per-country availability JSON (historically named amazonAvailability). */
  amazonAvailability?: unknown;
};

export type ResolvedAvailability = {
  country: Country;
  status: AvailabilityStatus;
  /** Selling platform label, e.g. "Amazon", "Selar". "" when none is known. */
  platform: string;
  url: string;
  /** true when we have a real product link (not just a search fallback). */
  hasDirectUrl: boolean;
  /** true when there is any usable outbound link at all. */
  hasLink: boolean;
  price: number | null;
  currency: string;
  priceLabel: string;
};

const AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || "";

function withTag(url: string): string {
  if (!url || !AFFILIATE_TAG || !/amazon\./i.test(url)) return url;
  return url + (url.includes("?") ? "&" : "?") + "tag=" + encodeURIComponent(AFFILIATE_TAG);
}

/** An honest Amazon search link — it does not claim a specific listing exists. */
export function amazonSearchUrl(country: Country, product: ProductLike): string {
  if (!country.amazon) return "";
  const q = encodeURIComponent([product.brand, product.name].filter(Boolean).join(" "));
  return withTag(`https://www.${country.amazon}/s?k=${q}`);
}

export function money(amount?: number | null, currency = "EUR"): string {
  if (amount == null || Number.isNaN(Number(amount))) return "";
  const sym: Record<string, string> = { EUR: "€", GBP: "£", USD: "$", CAD: "$", ZAR: "R", NGN: "₦", GHS: "₵", KES: "KSh", EGP: "E£", SEK: "kr", PLN: "zł", XAF: "FCFA", XOF: "CFA" };
  const val = Number(amount).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return sym[currency] ? `${sym[currency]}${val}` : `${val} ${currency}`.trim();
}

function readAvailabilityMap(raw: unknown): Record<string, CountryAvailability> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, CountryAvailability>;
  }
  return {};
}

/**
 * Resolve availability for a product in one country. Unknown is never conflated
 * with unavailable. Platform-agnostic: uses the per-product platform + link when
 * present; for Amazon countries with no direct link, falls back to an honest
 * Amazon search link. Non-Amazon countries with no link simply have no CTA.
 */
export function availabilityFor(product: ProductLike, code: string): ResolvedAvailability {
  const country = resolveCountry(code);
  const map = readAvailabilityMap(product.amazonAvailability);
  const data = map[country.code] || {};
  let status = String(data.status || "").toUpperCase() as AvailabilityStatus;
  if (!["AVAILABLE", "UNAVAILABLE", "AVAILABILITY_UNKNOWN"].includes(status)) {
    status = "AVAILABILITY_UNKNOWN";
  }
  const platform = data.platform || (country.amazon ? "Amazon" : "");
  const directUrl = data.url ? withTag(data.url) : "";
  const searchUrl = !directUrl && country.amazon ? amazonSearchUrl(country, product) : "";
  const url = directUrl || searchUrl;
  const price = data.price != null && data.price !== undefined ? Number(data.price) : null;
  const currency = data.currency || country.currency;
  return {
    country,
    status,
    platform,
    url,
    hasDirectUrl: !!directUrl,
    hasLink: !!url,
    price,
    currency,
    priceLabel: price != null ? money(price, currency) : "",
  };
}

/** Availability across every supported country, keyed by code (for the client). */
export function availabilityByCountry(product: ProductLike) {
  const out: Record<string, ResolvedAvailability & { flag: string; countryName: string }> = {};
  for (const c of COUNTRIES) {
    const a = availabilityFor(product, c.code);
    out[c.code] = { ...a, flag: c.flag, countryName: c.name };
  }
  return out;
}

export const AVAILABILITY_LABEL: Record<AvailabilityStatus, string> = {
  AVAILABLE: "Available",
  UNAVAILABLE: "Not currently available",
  AVAILABILITY_UNKNOWN: "Availability not verified",
};

/** The Buy/CTA label for a resolved availability + status. */
export function ctaLabel(a: ResolvedAvailability): string {
  if (!a.hasLink) return "";
  return `Buy on ${a.platform || "store"}`;
}

/**
 * The best purchasable offer for a product across all countries — used as a
 * fallback so a card/CTA can always say "Buy on {platform}" even when the
 * shopper's own country has no direct link. Prefers AVAILABLE, then any linked
 * offer. Returns null only when nothing links anywhere.
 */
export function primaryOffer(product: ProductLike): ResolvedAvailability | null {
  let fallback: ResolvedAvailability | null = null;
  for (const c of COUNTRIES) {
    const a = availabilityFor(product, c.code);
    if (!a.hasLink) continue;
    if (a.status === "AVAILABLE") return a;
    if (!fallback) fallback = a;
  }
  return fallback;
}

const STATUS_RANK: Record<AvailabilityStatus, number> = {
  AVAILABLE: 0,
  AVAILABILITY_UNKNOWN: 1,
  UNAVAILABLE: 2,
};

/**
 * Sort products so the ones available in the shopper's country come first, then
 * unverified, then unavailable. Stable within each group.
 */
export function sortByAvailability<T extends ProductLike>(products: T[], code: string): T[] {
  return products
    .map((p, i) => ({ p, i, r: STATUS_RANK[availabilityFor(p, code).status] }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.p);
}
