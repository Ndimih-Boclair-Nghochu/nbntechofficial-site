import type { Prisma } from "@prisma/client";
import { COUNTRIES } from "@/lib/marketplace";

/**
 * Third batch of real Amazon affiliate products (storage, organization and home
 * cleaning), added to NBN MARKET with the owner's exact amzn.to tracking links.
 * Every field — title, image, feature copy — is based on the live Amazon page.
 *
 * Prices are the real amounts Amazon displayed at listing time, captured in XAF
 * (the same currency as the rest of the store) so the storefront's live currency
 * conversion localizes them per visitor. Amazon prices change, so the
 * "Buy on Amazon" button always links to the live listing for the exact current
 * price. We never fabricate prices, ratings, reviews or stock.
 *
 * Availability: the amzn.to short links are OneLink-enabled, so a single link
 * routes each visitor to their local Amazon store and earns globally — marked
 * available across every supported country (platform "Amazon").
 */

type AmazonProduct3 = {
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number | null;
  imageUrl: string;
  imageAlt: string;
  affiliateUrl: string;
  shortDescription: string;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  whoFor: string;
  whyRecommend: string;
  faqs: { q: string; a: string }[];
  tags: string[];
  featured?: boolean;
  trending?: boolean;
};

function amazonEverywhereAvailability(url: string) {
  return COUNTRIES.reduce<Record<string, { status: string; platform: string; url: string }>>(
    (m, c) => ({ ...m, [c.code]: { status: "AVAILABLE", platform: "Amazon", url } }),
    {},
  );
}

const AMAZON_FAQ = {
  q: "Is it available in my country?",
  a: "Yes. The link routes you to your local Amazon store, where you'll see the current price, shipping options and delivery estimate before you buy.",
};
const PRICE_FAQ = {
  q: "Is the price up to date?",
  a: "The price shown is what Amazon listed for this item, converted to your local currency. Amazon prices can change, so tap “Buy on Amazon” to confirm the exact, current price before you buy.",
};

