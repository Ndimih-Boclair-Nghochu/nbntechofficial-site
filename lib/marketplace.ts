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
 * Countries / Amazon marketplaces
 * ------------------------------------------------------------------ */

export type Country = {
  code: string;
  name: string;
  flag: string;
  amazon: string;
  currency: string;
  hreflang: string;
};

export const COUNTRIES: Country[] = [
  { code: "DE", name: "Germany", flag: "🇩🇪", amazon: "amazon.de", currency: "EUR", hreflang: "de-DE" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", amazon: "amazon.co.uk", currency: "GBP", hreflang: "en-GB" },
  { code: "FR", name: "France", flag: "🇫🇷", amazon: "amazon.fr", currency: "EUR", hreflang: "fr-FR" },
  { code: "IT", name: "Italy", flag: "🇮🇹", amazon: "amazon.it", currency: "EUR", hreflang: "it-IT" },
  { code: "ES", name: "Spain", flag: "🇪🇸", amazon: "amazon.es", currency: "EUR", hreflang: "es-ES" },
];

export const DEFAULT_COUNTRY = "DE";

export const COUNTRY_MAP: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c]),
);

export function resolveCountry(code?: string | null): Country {
  const c = code ? COUNTRY_MAP[code.toUpperCase()] : undefined;
  return c || COUNTRY_MAP[DEFAULT_COUNTRY];
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
  url?: string;
  price?: number | null;
  currency?: string;
};

/** The subset of a product the pure helpers need. */
export type ProductLike = {
  name: string;
  brand?: string | null;
  amazonAvailability?: unknown;
};

export type ResolvedAvailability = {
  country: Country;
  status: AvailabilityStatus;
  url: string;
  hasDirectUrl: boolean;
  price: number | null;
  currency: string;
  priceLabel: string;
};

const AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || "";

function withTag(url: string): string {
  if (!url || !AFFILIATE_TAG) return url;
  return url + (url.includes("?") ? "&" : "?") + "tag=" + encodeURIComponent(AFFILIATE_TAG);
}

/** An honest search link — it does not claim a specific listing exists. */
export function amazonSearchUrl(country: Country, product: ProductLike): string {
  const q = encodeURIComponent([product.brand, product.name].filter(Boolean).join(" "));
  return withTag(`https://www.${country.amazon}/s?k=${q}`);
}

export function money(amount?: number | null, currency = "EUR"): string {
  if (amount == null || Number.isNaN(Number(amount))) return "";
  const sym: Record<string, string> = { EUR: "€", GBP: "£", USD: "$" };
  const val = Number(amount).toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
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
 * with unavailable. When there is no direct listing URL we fall back to an
 * honest Amazon search link.
 */
export function availabilityFor(product: ProductLike, code: string): ResolvedAvailability {
  const country = resolveCountry(code);
  const map = readAvailabilityMap(product.amazonAvailability);
  const data = map[country.code] || {};
  let status = String(data.status || "").toUpperCase() as AvailabilityStatus;
  if (!["AVAILABLE", "UNAVAILABLE", "AVAILABILITY_UNKNOWN"].includes(status)) {
    status = "AVAILABILITY_UNKNOWN";
  }
  const price = data.price != null && data.price !== undefined ? Number(data.price) : null;
  const currency = data.currency || country.currency;
  return {
    country,
    status,
    url: data.url ? withTag(data.url) : amazonSearchUrl(country, product),
    hasDirectUrl: !!data.url,
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
