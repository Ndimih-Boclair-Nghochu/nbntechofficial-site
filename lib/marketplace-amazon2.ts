import type { Prisma } from "@prisma/client";
import { COUNTRIES } from "@/lib/marketplace";

/**
 * Second batch of real Amazon affiliate products (kitchen, home and car), added
 * to NBN MARKET with the owner's exact amzn.to tracking links. Every field —
 * title, image, feature copy — is based on the live Amazon product page.
 *
 * Prices are the real amounts Amazon displayed at listing time, captured in XAF
 * (CFA franc, the same currency as the Selar catalogue) so the storefront's live
 * currency conversion localizes them per visitor — the same conversion strategy
 * used across the whole store. Amazon prices change, so the "Buy on Amazon"
 * button always links to the live listing for the exact current price. A couple
 * of items are sold only via "buying options" (no single featured price) and
 * keep a null price. We never fabricate prices, ratings, reviews or stock.
 *
 * Availability: the amzn.to short links are OneLink-enabled, so a single link
 * routes each visitor to their local Amazon store and earns globally — marked
 * available across every supported country (platform "Amazon").
 */

type AmazonProduct2 = {
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  /** Real Amazon price in XAF, or null for buying-options-only items. */
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

export const AMAZON_PICKS_2: AmazonProduct2[] = [
  // ---------------------------------------------------------------- Air fryers
  {
    name: "Cosori TurboBlaze 6-Qt Air Fryer (9-in-1)",
    slug: "cosori-turboblaze-air-fryer-6qt",
    brand: "Cosori",
    category: "home-kitchen",
    subcategory: "air-fryers",
    price: 63472,
    imageUrl: "https://m.media-amazon.com/images/I/81R9sA3IyBL._AC_SL1500_.jpg",
    imageAlt: "Cosori TurboBlaze 6-quart 9-in-1 air fryer",
    affiliateUrl: "https://amzn.to/4gv4JXV",
    shortDescription:
      "A powerful 9-in-1 air fryer with TurboBlaze technology — 3,600 rpm airflow up to 450°F, a PFAS-free ceramic basket and whisper-quiet operation under 53 dB.",
    description:
      "Cosori's TurboBlaze cooks crispier and faster. A high-speed 3,600 rpm fan and five adjustable fan speeds push heat up to 450°F for evenly cooked, juicy results, while the 6-quart square basket is roomy enough for a family meal yet compact on the counter. The basket and crisper tray use a healthier PFAS-free ceramic nonstick coating, and it runs quietly at under 53 dB. Nine functions cover air fry, roast, bake, broil, dehydrate, proof, reheat, frozen and keep-warm.",
    features: [
      "TurboBlaze tech: 3,600 rpm fan, up to 450°F",
      "9-in-1: air fry, roast, bake, broil, dehydrate, proof, reheat, frozen, keep warm",
      "5 adjustable fan speeds for even cooking",
      "PFAS-free ceramic nonstick basket & tray",
      "6-quart square basket for family meals",
      "Quiet operation under 53 dB",
    ],
    pros: ["Fast, crispy results", "Healthier PFAS-free coating", "Quiet for its power"],
    cons: ["Larger countertop footprint", "Premium price"],
    whoFor: "Families who want fast, healthier fried favourites with lots of cooking modes.",
    whyRecommend: "It combines strong airflow, a safe ceramic coating and quiet operation in one versatile cooker.",
    faqs: [
      { q: "Is the coating non-toxic?", a: "Yes — the basket and tray use a PFAS-free ceramic nonstick coating." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["air fryer", "kitchen", "cosori", "cooking", "healthy"],
    featured: true,
    trending: true,
  },
  {
    name: "Amazon Basics 4.4-Qt Digital Air Fryer with Window",
    slug: "amazon-basics-digital-air-fryer-4-4qt",
    brand: "Amazon Basics",
    category: "home-kitchen",
    subcategory: "air-fryers",
    price: 34041,
    imageUrl: "https://m.media-amazon.com/images/I/71H1Sb6IamL._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics 4.4-quart digital air fryer with viewing window",
    affiliateUrl: "https://amzn.to/4xKmI2B",
    shortDescription:
      "A 4.4-quart digital air fryer with a viewing window, 8 preset menus, a shake reminder and a ceramic nonstick basket — ideal for 2–4 people.",
    description:
      "A dependable, affordable air fryer from Amazon Basics. The 4.4-quart basket suits 2–4 people, and a large digital touch panel gives you 8 preset menus, a keep-warm function and a smart shake reminder. A viewing window lets you check progress without opening the basket, 360° hot air circulation crisps food with little to no oil, and the ceramic nonstick parts are dishwasher-safe for easy cleaning.",
    features: [
      "4.4-quart basket for 2–4 people",
      "8 preset menus + keep-warm & shake reminder",
      "Viewing window to monitor cooking",
      "360° hot air circulation, little to no oil",
      "140°F–400°F adjustable temperature",
      "Ceramic nonstick, dishwasher-safe parts",
    ],
    pros: ["Trusted Amazon Basics value", "Handy viewing window", "Easy digital presets"],
    cons: ["Smaller capacity", "Basic feature set vs premium models"],
    whoFor: "Individuals and small families who want a simple, reliable air fryer.",
    whyRecommend: "It covers the essentials — presets, a window and easy cleanup — at a friendly price.",
    faqs: [
      { q: "How many people does it serve?", a: "The 4.4-quart basket is ideal for 2–4 people and everyday family meals." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["air fryer", "kitchen", "amazon basics", "cooking"],
  },
  {
    name: "Chefman 6-Qt Air Fryer with Hi-Fry Technology",
    slug: "chefman-air-fryer-6qt-hi-fry",
    brand: "Chefman",
    category: "home-kitchen",
    subcategory: "air-fryers",
    price: 40389,
    imageUrl: "https://m.media-amazon.com/images/I/71WCBoDBHsL._AC_SL1500_.jpg",
    imageAlt: "Chefman 6-quart compact air fryer with touchscreen controls in black",
    affiliateUrl: "https://amzn.to/4gfIYKB",
    shortDescription:
      "A compact 6-quart air fryer with Hi-Fry technology that boosts heat to 450°F for extra crunch — touchscreen controls, 4 presets and a dishwasher-safe basket.",
    description:
      "Chefman's slim 6-quart air fryer maximises capacity while saving counter space. Hi-Fry technology lets you push the heat to 450°F for the final two minutes for extra-crispy fries and tenders, while the digital touchscreen and four one-touch presets make quick meals effortless for 3–5 people. LED shake notifications remind you to toss food halfway, and the nonstick basket and rack are dishwasher-safe.",
    features: [
      "450°F Hi-Fry boost for extra crunch",
      "Touchscreen controls + 4 one-touch presets",
      "Slim 6-quart design saves counter space",
      "Serves 3–5 people with little to no oil",
      "LED shake notifications mid-cook",
      "Dishwasher-safe nonstick basket & rack",
    ],
    pros: ["Extra-crisp Hi-Fry mode", "Space-saving design", "Easy cleanup"],
    cons: ["Presets are limited to four", "Matte finish shows fingerprints"],
    whoFor: "Anyone who wants restaurant-crisp results from a slim, easy air fryer.",
    whyRecommend: "The 450°F Hi-Fry finish gives noticeably crispier food than standard air fryers.",
    faqs: [
      { q: "What is Hi-Fry technology?", a: "It raises the temperature to 450°F for the last two minutes of cooking for an extra-crispy finish." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["air fryer", "kitchen", "chefman", "cooking"],
    trending: true,
  },

  // ---------------------------------------------------------------- Kitchen scales
  {
    name: "Greater Goods Digital Kitchen Scale (22 lb)",
    slug: "greater-goods-digital-kitchen-scale-22lb",
    brand: "Greater Goods",
    category: "home-kitchen",
    subcategory: "kitchen-scales",
    price: 14421,
    imageUrl: "https://m.media-amazon.com/images/I/81aBZ+-a9yL._AC_SL1500_.jpg",
    imageAlt: "Greater Goods stainless steel digital kitchen scale with Hi-Def LCD",
    affiliateUrl: "https://amzn.to/4xEADqP",
    shortDescription:
      "A high-capacity 22 lb kitchen scale with 1 g precision, a stainless platform and a Hi-Def LCD that extends beyond the platform for easy reading under big bowls.",
    description:
      "Built for real cooking, this Greater Goods scale weighs up to 22 lb (10 kg) in 1 g increments — perfect for sourdough, baking, meal prep and bulk cooking. It measures in grams, ounces, lb:oz and millilitres, and the tare/zero function resets instantly for use with bowls and containers. The bright Hi-Def LCD sits forward of the platform so it stays visible under large mixing bowls, and it's backed by a 5-year warranty.",
    features: [
      "22 lb (10 kg) capacity, 1 g precision",
      "Weighs in g / oz / lb:oz / ml",
      "Tare/zero for bowls and containers",
      "Hi-Def LCD extends beyond the platform",
      "Stainless steel, easy to clean",
      "5-year warranty, 3 AAA batteries included",
    ],
    pros: ["High capacity + fine precision", "Readable under big bowls", "5-year warranty"],
    cons: ["Not for micro/lab measurements", "Battery, not rechargeable"],
    whoFor: "Home bakers and meal preppers who need an accurate, high-capacity scale.",
    whyRecommend: "The forward LCD and 22 lb capacity make it genuinely practical for serious baking.",
    faqs: [
      { q: "Can it weigh liquids?", a: "Yes — it measures in millilitres as well as grams, ounces and lb:oz." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["kitchen scale", "baking", "greater goods", "cooking"],
  },
  {
    name: "Digital Kitchen Food Scale (22 lb, Backlit LCD)",
    slug: "digital-kitchen-food-scale-22lb-backlit",
    brand: "NBN Pick",
    category: "home-kitchen",
    subcategory: "kitchen-scales",
    price: 14998,
    imageUrl: "https://m.media-amazon.com/images/I/61hEtbJv3YL._SL1500_.jpg",
    imageAlt: "Stainless steel and tempered glass digital food scale with backlit LCD",
    affiliateUrl: "https://amzn.to/4fWTXtj",
    shortDescription:
      "A 22 lb digital food scale with four high-precision sensors, 1 g / 0.1 oz accuracy, a large 9×6.3\" platform and an easy-clean stainless and glass finish.",
    description:
      "Four high-precision load sensors give this scale accurate 1 g / 0.1 oz readings across a 0.1 oz to 22 lb range. The generous 9 × 6.3\" platform and large backlit LCD make it easy to read in g, kg, lb:oz, fl oz and ml, and the tare button subtracts container weight for accurate measurements. Tempered glass and a stainless top resist fingerprints and wipe clean, and an attached hook makes storage simple.",
    features: [
      "4 high-precision sensors, 1 g / 0.1 oz",
      "Weighs in g / kg / lb:oz / fl oz / ml",
      "Large 9 × 6.3\" platform, backlit LCD",
      "Tare/zero for container subtraction",
      "Tempered glass + stainless, easy to clean",
      "Hanging hook for storage, 2 AAA included",
    ],
    pros: ["Big weighing surface", "Multiple units", "Easy to store and clean"],
    cons: ["Glass surface can smudge", "Battery powered"],
    whoFor: "Anyone who wants a large, accurate everyday food scale for cooking and baking.",
    whyRecommend: "A big platform, backlit display and precise sensors make daily weighing effortless.",
    faqs: [
      { q: "Does it have a tare function?", a: "Yes — the tare button subtracts a plate or container's weight so you only weigh the ingredients." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["kitchen scale", "baking", "cooking", "food scale"],
  },
  {
    name: "Digital Food Scale (11 lb, 0.5 g Precision)",
    slug: "digital-food-scale-11lb-0-5g",
    brand: "NBN Pick",
    category: "home-kitchen",
    subcategory: "kitchen-scales",
    price: 11536,
    imageUrl: "https://m.media-amazon.com/images/I/61aYHgF1c9L._SL1500_.jpg",
    imageAlt: "Compact digital food scale with green backlit LCD and stainless platform",
    affiliateUrl: "https://amzn.to/4qfhF7D",
    shortDescription:
      "A compact 11 lb food scale with fine 0.5 g / 0.1 oz precision, five units, a green backlit LCD and a simple four-button control panel.",
    description:
      "For precise portions in a small footprint, this scale reads to 0.5 g / 0.1 oz across an 11 lb range in five units (grams, ounces, pounds and millilitres). A green backlit LCD keeps readings clear, and the four-button panel — On/Off, Mode, Tare and Zero — makes switching units and zeroing containers simple. The slim stainless platform looks smart and saves space on any counter.",
    features: [
      "11 lb capacity, fine 0.5 g / 0.1 oz precision",
      "5 units: g / oz / lb / ml and more",
      "Green backlit LCD for clear reading",
      "4-button panel: On/Off, Mode, Tare, Zero",
      "Slim stainless platform, space-saving",
      "Great for portioning and baking",
    ],
    pros: ["Fine 0.5 g precision", "Compact", "Clear backlit screen"],
    cons: ["Lower 11 lb max capacity", "Battery powered"],
    whoFor: "Anyone who wants precise, compact weighing for baking and portion control.",
    whyRecommend: "Half-gram precision in a small, tidy scale is ideal for careful baking and diets.",
    faqs: [
      { q: "How precise is it?", a: "It reads in 0.5 g / 0.1 oz increments, finer than most everyday kitchen scales." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["kitchen scale", "baking", "portion control", "cooking"],
  },

  // ---------------------------------------------------------------- Blenders
  {
    name: "iCucina 700W Personal Smoothie Blender (2× 28oz Cups)",
    slug: "icucina-700w-personal-blender",
    brand: "iCucina",
    category: "home-kitchen",
    subcategory: "blenders",
    price: 26539,
    imageUrl: "https://m.media-amazon.com/images/I/71CVoyungKL._AC_SL1500_.jpg",
    imageAlt: "iCucina 700W personal smoothie blender with two portable cups",
    affiliateUrl: "https://amzn.to/4zgc30R",
    shortDescription:
      "A 700W personal blender with one-touch pulse control and two 28 oz portable cups — crushes ice and frozen fruit for smoothies and shakes on the go.",
    description:
      "This compact iCucina blender makes healthy drinks effortless. A 700W motor and sharp stainless blades crush ice and frozen fruit into smooth smoothies, protein shakes and green juices, while the one-touch pulse button gives you full control of the texture. Two 28 oz portable cups with lids let you blend and take your drink straight to the gym or office — no extra dishes.",
    features: [
      "700W motor with sharp stainless blades",
      "One-touch pulse control for texture",
      "Crushes ice and frozen fruit",
      "2 × 28 oz portable cups with lids",
      "Blend-and-go, minimal cleanup",
      "Compact, lightweight Italian-inspired design",
    ],
    pros: ["Blend-and-go cups", "Good ice crushing", "Compact and affordable"],
    cons: ["Personal-size, not for big batches", "Pulse-only control"],
    whoFor: "Gym-goers and busy people who want quick single-serve smoothies and shakes.",
    whyRecommend: "Two travel cups and solid power make daily smoothies fast and mess-free.",
    faqs: [
      { q: "Can it crush ice?", a: "Yes — the 700W motor and stainless blades crush ice and frozen fruit for smooth drinks." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["blender", "smoothie", "icucina", "kitchen", "fitness"],
    trending: true,
  },
  {
    name: "iCucina 1000W Personal Blender (13-in-1, 2× 32oz Cups)",
    slug: "icucina-1000w-personal-blender-13-in-1",
    brand: "iCucina",
    category: "home-kitchen",
    subcategory: "blenders",
    price: 46160,
    imageUrl: "https://m.media-amazon.com/images/I/71pTAj-1VQL._AC_SL1500_.jpg",
    imageAlt: "iCucina 1000W personal blender with two 32oz portable cups, black",
    affiliateUrl: "https://amzn.to/4ziGfZn",
    shortDescription:
      "A stronger 1000W personal blender spinning at 25,000 rpm — a 13-in-1 set with two BPA-free 32 oz to-go cups for smoothies, shakes and even bean grinding.",
    description:
      "The step-up iCucina blender pairs a 1000W motor with 25,000 rpm speed for effortless ice crushing and silky smoothies. It's a complete 13-in-1 set: a power base, two shatter-resistant BPA-free 32 oz to-go cups, blade, lids, straws, a straw brush and a spatula — everything you need to blend, sip and clean. All parts are dishwasher-safe, so cleanup is quick.",
    features: [
      "1000W motor, 25,000 rpm high-speed blending",
      "Crushes ice, blends frozen fruit, grinds beans",
      "13-in-1 set with 2 × 32 oz to-go cups",
      "BPA-free Tritan, shatter-resistant cups",
      "Dishwasher-safe parts + cleaning brush",
      "Compact base, twist-on-and-blend simplicity",
    ],
    pros: ["Powerful 1000W motor", "Complete 13-piece set", "Dishwasher-safe"],
    cons: ["Still single-serve sized", "Pricier than the 700W model"],
    whoFor: "Anyone who wants stronger blending power and a full accessory set for daily drinks.",
    whyRecommend: "More power and a complete to-go kit make it a versatile everyday blender.",
    faqs: [
      { q: "What's included?", a: "A power base, 2 travel cups, blade, lids, a sealed lid, 4 straws, a straw brush and a spatula — 13 pieces in all." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["blender", "smoothie", "icucina", "kitchen", "fitness"],
    featured: true,
  },
  {
    name: "Ninja Professional Blender (1000W, 72 oz, BL610)",
    slug: "ninja-professional-blender-bl610",
    brand: "Ninja",
    category: "home-kitchen",
    subcategory: "blenders",
    price: null,
    imageUrl: "https://m.media-amazon.com/images/I/614pybV29dL._AC_SL1500_.jpg",
    imageAlt: "Ninja Professional 1000W countertop blender with 72oz pitcher",
    affiliateUrl: "https://amzn.to/4i5WYZE",
    shortDescription:
      "Ninja's classic countertop blender — 1000W of Total Crushing power and an XL 72 oz pitcher for family-size smoothies, frozen drinks and sauces.",
    description:
      "A proven full-size blender for the whole family. 1000 watts of professional power with Ninja's Total Crushing blades pulverise ice, whole fruit and vegetables in seconds, turning ice into snow for resort-style frozen drinks. The XL 72 oz pitcher (64 oz max liquid) handles big batches, and the BPA-free pitcher and parts are dishwasher-safe. An included recipe guide helps you get started.",
    features: [
      "1000W of professional blending power",
      "Total Crushing blades pulverise ice & produce",
      "XL 72 oz pitcher (64 oz max liquid)",
      "Great for family smoothies, frozen drinks, sauces",
      "BPA-free, dishwasher-safe pitcher",
      "Includes a recipe inspiration guide",
    ],
    pros: ["Trusted Ninja power", "Large family pitcher", "Excellent ice crushing"],
    cons: ["Countertop size, not portable", "Loud at full power"],
    whoFor: "Families who want a powerful full-size blender for big batches.",
    whyRecommend: "It's the reliable, well-known workhorse for family-size blending.",
    faqs: [
      { q: "How big is the pitcher?", a: "The XL pitcher holds 72 oz total, with a 64 oz maximum liquid capacity — great for family batches." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["blender", "ninja", "kitchen", "smoothie", "family"],
    featured: true,
  },

  // ---------------------------------------------------------------- Water bottles
  {
    name: "HYDROWION 32 oz Insulated Stainless Steel Water Bottle",
    slug: "hydrowion-32oz-insulated-water-bottle",
    brand: "HYDROWION",
    category: "travel-lifestyle",
    subcategory: "water-bottles",
    price: 18460,
    imageUrl: "https://m.media-amazon.com/images/I/71PHbhU5YeL._AC_SL1500_.jpg",
    imageAlt: "HYDROWION 32oz cobalt insulated stainless steel water bottle with 3 lids",
    affiliateUrl: "https://amzn.to/4xDe85t",
    shortDescription:
      "A 32 oz double-wall insulated bottle that keeps drinks cold for 48 hours or hot for 24 — with three interchangeable lids and a slim shape that fits any cup holder.",
    description:
      "HYDROWION's slim T-shape 32 oz bottle fits any standard cup holder while holding a full day's water. Double-wall vacuum insulation keeps drinks icy for up to 48 hours or hot for up to 24, and the food-grade 18/8 stainless steel is BPA-free and won't leave a metallic taste. It comes with three BPA-free lids — a straw lid, a spout lid and a flex cap — plus straws and cleaning brushes, so you're set for driving, the gym or hiking.",
    features: [
      "Cold up to 48H / hot up to 24H insulation",
      "32 oz capacity, fits standard cup holders",
      "Food-grade 18/8 stainless, BPA-free",
      "3 interchangeable lids: straw, spout, flex cap",
      "Leak-proof seal; wide mouth for ice",
      "Includes 2 straws + 2 cleaning brushes",
    ],
    pros: ["Excellent 48H cold retention", "Three lids included", "Cup-holder friendly"],
    cons: ["Large for smaller bags", "Hand-wash recommended"],
    whoFor: "Anyone who wants all-day cold water on the go with flexible drinking options.",
    whyRecommend: "48-hour cold retention plus three lids make it one of the most versatile bottles here.",
    faqs: [
      { q: "Will it fit my car cup holder?", a: "Yes — the slim T-shape is designed to fit any standard cup holder." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["water bottle", "insulated", "hydration", "travel", "hydrowion"],
    trending: true,
  },
  {
    name: "Owala FreeSip 24 oz Insulated Water Bottle",
    slug: "owala-freesip-24oz-water-bottle",
    brand: "Owala",
    category: "travel-lifestyle",
    subcategory: "water-bottles",
    price: 17306,
    imageUrl: "https://m.media-amazon.com/images/I/718RbhzhVbL._AC_SL1500_.jpg",
    imageAlt: "Owala FreeSip 24oz insulated stainless steel water bottle, dark",
    affiliateUrl: "https://amzn.to/4c7WY7Z",
    shortDescription:
      "The hugely popular Owala FreeSip — a 24 oz insulated bottle with a patented spout you can sip or swig from, a locking push-button lid and 24-hour cold retention.",
    description:
      "Owala's FreeSip is a cult favourite for a reason. Its patented spout lets you sip upright through the built-in straw or tilt back to swig, and the push-to-open lid keeps the spout clean while the carry loop doubles as a lock. Double-wall insulation keeps drinks cold for up to 24 hours, and the wide opening makes it easy to add ice and clean.",
    features: [
      "Patented FreeSip spout — sip or swig",
      "24 oz double-wall insulation, cold up to 24H",
      "Push-button lid with lock",
      "Carry loop doubles as a lock",
      "Wide opening for ice and easy cleaning",
      "Durable stainless steel build",
    ],
    pros: ["Clever two-way spout", "Very popular, proven design", "Locking lid"],
    cons: ["Wider than some cup holders", "24 oz is mid-size"],
    whoFor: "Anyone who wants a stylish, practical bottle with a versatile spout.",
    whyRecommend: "The FreeSip spout and locking lid make it one of the most loved everyday bottles.",
    faqs: [
      { q: "Does it fit cup holders?", a: "It's wider than standard cup holders and may only fit oversized or specialty holders." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["water bottle", "insulated", "owala", "hydration", "travel"],
    featured: true,
  },
  {
    name: "Bambaw 24 oz Insulated Stainless Steel Water Bottle",
    slug: "bambaw-24oz-insulated-water-bottle",
    brand: "Bambaw",
    category: "travel-lifestyle",
    subcategory: "water-bottles",
    price: 10364,
    imageUrl: "https://m.media-amazon.com/images/I/81znidnMhSL._AC_SL1500_.jpg",
    imageAlt: "Bambaw 24oz natural steel insulated water bottle with wide mouth",
    affiliateUrl: "https://amzn.to/4wwiU3Z",
    shortDescription:
      "A minimalist unpainted 18/8 steel bottle — hot for 12 hours, cold for 24 — with a wide mouth for ice, tea infusing and easy cleaning.",
    description:
      "Bambaw's 24 oz bottle keeps things simple and durable. The unpainted 18/8 stainless steel resists scratches and is built to last, making it a genuine eco-friendly alternative to plastic. Vacuum insulation holds drinks hot for up to 12 hours and cold for 24, while the wide mouth makes it easy to add ice cubes or a tea infuser and to clean thoroughly.",
    features: [
      "18/8 stainless steel, unpainted & scratch-resistant",
      "Hot up to 12H / cold up to 24H",
      "Wide mouth for ice and tea infusing",
      "Eco-friendly, plastic-free design",
      "Durable and rust-resistant",
      "Easy to clean and inspect inside",
    ],
    pros: ["Great value", "Durable minimalist look", "Wide mouth for cleaning"],
    cons: ["Shorter hot retention (12H)", "No straw lid"],
    whoFor: "Anyone who wants an affordable, durable, no-frills reusable bottle.",
    whyRecommend: "A tough, plastic-free bottle at a very approachable price.",
    faqs: [
      { q: "Can I put a tea infuser in it?", a: "Yes — the wide mouth fits ice cubes and a tea infuser easily." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["water bottle", "insulated", "bambaw", "eco-friendly", "travel"],
  },

  // ---------------------------------------------------------------- Thermometers
  {
    name: "ThermoMaven 1-Sec Digital Meat Thermometer",
    slug: "thermomaven-1sec-meat-thermometer",
    brand: "ThermoMaven",
    category: "home-kitchen",
    subcategory: "thermometers",
    price: 10381,
    imageUrl: "https://m.media-amazon.com/images/I/71TnbDVEJkL._AC_SL1500_.jpg",
    imageAlt: "ThermoMaven 1-second digital meat thermometer with LED screen, orange",
    affiliateUrl: "https://amzn.to/4wCiitG",
    shortDescription:
      "A NIST-certified instant-read meat thermometer with ±0.5°F accuracy, 1-second readings, a bright auto-rotating LED screen and full waterproofing.",
    description:
      "Cook meat perfectly every time with this professional ThermoMaven thermometer. A top-tier thermocouple sensor delivers accurate readings in just one second, with NIST-certified ±0.5°F accuracy for safe, precise results on BBQ, roasts, candy and everyday meals. The bright, auto-rotating LED screen reads easily in any light and for either hand, motion sensing wakes and sleeps it automatically, and the fully waterproof body rinses clean.",
    features: [
      "NIST-certified ±0.5°F accuracy",
      "Truly instant 1-second readings",
      "Bright auto-rotating LED display",
      "Motion-activated wake/sleep",
      "Fully waterproof — rinse to clean",
      "Great for BBQ, roasts, candy and frying",
    ],
    pros: ["Very fast & accurate", "Easy-read bright screen", "Waterproof"],
    cons: ["Premium vs basic probes", "Single-probe (no leave-in)"],
    whoFor: "Home cooks and grillers who want fast, certified-accurate temperatures.",
    whyRecommend: "NIST-certified accuracy and 1-second reads put it a class above cheap thermometers.",
    faqs: [
      { q: "Is it accurate enough for candy?", a: "Yes — ±0.5°F NIST-certified accuracy suits candy, frying, BBQ and everyday cooking." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["meat thermometer", "kitchen", "bbq", "thermomaven", "cooking"],
    featured: true,
  },
  {
    name: "Alpha Grillers Instant-Read Meat Thermometer",
    slug: "alpha-grillers-instant-read-thermometer",
    brand: "Alpha Grillers",
    category: "home-kitchen",
    subcategory: "thermometers",
    price: 8062,
    imageUrl: "https://m.media-amazon.com/images/I/81bpKKv68-L._AC_SL1500_.jpg",
    imageAlt: "Alpha Grillers digital instant-read meat thermometer with backlit display",
    affiliateUrl: "https://amzn.to/4zhRq4y",
    shortDescription:
      "A best-selling instant-read thermometer with 1–2 second response, a bright backlit display and IP67 waterproofing — pre-calibrated and ready to use.",
    description:
      "A dependable grilling essential. Alpha Grillers' thermometer reads temperatures in 1–2 seconds with a temperature probe and accurate sensor, and it arrives pre-calibrated (with recalibration if you ever need it). A large backlit dial stays readable whether you're grilling after dark or baking indoors, and the IP67 waterproof rating means you can rinse it clean. It ships in a gift-ready box with a meat temperature chart.",
    features: [
      "Fast 1–2 second response time",
      "Pre-calibrated, with recalibration option",
      "Bright blue backlit display",
      "IP67 waterproof — washable",
      "Includes meat temperature chart",
      "For meats, liquids, deep frying and candy",
    ],
    pros: ["Great value", "Backlit and waterproof", "Gift-ready packaging"],
    cons: ["Slightly slower than 1-sec models", "No app connectivity"],
    whoFor: "Grillers and home cooks who want a reliable, affordable instant-read thermometer.",
    whyRecommend: "A hugely popular, waterproof thermometer that just works — at a great price.",
    faqs: [
      { q: "Do I need to calibrate it?", a: "No — it comes pre-calibrated and ready to use, with a recalibration option if ever needed." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["meat thermometer", "kitchen", "bbq", "alpha grillers", "cooking"],
    trending: true,
  },
  {
    name: "ThermoMaven 0.5-Sec Pro Meat Thermometer",
    slug: "thermomaven-05sec-pro-thermometer",
    brand: "ThermoMaven",
    category: "home-kitchen",
    subcategory: "thermometers",
    price: 17301,
    imageUrl: "https://m.media-amazon.com/images/I/81+fzorzDpL._SL1500_.jpg",
    imageAlt: "ThermoMaven 0.5-second pro meat thermometer, red and gray",
    affiliateUrl: "https://amzn.to/4x0SGYr",
    shortDescription:
      "ThermoMaven's fastest probe — 0.5-second readings, NIST-certified ±0.5°F accuracy, IP67 waterproofing, hook-and-magnet storage and a built-in bottle opener.",
    description:
      "The pro-level ThermoMaven uses an upgraded, more sensitive probe with enhanced thermal conductivity for even faster, more stable readings — accurate in just 0.5 seconds. It's NIST-certified to ±0.5°F, IP67 waterproof for easy cleaning, and thoughtfully designed with an auto-rotating backlight, lift-to-wake, a hook and magnet for storage, and a handy built-in bottle opener for cookouts.",
    features: [
      "Upgraded probe: 0.5-second readings",
      "NIST-certified ±0.5°F accuracy",
      "IP67 waterproof performance",
      "Auto-rotating backlit display, lift-to-wake",
      "Hook + magnet storage options",
      "Built-in bottle opener for BBQs",
    ],
    pros: ["Fastest readings here", "Certified accuracy", "Clever storage + opener"],
    cons: ["Priciest thermometer of the set", "Single-probe design"],
    whoFor: "Serious grillers who want the fastest, most accurate instant-read probe.",
    whyRecommend: "0.5-second speed plus certified accuracy make it the top pick for BBQ enthusiasts.",
    faqs: [
      { q: "How fast are the readings?", a: "The upgraded probe delivers accurate readings in about 0.5 seconds." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["meat thermometer", "kitchen", "bbq", "thermomaven", "grilling"],
    featured: true,
  },

  // ---------------------------------------------------------------- Kitchen tools
  {
    name: "YARRAMATE 16 oz 2-in-1 Glass Olive Oil Sprayer",
    slug: "yarramate-glass-olive-oil-sprayer-16oz",
    brand: "YARRAMATE",
    category: "home-kitchen",
    subcategory: "kitchen-tools",
    price: 4472,
    imageUrl: "https://m.media-amazon.com/images/I/71ZjnwrH7iL._AC_SL1500_.jpg",
    imageAlt: "YARRAMATE 16oz 2-in-1 glass olive oil sprayer, black",
    affiliateUrl: "https://amzn.to/4fVu797",
    shortDescription:
      "A 2-in-1 glass oil bottle that both sprays and pours — 470 ml, food-grade and BPA-free, with precise portion control for salads, frying and BBQ.",
    description:
      "One bottle for both spraying and pouring oil. YARRAMATE's 16 oz (470 ml) dispenser lets you mist a fine, even layer for air frying, grilling and salads, or switch to pouring for cooking — all from food-grade, BPA-free materials and unbreakable glass you can see the oil level through. Each spray releases about 0.2 g of oil, so you control exactly how much you use, and the front-nozzle design keeps your hands clean.",
    features: [
      "2-in-1: spray or pour from one bottle",
      "470 ml (16 oz) refillable capacity",
      "Food-grade, BPA-free, unbreakable glass",
      "~0.2 g per spray for portion control",
      "Wide mouth for easy, spill-free refills",
      "Front-nozzle design keeps hands clean",
    ],
    pros: ["Spray and pour in one", "Great for oil control", "Very affordable"],
    cons: ["Manual pump (not pressurised)", "Needs occasional cleaning"],
    whoFor: "Air-fryer users and health-conscious cooks who want to control oil use.",
    whyRecommend: "A cheap, clever tool that cuts oil use and works for both misting and pouring.",
    faqs: [
      { q: "Can I use it for vinegar or other liquids?", a: "It's designed for cooking oils; check the listing for other liquids before use." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["oil sprayer", "kitchen", "air fryer", "cooking", "yarramate"],
  },
  {
    name: "Glass Olive Oil Sprayer with Anti-Clog Filter",
    slug: "glass-olive-oil-sprayer-anti-clog",
    brand: "NBN Pick",
    category: "home-kitchen",
    subcategory: "kitchen-tools",
    price: 9804,
    imageUrl: "https://m.media-amazon.com/images/I/71X3XMLjIYL._AC_SL1500_.jpg",
    imageAlt: "Glass olive oil mister spray bottle with wide fan mist and anti-clog filter",
    affiliateUrl: "https://amzn.to/45VXfqS",
    shortDescription:
      "A premium glass oil mister with a patented wide fan spray, ~1 g portion control, a built-in anti-clog filter and an anti-drip design for mess-free cooking.",
    description:
      "This upgraded oil sprayer solves the usual annoyances. A patented nozzle produces a wide, even fan mist that coats air-fryer baskets, pans, grills, veg and salads with a light, uniform layer for crispier results. Each full press dispenses about 1 g of oil for easy portion control, a built-in fine mesh filter stops clogging and sputtering, and an anti-drip collection port plus external spring keep the bottle clean and long-lasting. The 200 ml BPA-free glass body lets you see the oil at a glance.",
    features: [
      "Patented wide fan-shaped mist for even coating",
      "~1 g per press for portion control",
      "Built-in fine mesh anti-clog filter",
      "Anti-drip port + external spring (no corrosion)",
      "200 ml BPA-free glass, wide opening",
      "Great for air fryer, grilling, baking, salads",
    ],
    pros: ["Even fan mist", "Anti-clog and anti-drip", "See-through glass"],
    cons: ["Smaller 200 ml capacity", "Pump priming needed"],
    whoFor: "Anyone frustrated by clogging oil sprayers who wants an even, reliable mist.",
    whyRecommend: "The anti-clog filter and fan mist fix the two biggest oil-sprayer complaints.",
    faqs: [
      { q: "Will it clog like cheaper sprayers?", a: "It has a built-in fine mesh filter and external spring specifically designed to resist clogging." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["oil sprayer", "kitchen", "air fryer", "cooking", "mister"],
  },

  // ---------------------------------------------------------------- Storage & organization
  {
    name: "BOROHOUSE 10-Pack Glass Food Storage Containers",
    slug: "borohouse-glass-food-storage-10-pack",
    brand: "BOROHOUSE",
    category: "home-kitchen",
    subcategory: "food-storage",
    price: 32310,
    imageUrl: "https://m.media-amazon.com/images/I/71umtWE-9mL._AC_SL1500_.jpg",
    imageAlt: "10-pack borosilicate glass food storage containers with tempered glass lids, gray",
    affiliateUrl: "https://amzn.to/4bQJHjP",
    shortDescription:
      "A 10-piece borosilicate glass storage set (5 large + 5 small) with airtight tempered-glass lids — oven-safe from -4°F to 950°F, leak-proof and dishwasher-safe.",
    description:
      "A complete meal-prep set built to last. Five large (35.2 oz) and five small (12.5 oz) borosilicate glass containers go from freezer to oven, withstanding -4°F to 950°F, so you can store, reheat and even bake in the same dish. Snap-on tempered-glass lids with an air-release valve keep food fresh and leak-proof yet easy to open, and the stackable, clear design saves space while letting you see what's inside. It arrives in a gift-ready box.",
    features: [
      "10 pieces: 5 large (35.2 oz) + 5 small (12.5 oz)",
      "Borosilicate glass, oven-safe -4°F to 950°F",
      "Airtight tempered-glass lids with air valve",
      "Leak-proof yet easy to open",
      "Microwave, freezer & dishwasher safe",
      "Stackable, clear, gift-ready packaging",
    ],
    pros: ["Freezer-to-oven versatile", "Leak-proof glass lids", "Great gift set"],
    cons: ["Heavier than plastic", "Hand-wash lids recommended"],
    whoFor: "Meal preppers and families who want durable, healthy glass storage.",
    whyRecommend: "Oven-safe glass with leak-proof lids makes it a genuine upgrade over plastic tubs.",
    faqs: [
      { q: "Can the containers go in the oven?", a: "Yes — the borosilicate glass is oven-safe; remove the lids first (lids are not for high oven heat)." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["food storage", "glass containers", "kitchen", "meal prep", "borohouse"],
    featured: true,
  },
  {
    name: "ClearSpace Clear Plastic Storage Bins",
    slug: "clearspace-clear-plastic-storage-bins",
    brand: "ClearSpace",
    category: "home-kitchen",
    subcategory: "organization",
    price: 23077,
    imageUrl: "https://m.media-amazon.com/images/I/71b5YosDyVL._AC_SL1500_.jpg",
    imageAlt: "ClearSpace clear plastic pantry and fridge storage bins with handles",
    affiliateUrl: "https://amzn.to/4xzlqqP",
    shortDescription:
      "Durable, shatter-resistant clear bins with easy-grip handles for pantry, fridge, cabinet and closet organisation — food-safe and stackable.",
    description:
      "Bring instant order to any space. These large-capacity clear bins are perfect for a tidy fridge or pantry, and work just as well in the office, closet, laundry room or garage. Built-in easy-grip side handles make them simple to carry, they stack neatly to save space, and the clear, BPA- and chlorine-free plastic is food-safe and wipes clean. Each bin measures 11 × 8 × 6 inches.",
    features: [
      "Large-capacity, deep clear bins (11 × 8 × 6\")",
      "Easy-grip side handles for carrying",
      "Stackable to save shelf space",
      "Food-safe, BPA- & chlorine-free plastic",
      "Shatter-resistant and easy to clean",
      "Versatile: pantry, fridge, closet, office, garage",
    ],
    pros: ["Multipurpose organisation", "Sturdy with handles", "See-through and stackable"],
    cons: ["Single-bin size", "Plastic, not glass"],
    whoFor: "Anyone organising a pantry, fridge or cabinets on a budget.",
    whyRecommend: "Simple, sturdy, see-through bins that instantly tidy almost any space.",
    faqs: [
      { q: "Are they food-safe?", a: "Yes — they're made from BPA- and chlorine-free, food-safe plastic and clean easily with mild soap." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["storage bins", "organization", "pantry", "kitchen", "clearspace"],
  },
  {
    name: "Under-Sink Organizer, 2-Tier Pull-Out (2-Pack)",
    slug: "under-sink-organizer-2-tier-2-pack",
    brand: "NBN Pick",
    category: "home-kitchen",
    subcategory: "organization",
    price: 26539,
    imageUrl: "https://m.media-amazon.com/images/I/71n843vWYgL._AC_SL1500_.jpg",
    imageAlt: "White 2-tier pull-out under-sink organizer drawers, 2-pack",
    affiliateUrl: "https://amzn.to/3SbEn3P",
    shortDescription:
      "A height-adjustable 2-tier under-sink organiser with pull-out drawers that slide around pipes — sturdy steel, 5 height settings and a handy 2-pack.",
    description:
      "Turn a cluttered under-sink cabinet into clean, usable storage. The L-shaped design fits around your plumbing, and two independent pull-out drawers glide on quiet rails so you can reach items at the back without crouching or digging. Five height settings (14–17\") adapt to different cabinets, thickened steel keeps it sturdy, and suction cups plus nano tape hold it steady. Extra hardware and drawer liners are included — no drilling needed.",
    features: [
      "2-tier pull-out drawers on smooth rails",
      "L-shape fits around under-sink pipes",
      "5 height settings, 14\"–17\"",
      "Sturdy thickened-steel build",
      "Suction cups + nano tape, no drilling",
      "Comes as a 2-pack with drawer liners",
    ],
    pros: ["Works around plumbing", "Adjustable height", "Two units included"],
    cons: ["Some assembly required", "Fit depends on cabinet size"],
    whoFor: "Anyone wanting to reclaim messy under-sink space in the kitchen or bathroom.",
    whyRecommend: "The pull-out drawers and pipe-friendly shape make awkward under-sink space usable.",
    faqs: [
      { q: "Does it require drilling?", a: "No — it's held by suction cups and nano tape, and includes extra hardware for assembly." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["under sink organizer", "organization", "kitchen", "bathroom", "storage"],
    trending: true,
  },

  // ---------------------------------------------------------------- Car phone mounts
  {
    name: "ANDERY MagSafe Car Phone Holder (78 lb Suction)",
    slug: "andery-magsafe-car-phone-holder",
    brand: "ANDERY",
    category: "car-accessories",
    subcategory: "phone-mounts",
    price: 14761,
    imageUrl: "https://m.media-amazon.com/images/I/71I64kA4p2L._AC_SL1500_.jpg",
    imageAlt: "ANDERY MagSafe carbon-fiber car phone holder with strong suction",
    affiliateUrl: "https://amzn.to/4i8gS6l",
    shortDescription:
      "A strong MagSafe car mount with 22 N55 magnets (2,400 gf hold) and a 78 lb vacuum suction base — 360° adjustable with a cooling vent design.",
    description:
      "A premium MagSafe mount that holds your phone rock-solid. Twenty-two high-performance N55 magnets deliver up to 2,400 gf of magnetic force, while a 4-layer nano-gel suction cup grips with up to 78 lb of hold through bumps and sudden stops. A 360° rotating base with dual-axis arms switches easily between portrait and landscape, and a circular vent design improves airflow to keep your phone cool during GPS or calls. A magnetic ring is included for non-MagSafe phones.",
    features: [
      "MagSafe: 22 N55 magnets, up to 2,400 gf hold",
      "Rotating-lock vacuum suction up to 78 lb",
      "360° rotation + dual-axis adjustment",
      "Folds 50% smaller when not in use",
      "Circular cooling vent design",
      "Magnetic ring included for non-MagSafe phones",
    ],
    pros: ["Very strong magnetic + suction hold", "Cooling design", "Works with any phone"],
    cons: ["Best hold on flat surfaces", "Premium price for a mount"],
    whoFor: "iPhone MagSafe users who want the strongest, most stable dashboard mount.",
    whyRecommend: "Its dual strong-magnet and heavy-suction design keeps phones put on rough roads.",
    faqs: [
      { q: "Does it work with non-MagSafe phones?", a: "Yes — it includes a stick-on magnetic ring so any phone gets the same strong magnetic hold." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["car phone holder", "magsafe", "car accessories", "andery", "phone mount"],
    featured: true,
  },
  {
    name: "VICSEED Ultimate Sturdy Car Phone Holder",
    slug: "vicseed-ultimate-car-phone-holder",
    brand: "VICSEED",
    category: "car-accessories",
    subcategory: "phone-mounts",
    price: 13925,
    imageUrl: "https://m.media-amazon.com/images/I/81IetKV1NTL._AC_SL1500_.jpg",
    imageAlt: "VICSEED long-arm car phone holder for dashboard, windshield and vent",
    affiliateUrl: "https://amzn.to/3RPaFBP",
    shortDescription:
      "A heavy-duty universal car mount with a 95 lb military-grade suction cup, long adjustable arm and carbon-fiber build — fits dashboard, windshield or vent.",
    description:
      "VICSEED's clamp-style mount is built for durability and grip. A military-grade suction cup holds up to 95 lb on dashboard or windshield without leaving residue, and it resists heat from -40°F to 194°F. Aerospace-grade PTFE and carbon fiber make it far tougher than plastic mounts, the extra-wide arms fit phones from 4\" to 7\" (even with thick cases), and a 360° head with a 270° telescopic arm gives you the perfect angle. One-second quick-release makes it easy to grab and go.",
    features: [
      "95+ lb military-grade suction, no residue",
      "Fits dashboard, windshield, vent, truck & boat",
      "Carbon-fiber + PTFE build, 10× tougher",
      "Holds 4\"–7\" phones with thick cases",
      "360° head + 270° telescopic long arm",
      "One-second quick release",
    ],
    pros: ["Extremely strong hold", "Very durable build", "Fits big phones + cases"],
    cons: ["Bulkier long-arm design", "Suction needs a clean surface"],
    whoFor: "Drivers who want a rugged, universal mount that won't sag or drop their phone.",
    whyRecommend: "Its 95 lb suction and tough build make it one of the most secure universal mounts.",
    faqs: [
      { q: "Will it fit my big phone?", a: "Yes — the wide arms fit 4\"–7\" phones including large models with thick cases." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["car phone holder", "car accessories", "vicseed", "phone mount", "universal"],
    trending: true,
  },
  {
    name: "miracase Air Vent Car Phone Holder (Metal Hook)",
    slug: "miracase-air-vent-car-phone-holder",
    brand: "miracase",
    category: "car-accessories",
    subcategory: "phone-mounts",
    price: 7490,
    imageUrl: "https://m.media-amazon.com/images/I/81ERIxogALL._AC_SL1500_.jpg",
    imageAlt: "miracase air vent car phone holder with metal hook clip, black",
    affiliateUrl: "https://amzn.to/4i1Y5cU",
    shortDescription:
      "An affordable air-vent phone mount with a sturdy metal hook clip, one-hand operation and 360° rotation — a simple, secure everyday holder.",
    description:
      "A no-fuss vent mount that stays put. A steel metal hook (with silicone padding) grips a vent blade for solid stability, even in rough conditions, and it fits phones from 4.0\" to 7.2\" including thicker cases. A quick-release button and adjustable arms let you insert or remove your phone with one hand, and 360° rotation gives you any viewing angle for navigation, calls or music. Note: it fits horizontal and vertical vents, not round ones.",
    features: [
      "Sturdy steel metal hook grips vent blades",
      "Fits 4.0\"–7.2\" phones with thicker cases",
      "One-hand quick-release operation",
      "360° rotation for any viewing angle",
      "Silicone padding protects your vent",
      "Simple, secure and very affordable",
    ],
    pros: ["Great low price", "Secure metal hook", "Easy one-hand use"],
    cons: ["Not for round vents", "Vent-only (no dash/windshield)"],
    whoFor: "Anyone who wants a cheap, reliable air-vent phone mount.",
    whyRecommend: "A metal-hook vent mount that's more secure than plastic clips, at a bargain price.",
    faqs: [
      { q: "Does it fit round air vents?", a: "No — it's compatible with horizontal and vertical vents, not round ones." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["car phone holder", "car accessories", "miracase", "phone mount", "vent"],
  },

  // ---------------------------------------------------------------- Car vacuums
  {
    name: "4-in-1 Cordless Car Vacuum (20,000 Pa)",
    slug: "4-in-1-cordless-car-vacuum-20000pa",
    brand: "NBN Pick",
    category: "car-accessories",
    subcategory: "car-vacuums",
    price: 23077,
    imageUrl: "https://m.media-amazon.com/images/I/61N3n6drhbL._AC_SL1500_.jpg",
    imageAlt: "4-in-1 cordless handheld car vacuum with 20000pa suction, silver gray",
    affiliateUrl: "https://amzn.to/4gbIAwE",
    shortDescription:
      "A 4-in-1 cordless handheld vacuum with strong 20,000 Pa suction — vacuum, blow, inflate and extract — plus a 6,000 mAh battery and reusable filters.",
    description:
      "One compact tool for car and home cleaning. This 4-in-1 handheld does far more than an ordinary vacuum: powerful 20,000 Pa suction, plus blowing, inflating and extracting functions. A 6,000 mAh battery keeps it running and recharges over USB-C in about 3–5 hours, and at just 0.455 kg it's light and easy to manoeuvre in tight spaces. It comes with multiple nozzles and a built-in, removable reusable filter that protects the motor.",
    features: [
      "4-in-1: vacuum, blow, inflate, extract",
      "Strong 20,000 Pa suction",
      "6,000 mAh battery, USB-C recharge",
      "Lightweight 0.455 kg, cordless",
      "Multiple nozzles for every surface",
      "Removable, reusable filter",
    ],
    pros: ["Versatile 4-in-1", "Strong suction", "Light and cordless"],
    cons: ["Small dust cup", "Runtime limited per charge"],
    whoFor: "Drivers who want one handy tool to clean and inflate around the car and home.",
    whyRecommend: "Strong suction plus blow/inflate functions make it far more than a car vacuum.",
    faqs: [
      { q: "Can it inflate things?", a: "Yes — it has an inflate function for tyres and toys, alongside vacuum, blow and extract modes." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["car vacuum", "cordless", "car accessories", "cleaning", "handheld"],
    trending: true,
  },
  {
    name: "Black+Decker Dustbuster AdvancedClean Handheld Vacuum",
    slug: "black-decker-dustbuster-advancedclean",
    brand: "Black+Decker",
    category: "car-accessories",
    subcategory: "car-vacuums",
    price: null,
    imageUrl: "https://m.media-amazon.com/images/I/611QYSatPfL._AC_SL1500_.jpg",
    imageAlt: "Black+Decker Dustbuster AdvancedClean cordless handheld vacuum with charging base",
    affiliateUrl: "https://amzn.to/4gvXVJC",
    shortDescription:
      "The trusted Black+Decker Dustbuster — a cordless handheld vacuum with a crevice tool, rotating slim nozzle and charging base for home and car.",
    description:
      "The #1 name in hand vacs. This cordless, rechargeable Dustbuster is light and easy to grab for quick cleanups around the home and in the car. It picks up hair, dirt, debris and pet hair from stairs, couches, furniture and high-traffic areas, and its rotating slim nozzle reaches tight spots. A pull-out crevice tool and flip-up brush add versatility, and it stores neatly on its charging base.",
    features: [
      "Trusted Black+Decker cordless design",
      "Rotating slim nozzle for tight spaces",
      "Pull-out crevice tool + flip-up brush",
      "Great for hair, dirt, debris and pet hair",
      "Lightweight and easy to store",
      "Includes charging base",
    ],
    pros: ["Reliable brand", "Handy attachments", "Home + car use"],
    cons: ["Best for light cleanups", "Smaller capacity"],
    whoFor: "Anyone who wants a trusted, grab-and-go handheld vacuum for quick messes.",
    whyRecommend: "The Dustbuster name means proven reliability for everyday quick cleanups.",
    faqs: [
      { q: "Is it good for pet hair?", a: "Yes — it's designed to pick up hair, debris and pet hair from multiple surfaces." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["car vacuum", "handheld vacuum", "black+decker", "cleaning", "cordless"],
    featured: true,
  },
  {
    name: "MONOZEL 2-in-1 Cordless Car Vacuum (18,000 Pa)",
    slug: "monozel-2-in-1-car-vacuum-18000pa",
    brand: "MONOZEL",
    category: "car-accessories",
    subcategory: "car-vacuums",
    price: 35773,
    imageUrl: "https://m.media-amazon.com/images/I/71+jsjZ9anL._AC_SL1500_.jpg",
    imageAlt: "MONOZEL 2-in-1 cordless car vacuum and air duster with brushless motor",
    affiliateUrl: "https://amzn.to/45VYp5I",
    shortDescription:
      "A 2-in-1 cordless vacuum and air duster with a 130W brushless motor (up to 18,000 Pa), a 7,800 mAh battery, LED light and multiple nozzles.",
    description:
      "MONOZEL's handheld pairs strong suction with a powerful brushless motor for serious cleaning. Two modes — 9,000 Pa Eco and 18,000 Pa Max — vacuum or blow away pet hair, crumbs and sand from seats and sofas, and it doubles as an inflator. The 130W brushless motor spins up to 115,000 rpm, runs quietly under 85 dB and lasts three times longer than brushed motors. A 7,800 mAh battery charges in about 2.5–3 hours over USB-C, and the washable HEPA filter keeps suction strong.",
    features: [
      "2-in-1 vacuum + air duster",
      "130W brushless motor, up to 18,000 Pa",
      "Eco (9,000 Pa) and Max (18,000 Pa) modes",
      "7,800 mAh battery, USB-C fast charge",
      "LED light + multiple nozzles",
      "Washable, reusable HEPA filter",
    ],
    pros: ["Powerful brushless motor", "Big battery", "Vacuum + blow modes"],
    cons: ["Heavier than mini vacs", "Max mode drains faster"],
    whoFor: "Drivers who want stronger, longer-lasting cordless cleaning power.",
    whyRecommend: "The brushless motor and large battery deliver strong, durable suction.",
    faqs: [
      { q: "How long does the battery last?", a: "Roughly 32 minutes in Eco mode or 18 minutes in Max mode, charging fully in about 2.5–3 hours." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["car vacuum", "cordless", "car accessories", "monozel", "cleaning"],
    featured: true,
  },

  // ---------------------------------------------------------------- Tire inflators
  {
    name: "AUXITO Portable Tire Inflator Air Compressor (150 PSI)",
    slug: "auxito-tire-inflator-150psi",
    brand: "AUXITO",
    category: "car-accessories",
    subcategory: "tire-inflators",
    price: 27451,
    imageUrl: "https://m.media-amazon.com/images/I/71dtBm-0gHL._AC_SL1500_.jpg",
    imageAlt: "AUXITO portable tire inflator air compressor with digital gauge and LED",
    affiliateUrl: "https://amzn.to/4gu7oRI",
    shortDescription:
      "A cordless 150 PSI tire inflator with smart preset modes, auto shut-off, a dual-screen gauge, 5,200 mAh battery, LED light and a USB power-out port.",
    description:
      "Never get caught with a flat. AUXITO's cordless inflator offers preset modes for car, motorcycle, bike and ball plus a custom mode, and reaches 150 PSI with 26 L/min airflow to fill a compact car tyre (30→35 PSI) in about a minute. Set your target pressure and the auto shut-off stops automatically — no over-inflation. A dual-screen display shows real-time and preset pressure with ±1 PSI accuracy, and a 5,200 mAh battery also powers a 3-mode LED flashlight and a USB port to charge your phone.",
    features: [
      "150 PSI max, 26 L/min fast airflow",
      "Preset modes: car, motorcycle, bike, ball + custom",
      "Auto shut-off at target pressure",
      "Dual-screen gauge, ±1 PSI accuracy",
      "5,200 mAh battery + USB power-out",
      "3-mode LED flashlight for emergencies",
    ],
    pros: ["Fast inflation", "Accurate auto shut-off", "Doubles as a power bank + light"],
    cons: ["Not for large truck tyres", "Recharge needed after several tyres"],
    whoFor: "Drivers, cyclists and families who want a reliable all-in-one inflator.",
    whyRecommend: "Fast, accurate and multi-use — it inflates, lights and charges from one device.",
    faqs: [
      { q: "How fast does it inflate?", a: "It fills a compact car tyre from 30 to 35 PSI in about one minute at up to 150 PSI." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["tire inflator", "air compressor", "car accessories", "auxito", "cordless"],
    trending: true,
  },
  {
    name: "Airmoto Portable Tire Inflator Air Compressor",
    slug: "airmoto-tire-inflator-air-compressor",
    brand: "Airmoto",
    category: "car-accessories",
    subcategory: "tire-inflators",
    price: 40389,
    imageUrl: "https://m.media-amazon.com/images/I/81yeGmVV7KL._AC_SL1500_.jpg",
    imageAlt: "Airmoto cordless portable tire inflator with digital gauge and LED",
    affiliateUrl: "https://amzn.to/4wZuEwE",
    shortDescription:
      "The popular Airmoto cordless inflator — up to 120 PSI with a digital gauge, auto shut-off, a built-in LED and a compact glovebox-friendly design.",
    description:
      "A compact, well-reviewed inflator that fits in your glovebox. Set your target pressure with the + and – buttons, press start, and the Airmoto inflates car, truck, SUV, motorcycle and bicycle tyres to precise pressure up to 120 PSI before shutting off automatically. A large LCD shows PSI, kPa, BAR or KG/CM, a built-in LED flashlight helps in low light, and a 2,000 mAh battery recharges over USB-C. It includes Schrader, Presta and needle adapters for tyres and sports gear.",
    features: [
      "Up to 120 PSI with precise auto shut-off",
      "Digital gauge: PSI / kPa / BAR / KG-CM",
      "Compact, fits in the glovebox",
      "Built-in LED flashlight",
      "2,000 mAh battery, USB-C recharge",
      "Schrader, Presta & needle adapters included",
    ],
    pros: ["Very compact", "Simple, accurate operation", "Multiple adapters"],
    cons: ["Not for air mattresses/large volumes", "Smaller battery"],
    whoFor: "Anyone who wants a proven, pocket-size inflator for tyres and sports gear.",
    whyRecommend: "A hugely popular compact inflator that's dead-simple and accurate.",
    faqs: [
      { q: "Can it inflate bike tyres?", a: "Yes — it includes a Presta adapter for bikes plus a needle adapter for sports equipment." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["tire inflator", "air compressor", "car accessories", "airmoto", "cordless"],
    featured: true,
  },
  {
    name: "Lamicall Portable Tire Inflator (150 PSI, 4× Faster)",
    slug: "lamicall-tire-inflator-150psi",
    brand: "Lamicall",
    category: "car-accessories",
    subcategory: "tire-inflators",
    price: 20192,
    imageUrl: "https://m.media-amazon.com/images/I/61HodKK0ijL._AC_SL1300_.jpg",
    imageAlt: "Lamicall portable tire inflator air compressor with LED display",
    affiliateUrl: "https://amzn.to/4zwtf2y",
    shortDescription:
      "An ultra-compact 150 PSI inflator with 4× faster airflow, 5 preset modes, auto-stop, a rechargeable battery and an HD LED display with emergency light.",
    description:
      "Lamicall packs strong performance into a tiny body that fits any glovebox or door pocket. With 150 PSI and a 35 L/min airflow it inflates a 195/65 R15 tyre from 28 to 36 PSI in about a minute. Five one-touch preset modes cover car, truck, SUV, motorcycle, bike, e-bike, scooter and balls, plus a custom mode and four pressure units. Auto-stop prevents over-inflation, a single charge fills up to 15 car tyres, and an HD LED display doubles as a 3-mode emergency light.",
    features: [
      "150 PSI, 4× faster 35 L/min airflow",
      "5 preset modes + custom, 4 pressure units",
      "Auto-stop at target pressure (±2 PSI)",
      "Ultra-compact (6.3 × 2.7 × 2.1\")",
      "Rechargeable — up to 15 car tyres per charge",
      "HD LED display + 3-mode emergency light",
    ],
    pros: ["Very compact", "Fast airflow", "Great battery range"],
    cons: ["Needs a 5V/2A charger", "Not for large truck tyres"],
    whoFor: "Drivers and cyclists who want a tiny but fast, capable inflator.",
    whyRecommend: "Fast airflow and long battery range in one of the most compact inflators available.",
    faqs: [
      { q: "How many tyres per charge?", a: "A single charge inflates up to 15 car tyres (28–36 PSI), or many more bike tyres and balls." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["tire inflator", "air compressor", "car accessories", "lamicall", "cordless"],
    trending: true,
  },

  // ---------------------------------------------------------------- Charger (accessory)
  {
    name: "GOOLOO 100W USB-C 4-Port Foldable Wall Charger",
    slug: "gooloo-100w-usb-c-4-port-charger",
    brand: "GOOLOO",
    category: "accessories",
    subcategory: "chargers",
    price: 23077,
    imageUrl: "https://m.media-amazon.com/images/I/51IYKkhGWNL._AC_SL1500_.jpg",
    imageAlt: "GOOLOO 100W USB-C 4-port foldable compact wall charger",
    affiliateUrl: "https://amzn.to/4qfkF3T",
    shortDescription:
      "A 100W 4-port foldable wall charger that fast-charges laptops and phones — includes a 7.2 ft USB-C cable and an 18-month warranty.",
    description:
      "GOOLOO's compact 100W charger powers up to four devices at once, and a single USB-C port delivers the full 100W to fast-charge a laptop — most laptops reach 55% in under 30 minutes and phones hit 80% in about 30. It's compatible with MacBooks, Dell XPS, iPhone, iPad and more, with temperature, short-circuit, over-voltage and over-current protection plus good heat dissipation. A 7.2 ft USB-C to USB-C cable and an 18-month warranty are included.",
    features: [
      "100W total across 4 ports",
      "Single USB-C delivers full 100W for laptops",
      "Laptop 0–55% in <30 min; phone 0–80% in ~30 min",
      "Foldable, compact and travel-friendly",
      "Full safety + heat-dissipation protection",
      "Includes 7.2 ft USB-C cable + 18-month warranty",
    ],
    pros: ["Real 100W laptop charging", "Cable included", "18-month warranty"],
    cons: ["Single-port 100W drops when sharing", "Larger than a phone-only plug"],
    whoFor: "Laptop users who want one foldable charger for laptop, phone and more.",
    whyRecommend: "100W with a cable and warranty in the box makes it strong value for travel.",
    faqs: [
      { q: "Can it charge a MacBook Pro?", a: "Yes — a single USB-C port delivers up to 100W, enough to fast-charge most USB-C laptops including MacBooks." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["charger", "usb-c", "100w", "gooloo", "accessories"],
  },

  // ---------------------------------------------------------------- Car essentials
  {
    name: "Energizer Heavy-Duty Jumper Cables (16 ft, 6-Gauge)",
    slug: "energizer-jumper-cables-16ft-6-gauge",
    brand: "Energizer",
    category: "car-accessories",
    subcategory: "jump-starters",
    price: 11518,
    imageUrl: "https://m.media-amazon.com/images/I/71NQlEz63kL._AC_SL1500_.jpg",
    imageAlt: "Energizer heavy-duty 16-foot 6-gauge car jumper cables with carrying bag",
    affiliateUrl: "https://amzn.to/4htuWXV",
    shortDescription:
      "Trusted Energizer 16 ft, 6-gauge jumper cables for jump-starting cars, SUVs and trucks — thick vinyl coating, tangle-free copper-clad aluminium and a carry bag.",
    description:
      "A car-emergency essential from a name you trust. These 16-foot, 6-gauge Energizer cables reach easily between vehicles and are ideal for jump-starting a dead or weak battery in trucks, SUVs and cars of all sizes. Strong spring-loaded clamps with comfortable handles grip securely, thick vinyl coating protects against rust and corrosion, and the copper-clad aluminium stays flexible even at -40°C. A travel bag is included for tidy storage.",
    features: [
      "16 ft length, 6-gauge for easy reach",
      "For trucks, SUVs and all car sizes",
      "Strong spring clamps with comfy handles",
      "Thick vinyl coating resists rust/corrosion",
      "Tangle-free CCA, flexible to -40°C",
      "Carrying bag included",
    ],
    pros: ["Trusted Energizer brand", "Long 16 ft reach", "Comes with a bag"],
    cons: ["6-gauge, not for very large diesels", "Manual jump-start (no battery pack)"],
    whoFor: "Every driver who wants reliable jumper cables in the trunk for emergencies.",
    whyRecommend: "A trusted-brand, long, well-built set — the kind of thing every car should carry.",
    faqs: [
      { q: "What vehicles do they work with?", a: "They're rated for trucks, SUVs, full-size, mid-size and compact cars." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["jumper cables", "car accessories", "energizer", "emergency", "battery"],
  },
  {
    name: "Car Trunk Organizer for SUV & Truck (Large, Foldable)",
    slug: "car-trunk-organizer-suv-truck-large",
    brand: "Trunk Crate Pro",
    category: "car-accessories",
    subcategory: "organization",
    price: 23077,
    imageUrl: "https://m.media-amazon.com/images/I/81r4DnL2LOL._AC_SL1500_.jpg",
    imageAlt: "Large foldable car trunk organizer with adjustable compartments, black",
    affiliateUrl: "https://amzn.to/4g9bzRr",
    shortDescription:
      "A large, heavy-duty foldable trunk organiser with adjustable compartments, 11 pockets, a non-slip base and securing straps — keeps cargo tidy and in place.",
    description:
      "Tame a messy trunk with this rugged organiser. Made from premium heavy-duty Oxford polyester, it's water- and abrasion-resistant with reinforced stitching built to last. Adjustable sub-dividers create up to four compartments, 11 pockets hold smaller items, and rigid base plates keep it standing firm even when empty. A non-slip base and straps stop it sliding, and it folds flat for storage when you don't need it. Measures 23.6 × 14.6 × 12.5\".",
    features: [
      "Heavy-duty water-resistant Oxford polyester",
      "4 adjustable compartments + 11 pockets",
      "Rigid base plates keep it upright",
      "Non-slip base and securing straps",
      "Foldable for easy storage",
      "Large 23.6 × 14.6 × 12.5\" size",
    ],
    pros: ["Tough and roomy", "Lots of compartments", "Folds away when unused"],
    cons: ["Large for small trunks", "Soft-sided (not rigid box)"],
    whoFor: "Anyone who wants to stop groceries and gear sliding around the trunk.",
    whyRecommend: "Durable material, smart dividers and straps make it a genuinely useful trunk upgrade.",
    faqs: [
      { q: "Will it stay in place?", a: "Yes — a non-slip base plus securing straps keep it from sliding around the trunk." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["trunk organizer", "car accessories", "storage", "suv", "truck"],
  },

  // ---------------------------------------------------------------- Diagnostics & car care
  {
    name: "BLCKTEC 460T OBD2 Scanner & All-System Diagnostic Tool",
    slug: "blcktec-460t-obd2-scanner",
    brand: "BLCKTEC",
    category: "car-accessories",
    subcategory: "diagnostics",
    price: 115408,
    imageUrl: "https://m.media-amazon.com/images/I/71KcfSMaj7L._AC_SL1500_.jpg",
    imageAlt: "BLCKTEC 460T OBD2 scanner all-system car diagnostic tool",
    affiliateUrl: "https://amzn.to/4wuYqsm",
    shortDescription:
      "A professional-level OBD2 scanner that reads Engine, ABS, SRS and Transmission systems, with 12+ reset services, live data, Auto VIN and free lifetime updates.",
    description:
      "A dealer-level diagnostic tool for home mechanics and pros. The BLCKTEC 460T runs all 10 OBD2 modes and reads and clears Engine, Transmission, ABS and SRS codes with full all-system diagnostics and real-time live data. It performs 12+ workshop reset services — Oil, TPMS, EPB, BMS, SAS, DPF, throttle and more — plus ABS bleeding and battery tests. AutoVIN, AutoScan and AutoReLink make it up to 3× faster, and free lifetime updates plus the RepairSolutions2 app keep it current. Works on OBD2 vehicles from 1996 onward.",
    features: [
      "All-system: Engine, Transmission, ABS, SRS",
      "12+ reset services (Oil, TPMS, EPB, DPF, SAS…)",
      "ABS bleeding + battery test",
      "Real-time OBD2 & OEM live data, freeze frame",
      "AutoVIN / AutoScan — up to 3× faster",
      "Free lifetime updates; 1996+ OBD2 vehicles",
    ],
    pros: ["Near professional-grade", "Huge reset-service list", "Free lifetime updates"],
    cons: ["Priciest item in the set", "Feature support varies by vehicle"],
    whoFor: "Serious DIY mechanics who want dealer-level diagnostics at home.",
    whyRecommend: "It brings professional all-system diagnostics and resets to a handheld tool.",
    faqs: [
      { q: "Will it work on my car?", a: "It supports OBD2-compliant vehicles from 1996 onward; check BLCKTEC's compatibility checker for specific functions on your make/model." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["obd2 scanner", "diagnostics", "car accessories", "blcktec", "mechanic"],
    featured: true,
  },
  {
    name: "BLCKTEC 420 Bluetooth OBD2 Scanner",
    slug: "blcktec-420-bluetooth-obd2-scanner",
    brand: "BLCKTEC",
    category: "car-accessories",
    subcategory: "diagnostics",
    price: 23077,
    imageUrl: "https://m.media-amazon.com/images/I/71Ui7JdPDaL._AC_SL1500_.jpg",
    imageAlt: "BLCKTEC 420 Bluetooth OBD2 scanner with phone app",
    affiliateUrl: "https://amzn.to/45muALs",
    shortDescription:
      "A pocket Bluetooth OBD2 scanner that pairs with a premium iOS/Android app to read and clear check-engine codes, show live data and run battery tests.",
    description:
      "An affordable, wireless way to diagnose your car. The BLCKTEC 420 plugs into your OBD2 port and pairs over Bluetooth with a top-rated app to read and erase codes, clear the check-engine light, show live data, run battery/alternator tests and explain code severity — with verified fixes from ASE-certified technicians. It works on all 1996-and-newer OBD2 vehicles, supports English, Spanish and French, and gets free firmware updates. Designed and supported in the USA.",
    features: [
      "Bluetooth OBD2 — pairs with iOS/Android app",
      "Reads/erases codes, clears check-engine light",
      "Live data + battery/alternator tests",
      "Code severity levels + verified fixes",
      "Works on all 1996+ OBD2 vehicles",
      "Free updates; English/Spanish/French",
    ],
    pros: ["Wireless and compact", "Great companion app", "Very affordable"],
    cons: ["Needs a phone to use", "Fewer resets than the 460T"],
    whoFor: "Everyday drivers who want a simple wireless way to check engine codes.",
    whyRecommend: "A cheap, pocketable scanner with a genuinely helpful app for DIY diagnostics.",
    faqs: [
      { q: "Do I need a phone?", a: "Yes — it connects over Bluetooth to the free BLCKTEC app on iOS or Android." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["obd2 scanner", "diagnostics", "car accessories", "blcktec", "bluetooth"],
    trending: true,
  },
  {
    name: "CERAKOTE Ceramic Headlight Restoration Kit",
    slug: "cerakote-ceramic-headlight-restoration-kit",
    brand: "CERAKOTE",
    category: "car-accessories",
    subcategory: "car-care",
    price: 10358,
    imageUrl: "https://m.media-amazon.com/images/I/71mjhuksqYL._AC_SL1500_.jpg",
    imageAlt: "CERAKOTE ceramic headlight restoration wipe kit",
    affiliateUrl: "https://amzn.to/4xKqrx7",
    shortDescription:
      "A no-power-tools headlight restoration kit that removes yellowing and clouding, then seals with a long-lasting ceramic UV coating — a simple 3-step, 30-minute job.",
    description:
      "Bring cloudy, yellowed headlights back to like-new in about 30 minutes — no power tools, no risk to your paint. This CERAKOTE 10-wipe kit uses a simple 3-step system: oxidation-removing wipes, a sanding kit for deeper oxidation, then ceramic coating wipes that chemically bond to the lens for lasting UV protection. It's the same professional-grade ceramic technology CERAKOTE is known for, in an easy DIY format.",
    features: [
      "Restores clouded, yellowed headlights",
      "3-step wipe system, ~30 minutes",
      "No power tools required",
      "Long-lasting ceramic UV protection",
      "Chemically bonds to the lens",
      "Kit: 8 oxidation wipes, sanding kit, 2 ceramic wipes",
    ],
    pros: ["Easy 30-minute DIY", "Durable ceramic UV seal", "No tools needed"],
    cons: ["Single-vehicle kit", "Results vary with damage severity"],
    whoFor: "Anyone with foggy, yellowed headlights who wants an easy, lasting fix.",
    whyRecommend: "Professional-grade ceramic protection in a simple wipe kit that needs no tools.",
    faqs: [
      { q: "Do I need any tools?", a: "No — everything needed is in the kit, and no power tools are required." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["headlight restoration", "car care", "car accessories", "cerakote", "ceramic"],
  },
];

export function amazon2ToData(p: AmazonProduct2): Prisma.MarketProductUncheckedCreateInput {
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