export const AMAZON_PICKS_3: AmazonProduct3[] = [
  // ---------------------------------------------------------------- Storage & organization
  {
    name: "Amazon Basics Collapsible Fabric Storage Cubes (6-Pack)",
    slug: "amazon-basics-fabric-storage-cubes-6-pack",
    brand: "Amazon Basics",
    category: "storage-organization",
    subcategory: "storage-bins",
    price: 13232,
    imageUrl: "https://m.media-amazon.com/images/I/613oK3DZ2aL._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics navy collapsible fabric storage cubes with handles, 6-pack",
    affiliateUrl: "https://amzn.to/4i8U0nb",
    shortDescription:
      "A 6-pack of 13\" collapsible fabric storage cubes with sewn-in handles — sturdy, breathable and perfect as open bins or drawers in a cube shelf.",
    description:
      "Tidy up any room with this set of six 13 × 13 × 13\" fabric storage cubes. Each has a sewn-in handle for easy carrying, and the lightweight yet durable fabric is both strong and breathable. Use them as open-top bins on a shelf or slot them into a cube organizer as drawers (unit not included) — great for clothes, toys, books and everyday clutter. They fold flat when not in use.",
    features: [
      "Set of six 13 × 13 × 13\" fabric cubes",
      "Sewn-in fabric handles for easy carrying",
      "Sturdy yet lightweight and breathable",
      "Use as open bins or cube-shelf drawers",
      "Collapse flat when not in use",
      "Neutral navy that suits any room",
    ],
    pros: ["Six cubes in one pack", "Fold flat to store", "Fits standard cube shelves"],
    cons: ["Shelf unit not included", "Soft-sided, not rigid"],
    whoFor: "Anyone organising closets, shelves, playrooms or dorms on a budget.",
    whyRecommend: "Six versatile, foldable cubes at a low price make instant, tidy storage anywhere.",
    faqs: [
      { q: "Do they fit cube shelving?", a: "Yes — the 13\" cubes are sized to work as drawers in standard cube organizers, or as standalone bins." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["storage bins", "organization", "fabric cubes", "amazon basics", "home"],
    trending: true,
  },
  {
    name: "DuraMax Rolling Golf Bag Storage Rack for Garage",
    slug: "duramax-golf-bag-storage-rack-garage",
    brand: "DuraMax",
    category: "storage-organization",
    subcategory: "garage-storage",
    price: 69243,
    imageUrl: "https://m.media-amazon.com/images/I/71bz8FJdzFL._AC_SL1500_.jpg",
    imageAlt: "DuraMax rolling golf bag storage rack with shelves, basket and hooks",
    affiliateUrl: "https://amzn.to/45qZlPq",
    shortDescription:
      "A heavy-duty rolling golf organizer that holds 2 bags plus 12+ clubs, with three shelves, a metal basket, four hooks and lockable wheels for the garage.",
    description:
      "Give your golf gear a proper home. This DuraMax rack holds two standard bags (or one oversized) upright and stable, with a dedicated divider zone that keeps 12+ clubs organised and easy to grab. Three shelves, a metal basket and four hooks store balls, gloves, towels, hats and shoes, and four adjustable 2\" casters let you roll and lock it anywhere in the garage. A powder-coated heavy-duty steel frame keeps everything rock-steady between rounds.",
    features: [
      "Holds 2 standard golf bags (or 1 oversized)",
      "Separate club zone for 12+ clubs upright",
      "3 shelves, 1 metal basket, 4 hooks for gear",
      "4 adjustable 2\" lockable casters",
      "Heavy-duty powder-coated steel frame",
      "Keeps a stand bag upright and organised",
    ],
    pros: ["Complete golf storage station", "Rolls and locks in place", "Sturdy steel build"],
    cons: ["Larger footprint", "Assembly required"],
    whoFor: "Golfers who want their bags, clubs and accessories organised in one rolling station.",
    whyRecommend: "It stores bags, clubs and every accessory together and rolls wherever you need it.",
    faqs: [
      { q: "How many bags does it hold?", a: "Two standard bags or one oversized bag, plus a separate zone for 12+ clubs." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["golf storage", "garage organizer", "storage rack", "duramax", "organization"],
    featured: true,
  },
  {
    name: "Sports Equipment Garage Organizer with Rolling Cart",
    slug: "sports-equipment-garage-organizer-rolling",
    brand: "WUC",
    category: "storage-organization",
    subcategory: "garage-storage",
    price: 55393,
    imageUrl: "https://m.media-amazon.com/images/I/81wi9H8b47L._AC_SL1500_.jpg",
    imageAlt: "Heavy-duty sports equipment garage organizer with ball baskets, hooks and wheels",
    affiliateUrl: "https://amzn.to/3RNyvxN",
    shortDescription:
      "A heavy-duty rolling sports organizer with two ball bins, two mesh baskets, a bat rack and five hooks — stores balls, gear and toys, indoors or out.",
    description:
      "Corral all your sports gear in one sturdy station. This WUC organizer combines two large storage bins, two foldable wire-mesh baskets and a separable bat rack to hold basketballs, footballs, soccer balls, helmets, yoga mats and even kids' toys. Five movable hooks keep gloves, caps, bags and jerseys tidy, and a 360° rotating front wheel with locking casters makes it easy to move indoors or out. Built from high-quality reinforced steel (36.2 × 16.9 × 46\").",
    features: [
      "2 large ball bins + 2 foldable mesh baskets",
      "Separable bat rack for rackets and bats",
      "5 movable hooks for gloves, caps and bags",
      "360° rotating wheel with locking casters",
      "Reinforced steel, indoor/outdoor use",
      "Overall size 36.2 × 16.9 × 46\"",
    ],
    pros: ["Holds lots of gear", "Rolls and locks", "Strong steel build"],
    cons: ["Assembly required", "Takes up floor space"],
    whoFor: "Families and teams who want to tame scattered balls and sports equipment.",
    whyRecommend: "Bins, baskets, a bat rack and hooks in one rolling unit end sports-gear clutter.",
    faqs: [
      { q: "Can it hold a yoga mat and helmets?", a: "Yes — the large bins fit balls, helmets, yoga mats and even kids' toys, with hooks for smaller gear." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["sports organizer", "garage organizer", "ball storage", "storage rack", "organization"],
    trending: true,
  },
  {
    name: "Amazon Basics 4-Shelf Steel Wire Shelving Unit",
    slug: "amazon-basics-4-shelf-wire-shelving",
    brand: "Amazon Basics",
    category: "storage-organization",
    subcategory: "garage-storage",
    price: 20953,
    imageUrl: "https://m.media-amazon.com/images/I/71ZPJe9hoLL._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics 4-shelf black steel wire storage shelving unit for garage",
    affiliateUrl: "https://amzn.to/4hsGvi1",
    shortDescription:
      "A sturdy 4-shelf steel wire shelving unit holding 200 lb per shelf (800 lb total) — height-adjustable in 1\" increments and tool-free to assemble.",
    description:
      "A reliable, no-nonsense shelving unit for the garage, laundry room, kitchen or workspace. Durable black steel holds up to 200 lb per shelf and 800 lb total (evenly distributed), and the shelves adjust in 1-inch increments so you can fit tall items. Four leveling feet keep it stable on uneven floors, and it assembles quickly with no tools. Measures 23.2\" W × 48\" H × 13.4\" D.",
    features: [
      "4 durable steel wire shelves",
      "Holds 200 lb per shelf, 800 lb total",
      "Height-adjustable in 1\" increments",
      "4 leveling feet for stability",
      "Tool-free assembly",
      "23.2\" W × 48\" H × 13.4\" D",
    ],
    pros: ["Strong weight capacity", "Adjustable shelves", "No tools to assemble"],
    cons: ["Narrow 13.4\" depth", "Open wire (small items may need bins)"],
    whoFor: "Anyone needing sturdy, adjustable shelving for a garage, pantry or utility room.",
    whyRecommend: "A dependable, strong and adjustable shelf from a trusted brand at a great price.",
    faqs: [
      { q: "How much weight can it hold?", a: "Up to 200 lb per shelf, evenly distributed, for 800 lb total." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["shelving", "garage storage", "wire shelf", "amazon basics", "organization"],
  },

  // ---------------------------------------------------------------- Home office
  {
    name: "Simple Houseware Desk File Organizer with Drawer",
    slug: "simple-houseware-desk-file-organizer",
    brand: "Simple Houseware",
    category: "home-office",
    subcategory: "desk-organizers",
    price: 15275,
    imageUrl: "https://m.media-amazon.com/images/I/91DUmkaTjBL._AC_SL1500_.jpg",
    imageAlt: "Simple Houseware black desk file organizer with drawer, trays and pen holder",
    affiliateUrl: "https://amzn.to/4xGhvbX",
    shortDescription:
      "An all-in-one desk organizer combining vertical file sorters, double letter trays, a sliding divider drawer and a detachable pen holder to clear your desk.",
    description:
      "Bring order to a busy desk with one compact unit. Five upright sections hold file folders and binders, double horizontal trays store notebooks, staplers and larger items, and a smooth sliding bottom drawer with six movable dividers keeps markers, sticky notes and paperclips sorted. A detachable side bucket adds vertical storage for pens, rulers and highlighters. Overall size 9\"D × 13.2\"W × 12\"H (excluding the pen bucket).",
    features: [
      "5 upright sections for files and binders",
      "Double horizontal letter trays",
      "Sliding drawer with 6 movable dividers",
      "Detachable side pen/pencil bucket",
      "Sturdy steel-mesh construction",
      "9\"D × 13.2\"W × 12\"H footprint",
    ],
    pros: ["Combines files, trays and a drawer", "Customizable dividers", "Detachable pen holder"],
    cons: ["Check desk space before buying", "Assembly required"],
    whoFor: "Anyone who wants to declutter a home or office desk in one tidy unit.",
    whyRecommend: "It replaces several separate organizers with one flexible, space-saving station.",
    faqs: [
      { q: "Can I rearrange the drawer compartments?", a: "Yes — the drawer has six fully movable dividers so you can create custom sections." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["desk organizer", "home office", "file organizer", "simple houseware", "office supplies"],
    featured: true,
  },

  // ---------------------------------------------------------------- Home cleaning
  {
    name: "Cordless Electric Spin Scrubber (IPX7, 90-min Runtime)",
    slug: "cordless-electric-spin-scrubber-ipx7",
    brand: "NBN Pick",
    category: "home-cleaning",
    subcategory: "cleaning-tools",
    price: 19615,
    imageUrl: "https://m.media-amazon.com/images/I/71GhDHqOwNL._AC_SL1490_.jpg",
    imageAlt: "Cordless electric spin scrubber with LCD display, multiple brush heads and extendable handle",
    affiliateUrl: "https://amzn.to/4bPWVgO",
    shortDescription:
      "A cordless power scrubber with a 450 rpm motor, IPX7 waterproofing, 4 brush heads, an extendable handle and a 90-minute runtime — for bathroom, kitchen and car.",
    description:
      "Cut scrubbing time and save your back. This cordless spin scrubber spins up to 450 rpm to blast soap scum, grout grime and tough stains across bathtubs, tiles, toilets and more, with two speeds and full IPX7 waterproofing so you can rinse it under the tap. Four replaceable brush heads reach corners and different surfaces, a stainless handle extends from 26\" to 45\" so you can clean without bending, and an LED display shows the battery level. A full charge lasts up to 90 minutes.",
    features: [
      "450 rpm motor blasts grime and soap scum",
      "2 speeds; IPX7 fully waterproof",
      "4 replaceable multi-surface brush heads",
      "Extendable handle from 26\" to 45\"",
      "LED battery display, USB-C fast charge",
      "Up to 90 minutes of runtime per charge",
    ],
    pros: ["Saves time and effort", "Fully waterproof", "Long reach + long runtime"],
    cons: ["Charge takes 3–4 hours", "Bristles wear with heavy use"],
    whoFor: "Anyone who wants an easier way to scrub bathrooms, tiles, kitchens and cars.",
    whyRecommend: "Power scrubbing plus an extendable handle makes tough cleaning far quicker and kinder on your back.",
    faqs: [
      { q: "Is it safe to use with water?", a: "Yes — it's IPX7 waterproof, so you can rinse it directly under a running tap." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["spin scrubber", "cleaning", "bathroom", "cordless", "home cleaning"],
    trending: true,
  },
  {
    name: "BISSELL Little Green Portable Carpet & Upholstery Cleaner",
    slug: "bissell-little-green-portable-carpet-cleaner",
    brand: "BISSELL",
    category: "home-cleaning",
    subcategory: "carpet-cleaners",
    price: 57413,
    imageUrl: "https://m.media-amazon.com/images/I/717X5secGjL._AC_SL1500_.jpg",
    imageAlt: "BISSELL Little Green 1400B portable carpet and upholstery cleaner, green",
    affiliateUrl: "https://amzn.to/4zfGX9J",
    shortDescription:
      "America's #1 portable deep cleaner — the BISSELL Little Green lifts stains and odors from carpet, upholstery and car interiors with a simple spray, scrub and suction.",
    description:
      "A cult-favourite portable cleaner trusted by millions. The BISSELL Little Green tackles 100+ common messes and stains on carpet, upholstery, stairs and car interiors — just spray the triple-action formula, scrub with the included tool, and suction it away for like-new results. A large 48 oz clean-water tank lets you clean more without stopping, and it comes with specialty tools for detailing. Every purchase supports the BISSELL Pet Foundation.",
    features: [
      "America's #1 brand in portable deep cleaning",
      "Removes 100+ common stains and odors",
      "Triple-action formula for stains and smells",
      "Large 48 oz clean-water tank",
      "Spray, scrub & suction on carpet & upholstery",
      "Specialty tools for car & auto detailing",
    ],
    pros: ["Trusted, proven cleaner", "Great on pet messes", "Doubles for car interiors"],
    cons: ["Corded (not cordless)", "Small tank vs full-size machines"],
    whoFor: "Pet owners and families who want to spot-clean carpets, sofas and car seats.",
    whyRecommend: "It's the go-to portable cleaner for stains and odors — proven by millions of households.",
    faqs: [
      { q: "Can I use it on my car seats?", a: "Yes — it includes specialty tools for upholstery and car/auto detailing." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["carpet cleaner", "bissell", "upholstery", "cleaning", "pet stains"],
    featured: true,
  },
];

export function amazon3ToData(p: AmazonProduct3): Prisma.MarketProductUncheckedCreateInput {
  return {
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory,
    price: p.price,
    currency: "XAF",
    imageUrl: p.imageUrl,
    imageAlt: p.imageAlt,
    gallery: [],
    shortDescription: p.shortDescription,
    description: p.description,
    whoFor: p.whoFor,
    whyRecommend: p.whyRecommend,
    features: p.features,
    pros: p.pros,
    cons: p.cons,
    tags: p.tags,
    related: [],
    guides: [],
    specs: [] as unknown as Prisma.InputJsonValue,
    faqs: p.faqs as unknown as Prisma.InputJsonValue,
    amazonAvailability: amazonEverywhereAvailability(p.affiliateUrl) as unknown as Prisma.InputJsonValue,
    featured: p.featured ?? false,
    trending: p.trending ?? false,
    published: true,
  };
}
