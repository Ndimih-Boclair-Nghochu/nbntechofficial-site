import type { Prisma } from "@prisma/client";
import { COUNTRIES } from "@/lib/marketplace";

/**
 * Real Amazon affiliate products, added to NBN MARKET with the owner's exact
 * amzn.to tracking links (Associates tag ndimihboclair-20). Every field —
 * title, image, feature bullets — was taken from the live Amazon product page.
 *
 * Prices (PRICES_XAF below) are the real amounts Amazon displayed at the time
 * of listing, captured in XAF (CFA franc) — the same currency as our Selar
 * products — so the storefront's live currency conversion localizes them per
 * visitor. Amazon prices change often, so the "Buy on Amazon" button always
 * sends the shopper to the live listing for the exact current price before they
 * buy. A few products sell only via "buying options" (no single featured
 * price); those keep a null price and simply show the live price on Amazon. We
 * never fabricate prices, ratings, reviews or stock.
 *
 * Availability: the amzn.to short links are OneLink-enabled, so a single link
 * routes each visitor to their local Amazon store and earns globally. They are
 * therefore marked available across every supported country (platform "Amazon").
 */

type AmazonProduct = {
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  imageUrl: string;
  imageAlt: string;
  /** The owner's amzn.to affiliate short link. */
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

/** Availability for an Amazon OneLink product: available in every country. */
function amazonEverywhereAvailability(url: string) {
  return COUNTRIES.reduce<Record<string, { status: string; platform: string; url: string }>>(
    (m, c) => ({ ...m, [c.code]: { status: "AVAILABLE", platform: "Amazon", url } }),
    {},
  );
}

/** Standard FAQ pair reused across the Amazon catalogue. */
const AMAZON_FAQ = {
  q: "Is it available in my country?",
  a: "Yes. The link routes you to your local Amazon store, where you'll see the current price, shipping options and delivery estimate before you buy.",
};
const PRICE_FAQ = {
  q: "Is the price up to date?",
  a: "The price shown is what Amazon listed for this item, converted to your local currency. Amazon prices can change, so tap “Buy on Amazon” to confirm the exact, current price before you buy.",
};

/**
 * Real Amazon prices captured in XAF, keyed by product slug. Products sold only
 * through "buying options" (no single featured price) are omitted and stay
 * price-less, showing the live price on Amazon instead.
 */
const PRICES_XAF: Record<string, number> = {
  "wireless-earbuds-bluetooth-54-rose-gold": 13267,
  "wireless-earbuds-bluetooth-54-white": 13151,
  "soundcore-anker-p20i-earbuds": 17422,
  "40w-usb-c-charger-cube-4-port-2-pack": 4611,
  "duloch-40w-usb-c-charger-4-port-2-pack": 11530,
  "amazon-basics-100w-gan-wall-charger": 21202,
  "joyeky-360-rotating-aluminium-laptop-stand": 20763,
  "amazon-basics-ergonomic-laptop-stand": 17306,
  "adjustable-metal-laptop-stand": 8217,
  "nulaxy-dual-rod-adjustable-laptop-stand": 10381,
  "amazon-basics-wired-keyboard": 6752,
  "amazon-basics-wireless-keyboard-numeric": 10295,
  "razer-huntsman-v3-pro-tkl": 115408,
  "amazon-basics-wireless-optical-mouse": 7496,
  "amazon-basics-vertical-wireless-mouse": 10491,
  "vivo-dual-monitor-desk-mount-stand-v002": 20192,
  "amazon-basics-surge-protector-6-outlet": 6411,
  "amazon-basics-wall-mount-surge-9-in-1": 13844,
  "teiobar-surge-protector-12-outlet-4-usb": 10381,
  // Buying-options only (no single featured price): razer-viper-v3-pro-wireless-mouse,
  // vivo-dual-monitor-spring-arm-stand, huanuo-flowlift-dual-monitor-stand.
};

export const AMAZON_PICKS: AmazonProduct[] = [
  // ---------------------------------------------------------------- Audio
  {
    name: "Wireless Earbuds — Bluetooth 5.4, ENC Mic, IP7 Waterproof (Rose Gold)",
    slug: "wireless-earbuds-bluetooth-54-rose-gold",
    brand: "NBN Pick",
    category: "technology-electronics",
    subcategory: "wireless-earbuds",
    imageUrl: "https://m.media-amazon.com/images/I/71tuY4g-PWL._AC_SL1500_.jpg",
    imageAlt: "Rose gold wireless Bluetooth 5.4 earbuds with LED charging case",
    affiliateUrl: "https://amzn.to/3TVKPMZ",
    shortDescription:
      "Bluetooth 5.4 earbuds with HiFi stereo, ENC noise-cancelling mics, a bright LED battery display and up to 48 hours of playtime — sweat- and rain-proof for any workout.",
    description:
      "These wireless earbuds pack a lot into a tiny, 3.7g shell. Bluetooth 5.4 gives a fast, stable connection with no lag, 14.2mm dynamic drivers deliver deep bass and clear highs, and four ENC microphones cut out background noise so your calls stay crisp. A dual LED display shows exactly how much charge is left in the buds and the case, and IP7 waterproofing means rain and sweat are never a problem.",
    features: [
      "Bluetooth 5.4 — fast, stable connection with up to 15m range",
      "ENC noise-cancelling with 4 microphones for clear calls",
      "14.2mm dynamic drivers for HiFi stereo sound",
      "Up to 48H total battery with LED battery display",
      "IP7 waterproof — sweat- and rain-proof for workouts",
      "Touch controls for music, calls and voice assistant",
    ],
    pros: ["All-day 48H battery", "Genuinely waterproof (IP7)", "Clear calls thanks to ENC mics"],
    cons: ["Not premium ANC (environmental, not active, cancelling)", "Colour availability can vary"],
    whoFor: "Anyone who wants affordable, waterproof earbuds for the gym, commuting and calls.",
    whyRecommend: "It nails the essentials — battery, waterproofing and call clarity — at a budget-friendly price.",
    faqs: [
      { q: "Are they good for running?", a: "Yes — they're lightweight, secure and IP7 waterproof, so sweat and rain won't damage them." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["earbuds", "bluetooth", "audio", "waterproof", "workout"],
    featured: true,
    trending: true,
  },
  {
    name: "Wireless Earbuds — Bluetooth 5.4, ENC Mic, IP7 Waterproof (White)",
    slug: "wireless-earbuds-bluetooth-54-white",
    brand: "NBN Pick",
    category: "technology-electronics",
    subcategory: "wireless-earbuds",
    imageUrl: "https://m.media-amazon.com/images/I/61NGHs8v0kL._AC_SL1280_.jpg",
    imageAlt: "White wireless Bluetooth 5.4 earbuds with LED charging case",
    affiliateUrl: "https://amzn.to/4g66oTT",
    shortDescription:
      "The same Bluetooth 5.4 HiFi earbuds in a clean white finish — ENC mics, LED battery display, IP7 waterproofing and up to 48 hours of playtime.",
    description:
      "A crisp white version of our favourite budget earbuds. Bluetooth 5.4 keeps the connection fast and stable, 14.2mm drivers give you punchy bass and clear detail, and four ENC microphones keep your voice clear on calls. With a dual LED display, IP7 waterproofing and up to 48 hours of total battery, they're built to keep up with a full, active day.",
    features: [
      "Bluetooth 5.4 — fast, stable connection with up to 15m range",
      "ENC noise-cancelling with 4 microphones for clear calls",
      "14.2mm dynamic drivers for HiFi stereo sound",
      "Up to 48H total battery with LED battery display",
      "IP7 waterproof — sweat- and rain-proof for workouts",
      "Touch controls for music, calls and voice assistant",
    ],
    pros: ["All-day 48H battery", "Genuinely waterproof (IP7)", "Clean, minimal white design"],
    cons: ["Not premium ANC (environmental, not active, cancelling)", "Colour availability can vary"],
    whoFor: "Anyone who prefers a white finish and wants dependable, waterproof everyday earbuds.",
    whyRecommend: "Same strong battery, waterproofing and call clarity — in a fresh, minimal white.",
    faqs: [
      { q: "Do they work with iPhone and Android?", a: "Yes — they pair with virtually any Bluetooth device, including iOS and Android phones, tablets and laptops." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["earbuds", "bluetooth", "audio", "waterproof", "workout"],
    featured: true,
  },
  {
    name: "Soundcore by Anker P20i True Wireless Earbuds",
    slug: "soundcore-anker-p20i-earbuds",
    brand: "Soundcore by Anker",
    category: "technology-electronics",
    subcategory: "wireless-earbuds",
    imageUrl: "https://m.media-amazon.com/images/I/51Yya2WtvkL._AC_SL1341_.jpg",
    imageAlt: "Soundcore by Anker P20i true wireless earbuds with charging case",
    affiliateUrl: "https://amzn.to/4wvXYKr",
    shortDescription:
      "Anker's bestselling budget earbuds — big 10mm-driver bass, 30 hours of playtime, Bluetooth 5.3, water resistance and 22 EQ presets you can tune in the app.",
    description:
      "The Soundcore P20i is one of the most popular budget earbuds for good reason. Oversized 10mm drivers push powerful, boosted bass, the Soundcore app lets you pick from 22 EQ presets and customise the controls, and two AI-enhanced microphones keep your calls clear. A single charge lasts 10 hours, and the compact case takes you to 30 — with a quick 10-minute top-up giving you 2 more hours.",
    features: [
      "Oversized 10mm drivers with big, boosted bass",
      "30H total playtime; 10-min charge = 2 hours",
      "Bluetooth 5.3 stable connection",
      "2 mics with AI algorithm for clear calls",
      "22 EQ presets + control customisation in the Soundcore app",
      "Water-resistant with a compact, pocketable case",
    ],
    pros: ["Trusted Anker brand", "Great value for the sound", "App EQ and Find My Earbuds"],
    cons: ["No active noise cancellation", "Charges via case only"],
    whoFor: "Anyone who wants a reliable, name-brand pair of earbuds without spending a lot.",
    whyRecommend: "It's the safe, proven budget choice — strong bass, long battery and a polished companion app.",
    faqs: [
      { q: "Can I customise the sound?", a: "Yes — the Soundcore app has 22 EQ presets plus control customisation and a Find My Earbuds feature." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["earbuds", "anker", "soundcore", "bluetooth", "audio"],
    featured: true,
    trending: true,
  },

  // ---------------------------------------------------------------- Chargers
  {
    name: "40W USB-C Charger Cube — 4-Port PD+QC (2-Pack)",
    slug: "40w-usb-c-charger-cube-4-port-2-pack",
    brand: "NBN Pick",
    category: "accessories",
    subcategory: "chargers",
    imageUrl: "https://m.media-amazon.com/images/I/71ZqxCYwpJL._AC_SL1500_.jpg",
    imageAlt: "40W four-port USB-C and USB-A wall charger cube, 2-pack",
    affiliateUrl: "https://amzn.to/4ciCitK",
    shortDescription:
      "A compact 4-port wall charger — 2 USB-C + 2 USB-A, 40W total with PD and Quick Charge 3.0 — that charges four devices at once. Comes as a handy 2-pack.",
    description:
      "One little cube replaces a tangle of chargers. With two USB-C and two USB-A ports and 40W of total power, it charges your phone, tablet and earbuds all at the same time — and Power Delivery plus Quick Charge 3.0 get a compatible iPhone from 0% to 58% in about 30 minutes. A smart chip guards against overcharging and overheating, and you get two of them, so you can keep one at home and one in your bag.",
    features: [
      "4 ports: 2× USB-C + 2× USB-A, 40W total output",
      "Power Delivery + Quick Charge 3.0 fast charging",
      "USB-C up to 20W; iPhone 0–58% in ~30 minutes",
      "Charges up to 4 devices simultaneously",
      "Compact, travel-friendly brick — comes as a 2-pack",
      "Smart chip guards against overcharge and overheating",
    ],
    pros: ["Two chargers in one purchase", "Charges 4 devices at once", "Small and travel-friendly"],
    cons: ["40W is shared across ports", "Not enough for fast-charging most laptops"],
    whoFor: "Anyone juggling several devices who wants one tidy charger for home and travel.",
    whyRecommend: "Four ports, real fast charging and a spare in the box make it superb value.",
    faqs: [
      { q: "Can it charge a laptop?", a: "It can trickle-charge low-power laptops, but 40W shared across ports isn't ideal for fast-charging most laptops — see the 100W GaN charger for that." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["charger", "usb-c", "power-delivery", "accessories", "travel"],
    trending: true,
  },
  {
    name: "Duloch 40W USB-C Wall Charger — 4-Port PD+QC (2-Pack)",
    slug: "duloch-40w-usb-c-charger-4-port-2-pack",
    brand: "Duloch",
    category: "accessories",
    subcategory: "chargers",
    imageUrl: "https://m.media-amazon.com/images/I/61hTB58mslL._AC_SL1500_.jpg",
    imageAlt: "Duloch 40W four-port USB-C wall charger block, 2-pack",
    affiliateUrl: "https://amzn.to/3TZ7SGG",
    shortDescription:
      "Duloch's 40W four-port block — 2 USB-C + 2 USB-A with PD and QC 3.0 — charges four devices at once and ships as a 2-pack with an 18-month guarantee.",
    description:
      "A dependable 40W four-port charger that turns a single outlet into a charging hub for the whole desk. Two USB-C and two USB-A ports let you power four devices together, Power Delivery and Quick Charge 3.0 handle fast charging (a compatible iPhone reaches 58% in about 30 minutes), and a smart chip keeps everything cool and safe. It comes as a 2-pack and is backed by an 18-month guarantee.",
    features: [
      "4 ports: 2× USB-C + 2× USB-A, 40W total output",
      "Power Delivery + Quick Charge 3.0 fast charging",
      "USB-C up to 20W; iPhone 0–58% in ~30 minutes",
      "Charges up to 4 devices simultaneously",
      "Compact and portable — comes as a 2-pack",
      "Smart-chip safety + 18-month guarantee",
    ],
    pros: ["Two chargers in the box", "18-month guarantee", "Four ports on one plug"],
    cons: ["40W is shared across ports", "Not for fast-charging large laptops"],
    whoFor: "Anyone who wants a reliable multi-port charger with a warranty, at home and on the go.",
    whyRecommend: "Solid four-port charging, a spare in the box and a long guarantee for peace of mind.",
    faqs: [
      { q: "What devices does it fit?", a: "Almost anything USB-charged — iPhone, iPad, Samsung Galaxy, Pixel, tablets, earbuds and more." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["charger", "usb-c", "power-delivery", "accessories", "duloch"],
  },
  {
    name: "Amazon Basics 100W Four-Port GaN Wall Charger",
    slug: "amazon-basics-100w-gan-wall-charger",
    brand: "Amazon Basics",
    category: "accessories",
    subcategory: "chargers",
    imageUrl: "https://m.media-amazon.com/images/I/511PV0Bs8gS._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics 100W four-port GaN foldable wall charger in black",
    affiliateUrl: "https://amzn.to/3RN9fYv",
    shortDescription:
      "A powerful 100W GaN charger with 2 USB-C and 2 USB-A ports — enough to fast-charge a laptop and phones at once, in a compact foldable-plug body.",
    description:
      "This is the charger that can actually replace your laptop brick. With 100W of combined Power Delivery 3.0 across two USB-C and two USB-A ports, it can fast-charge a USB-C laptop and top up two phones at the same time. GaN technology keeps it small and cool, the plug folds flat for travel, and built-in over-voltage, overheating and short-circuit protection keep your devices safe.",
    features: [
      "100W combined USB Power Delivery PD 3.0",
      "2× USB-C (up to 100W single) + 2× USB-A ports",
      "Charges a laptop and 2 phones simultaneously",
      "GaN tech — compact, efficient, runs cooler",
      "Foldable plug for travel-friendly portability",
      "Over-voltage, overheating & short-circuit protection",
    ],
    pros: ["Enough power for most laptops", "Compact GaN design", "Trusted Amazon Basics build"],
    cons: ["No PPS (Samsung/Pixel capped at 9V)", "Single USB-C drops to 65W when all ports used"],
    whoFor: "Laptop users and multi-device travellers who want one charger for everything.",
    whyRecommend: "100W GaN in a foldable body means one charger handles your laptop, phone and more.",
    faqs: [
      { q: "Can it charge a MacBook?", a: "Yes — with up to 100W on a single USB-C port, it fast-charges most USB-C laptops including MacBooks." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["charger", "gan", "100w", "usb-c", "laptop", "amazon basics"],
    featured: true,
  },

  // ---------------------------------------------------------------- Laptop stands
  {
    name: "JOYEKY 360° Rotating Aluminium Laptop Stand (10–16\")",
    slug: "joyeky-360-rotating-aluminium-laptop-stand",
    brand: "JOYEKY",
    category: "accessories",
    subcategory: "laptop-stands",
    imageUrl: "https://m.media-amazon.com/images/I/71mNTsmd4NL._AC_SL1500_.jpg",
    imageAlt: "JOYEKY 360-degree rotating aluminium laptop stand for desk",
    affiliateUrl: "https://amzn.to/4wZaa7e",
    shortDescription:
      "A sturdy aluminium laptop riser with a 360° swivel base and adjustable height and angle — foldable, well-ventilated and built for 10–16\" laptops.",
    description:
      "Raise your laptop to eye level and spin it to share your screen in a second. This aluminium stand adjusts for both height (up to 11.8\") and angle to ease neck and shoulder strain, while a smooth dual-axis base rotates a full 360° — ideal for presentations and collaboration. The open design keeps your laptop cool, a heavy base keeps it rock-steady up to 11 lbs, and it folds down small enough to slip in a backpack.",
    features: [
      "360° swivel base — great for sharing your screen",
      "Adjustable height (up to 11.8\") and viewing angle",
      "Aircraft-grade aluminium, supports up to 11 lbs",
      "Open design promotes airflow and cooling",
      "Folds flat (9.45 × 9.45 × 1.25\") for travel",
      "Fits all 10–16\" laptops incl. MacBook Air/Pro",
    ],
    pros: ["Unique 360° rotation", "Solid, stable aluminium", "Folds up for travel"],
    cons: ["Heavier than plastic risers", "Premium price for a stand"],
    whoFor: "Anyone who presents or collaborates and wants an ergonomic, rotating desk setup.",
    whyRecommend: "The 360° swivel plus real height adjustment makes it more versatile than a fixed riser.",
    faqs: [
      { q: "Will it hold my MacBook Pro 16?", a: "Yes — it fits 10–16\" laptops and supports up to 11 lbs, comfortably covering a 16\" MacBook Pro." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["laptop stand", "ergonomic", "aluminium", "home office", "accessories"],
    featured: true,
  },
  {
    name: "Amazon Basics Ergonomic Laptop Stand (up to 15.6\")",
    slug: "amazon-basics-ergonomic-laptop-stand",
    brand: "Amazon Basics",
    category: "accessories",
    subcategory: "laptop-stands",
    imageUrl: "https://m.media-amazon.com/images/I/51KyaTB1EKL._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics height-adjustable ventilated laptop stand in silver",
    affiliateUrl: "https://amzn.to/4qhUNV2",
    shortDescription:
      "A sturdy, height-adjustable aluminium laptop riser with ventilated cooling — folds flat, weighs 1.7 lbs and fits laptops up to 15.6\".",
    description:
      "A clean, no-nonsense laptop riser from Amazon Basics. Up to 7 inches of height adjustment helps you dial in a healthier posture, the hollow aluminium body keeps your laptop cool during long sessions, and non-slip pads plus protective hooks hold your machine securely. At just 1.7 lbs and folding to a slim 10 × 8.7 × 1.8\", it drops into most laptop bags for work or travel.",
    features: [
      "Up to 7\" of ergonomic height adjustment",
      "Ventilated hollow design for cooling",
      "Lightweight rust-resistant aluminium, holds 11 lbs",
      "Non-slip silicone pads + protective hooks",
      "Folds flat (10 × 8.7 × 1.8\"), weighs 1.7 lbs",
      "Fits 10–15.6\" laptops and tablets",
    ],
    pros: ["Trusted Amazon Basics quality", "Genuinely portable", "Good ventilation"],
    cons: ["Height only, no swivel", "Caps at 15.6\" laptops"],
    whoFor: "Anyone who wants a dependable, affordable, travel-ready laptop stand.",
    whyRecommend: "It's the safe, well-built default — light, foldable and reasonably priced.",
    faqs: [
      { q: "Is it stable for typing?", a: "Yes — non-slip pads and protective hooks keep the laptop steady; just avoid heavy downward pressure on a flat, solid surface." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["laptop stand", "ergonomic", "amazon basics", "home office", "accessories"],
  },
  {
    name: "Adjustable Metal Laptop Stand (10–15.6\")",
    slug: "adjustable-metal-laptop-stand",
    brand: "NBN Pick",
    category: "accessories",
    subcategory: "laptop-stands",
    imageUrl: "https://m.media-amazon.com/images/I/71Api8I7QML._AC_SL1500_.jpg",
    imageAlt: "Adjustable foldable metal laptop riser with ventilation holes",
    affiliateUrl: "https://amzn.to/4wviavM",
    shortDescription:
      "A heavy-duty metal laptop riser that holds up to 17.6 lbs — adjustable height and angle, well-ventilated and foldable for travel.",
    description:
      "Built from sturdy metal, this riser holds up to 17.6 lbs — plenty for even large laptops — while rubber mats and anti-slip pads keep everything locked in place and scratch-free. Adjust the height and angle to fix your posture and ease neck, back and eye strain, and let the ventilated top keep your machine cool. When you're done, it folds flat to slide into a backpack.",
    features: [
      "Sturdy metal build, supports up to 17.6 lbs",
      "Adjustable height and viewing angle",
      "Ventilation holes for better airflow",
      "Rubber mats + anti-slip pads protect your laptop",
      "Foldable and portable for travel",
      "Fits all 10–15.6\" laptops and tablets",
    ],
    pros: ["High 17.6 lb capacity", "Strong metal build", "Folds for travel"],
    cons: ["No 360° swivel", "Caps at 15.6\" laptops"],
    whoFor: "Anyone who wants a rugged, high-capacity stand that still folds away.",
    whyRecommend: "A higher weight rating than most budget stands, in a foldable metal frame.",
    faqs: [
      { q: "Does it scratch the laptop?", a: "No — rubber mats on the hooks and silicone pads top and bottom protect your device from scratches and sliding." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["laptop stand", "ergonomic", "metal", "home office", "accessories"],
  },
  {
    name: "Nulaxy Dual-Rod Adjustable Laptop Stand (10–17\")",
    slug: "nulaxy-dual-rod-adjustable-laptop-stand",
    brand: "Nulaxy",
    category: "accessories",
    subcategory: "laptop-stands",
    imageUrl: "https://m.media-amazon.com/images/I/61jtA8kHq9L._AC_SL1500_.jpg",
    imageAlt: "Nulaxy heavy-duty dual-rod adjustable laptop stand with heat vents",
    affiliateUrl: "https://amzn.to/3UxykHB",
    shortDescription:
      "A heavy-duty laptop stand with a dual-support-rod design for wobble-free typing — holds up to 22 lbs, cools with a vented panel and fits 10–17\" laptops.",
    description:
      "Nulaxy's dual-rod mechanism is what sets this stand apart: instead of a single wobbly hinge, two support rods spread the weight for a genuinely stable, 100% wobble-free typing experience — even with heavy 17\" gaming laptops up to 22 lbs. A geometric heat-vent panel keeps your machine from thermal-throttling during intense tasks, and the whole thing folds flat in seconds to travel with you.",
    features: [
      "Dual-support-rod design — wobble-free typing",
      "Holds heavy-duty laptops up to 22 lbs",
      "Vented heat panel prevents thermal throttling",
      "Fits all 10–17\" laptops incl. large gaming models",
      "Anti-slip silicone pads protect from scratches",
      "Dual-foldable — collapses flat for travel",
    ],
    pros: ["Exceptionally stable", "Huge 22 lb capacity", "Handles 17\" laptops"],
    cons: ["Bulkier when folded than slim risers", "Overkill for small ultrabooks"],
    whoFor: "Gamers and power users with big, heavy laptops who hate a wobbly stand.",
    whyRecommend: "The dual-rod build is noticeably steadier than single-hinge stands and takes serious weight.",
    faqs: [
      { q: "Will it hold a 17\" gaming laptop?", a: "Yes — it's rated for 10–17\" laptops up to 22 lbs, which covers large gaming machines." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["laptop stand", "ergonomic", "nulaxy", "gaming", "accessories"],
    trending: true,
  },

  // ---------------------------------------------------------------- Keyboards
  {
    name: "Amazon Basics Wired Keyboard (Full-Size, QWERTY)",
    slug: "amazon-basics-wired-keyboard",
    brand: "Amazon Basics",
    category: "developer-gear",
    subcategory: "keyboards",
    imageUrl: "https://m.media-amazon.com/images/I/71ehwfAM4-L._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics full-size wired USB QWERTY keyboard in black",
    affiliateUrl: "https://amzn.to/4wtqmNb",
    shortDescription:
      "A no-fuss full-size wired keyboard with media hot-keys — plug-and-play over USB, works with Windows, and reliable for everyday work.",
    description:
      "Sometimes you just want a keyboard that works. This full-size Amazon Basics board plugs in over USB and starts typing immediately — no drivers, no pairing. Media hot-keys give you quick access to volume, mute, My Computer and the calculator, the familiar QWERTY layout suits both work and home, and the understated black finish fits any desk.",
    features: [
      "Full-size wired USB keyboard, plug-and-play",
      "Media hot-keys: volume, mute, My Computer, calculator",
      "Standard familiar QWERTY layout",
      "Works across Windows versions (Vista/7/8/10)",
      "Sleek black design that suits any setup",
      "No batteries or charging — always ready",
    ],
    pros: ["Rock-solid wired reliability", "No setup needed", "Very affordable"],
    cons: ["Wired only", "Basic membrane feel"],
    whoFor: "Anyone who wants a dependable, cable-connected keyboard for office or home use.",
    whyRecommend: "It's the honest, works-every-time budget keyboard with handy media keys.",
    faqs: [
      { q: "Do I need to install anything?", a: "No — it's plug-and-play over USB and works immediately on Windows." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["keyboard", "wired", "amazon basics", "office", "developer"],
  },
  {
    name: "Amazon Basics Wireless Keyboard with Numeric Keypad",
    slug: "amazon-basics-wireless-keyboard-numeric",
    brand: "Amazon Basics",
    category: "developer-gear",
    subcategory: "keyboards",
    imageUrl: "https://m.media-amazon.com/images/I/61QILB-OgXL._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics compact 2.4GHz wireless keyboard with numeric keypad in black",
    affiliateUrl: "https://amzn.to/4ciXzn8",
    shortDescription:
      "A quiet, compact 2.4GHz wireless keyboard with a numeric keypad and 12 media hot-keys — plug-and-play with secure AES-encrypted typing.",
    description:
      "A tidy wireless keyboard for a cable-free desk. Sound-dampened keys keep your typing quiet, a full numeric keypad speeds up any spreadsheet work, and 12 multimedia hot-keys sit within easy reach. It connects instantly through a 2.4GHz USB receiver — no drivers needed — and transmits with 128-bit AES encryption so your keystrokes stay private.",
    features: [
      "2.4GHz wireless via USB receiver — plug-and-play",
      "Quiet, sound-dampened keys",
      "Full numeric keypad for fast data entry",
      "12 multimedia hot-keys",
      "128-bit AES-encrypted transmission",
      "Compact US layout, works on Windows 7/8/10",
    ],
    pros: ["Quiet typing", "Numeric keypad included", "Cable-free desk"],
    cons: ["Runs on batteries", "2.4GHz (not Bluetooth)"],
    whoFor: "Anyone who wants a quiet, wireless keyboard with a number pad for everyday work.",
    whyRecommend: "Quiet keys plus a numeric pad and encrypted wireless make it a great value office board.",
    faqs: [
      { q: "Is it Bluetooth?", a: "No — it uses a 2.4GHz USB nano receiver, which just plugs in and works without pairing." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["keyboard", "wireless", "amazon basics", "office", "developer"],
  },
  {
    name: "Razer Huntsman V3 Pro TKL Analog Gaming Keyboard",
    slug: "razer-huntsman-v3-pro-tkl",
    brand: "Razer",
    category: "gaming",
    subcategory: "gaming-keyboards",
    imageUrl: "https://m.media-amazon.com/images/I/81zUBZKswJL._AC_SL1500_.jpg",
    imageAlt: "Razer Huntsman V3 Pro TKL esports gaming keyboard in black",
    affiliateUrl: "https://amzn.to/4wU2vXX",
    shortDescription:
      "Razer's flagship esports TKL keyboard — Gen-2 analog optical switches, Rapid Trigger, adjustable actuation, Snap Tap and a true 8000Hz polling rate.",
    description:
      "Built for competitive play, the Huntsman V3 Pro TKL uses Gen-2 analog optical switches with Rapid Trigger for ultra-fast repeated inputs and an adjustable 0.1–4.0mm actuation point. Razer Snap Tap prioritises your latest keypress for near-instant directional changes, a true 8000Hz polling rate gives you a split-second edge, and onboard controls plus a digital dial let you fine-tune everything without software. Doubleshot PBT keycaps keep it looking sharp for years.",
    features: [
      "Gen-2 analog optical switches, 0.1–4.0mm actuation",
      "Rapid Trigger for ultra-fast repeated inputs",
      "Razer Snap Tap for near-instant direction changes",
      "True 8000Hz HyperPolling — 8× the standard",
      "Onboard LED adjustments, no software required",
      "Digital dial + media controls; PBT keycaps",
    ],
    pros: ["Elite esports performance", "Analog + Rapid Trigger", "Onboard, software-free tuning"],
    cons: ["Premium price", "TKL layout omits the numpad"],
    whoFor: "Competitive and serious gamers who want top-tier speed and adjustable actuation.",
    whyRecommend: "Analog switches, Rapid Trigger and 8000Hz polling put it at the front of the esports pack.",
    faqs: [
      { q: "What makes analog switches special?", a: "They let you set your own actuation depth and enable Rapid Trigger, so keys register faster and reset instantly — a real edge in fast games." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["keyboard", "gaming", "razer", "esports", "mechanical"],
    featured: true,
    trending: true,
  },

  // ---------------------------------------------------------------- Mice
  {
    name: "Amazon Basics 2.4GHz Wireless Optical Mouse",
    slug: "amazon-basics-wireless-optical-mouse",
    brand: "Amazon Basics",
    category: "developer-gear",
    subcategory: "mice",
    imageUrl: "https://m.media-amazon.com/images/I/61YQeAUIboL._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics 2.4GHz wireless optical mouse with USB nano receiver in black",
    affiliateUrl: "https://amzn.to/4i5EiJw",
    shortDescription:
      "A simple, affordable 3-button wireless optical mouse with a tuck-away USB nano receiver — smooth tracking and a reliable 2.4GHz connection.",
    description:
      "An everyday wireless mouse that just gets the job done. Smooth optical tracking and a reliable 2.4GHz connection (not Bluetooth) keep the cursor precise, and the USB nano receiver either stays in your laptop or tucks neatly inside the mouse when you travel. It's plug-and-play across every recent Windows version — no setup, no fuss.",
    features: [
      "3-button wireless optical mouse",
      "Reliable 2.4GHz connection (not Bluetooth)",
      "Nano receiver tucks inside the mouse for travel",
      "Smooth, precise optical tracking",
      "Works with Windows XP through 10",
      "Plug-and-play — no drivers needed",
    ],
    pros: ["Very affordable", "Receiver stows away", "No setup required"],
    cons: ["Basic feature set", "2.4GHz, not Bluetooth"],
    whoFor: "Anyone who needs a cheap, dependable spare or everyday wireless mouse.",
    whyRecommend: "It's the reliable, no-thought budget mouse — cheap, simple and it just works.",
    faqs: [
      { q: "Where does the receiver go?", a: "It plugs into a USB-A port, or stores neatly inside the mouse when you're on the move." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["mouse", "wireless", "amazon basics", "office", "developer"],
  },
  {
    name: "Amazon Basics 6-Button Vertical Wireless Mouse",
    slug: "amazon-basics-vertical-wireless-mouse",
    brand: "Amazon Basics",
    category: "developer-gear",
    subcategory: "mice",
    imageUrl: "https://m.media-amazon.com/images/I/61b20exD0YL._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics ergonomic 6-button vertical wireless mouse in black",
    affiliateUrl: "https://amzn.to/4gifxHQ",
    shortDescription:
      "An ergonomic vertical wireless mouse that puts your hand in a natural handshake position — 6 buttons, adjustable DPI and a comfortable, strain-reducing shape.",
    description:
      "If a normal mouse leaves your wrist aching, a vertical mouse can help. This one holds your hand in a natural handshake position to reduce wrist strain, adds six buttons for extra control, and lets you switch DPI (1000/1200/1600/2400) on the fly. A 2.4GHz connection works reliably within 33 feet, it's plug-and-play on Windows 7 through 11, and the included AAA batteries last around four months.",
    features: [
      "Ergonomic vertical shape reduces wrist strain",
      "6 buttons for extra control",
      "Adjustable DPI: 1000 / 1200 / 1600 / 2400",
      "Reliable 2.4GHz wireless up to 33 feet",
      "Plug-and-play on Windows 7/8/10/11",
      "Runs ~4 months on 2 AAA batteries (included)",
    ],
    pros: ["Ergonomic, wrist-friendly", "Adjustable DPI", "Extra buttons"],
    cons: ["Right-handed only", "Best for medium–large hands"],
    whoFor: "Anyone with wrist discomfort who wants a more ergonomic everyday mouse.",
    whyRecommend: "A vertical grip and adjustable DPI make long workdays easier on your wrist.",
    faqs: [
      { q: "Is it good for small hands?", a: "It's optimised for medium to large, right-handed palms; smaller hands may find it large." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["mouse", "vertical", "ergonomic", "amazon basics", "developer"],
    trending: true,
  },
  {
    name: "Razer Viper V3 Pro Wireless Gaming Mouse (54g)",
    slug: "razer-viper-v3-pro-wireless-mouse",
    brand: "Razer",
    category: "gaming",
    subcategory: "gaming-mice",
    imageUrl: "https://m.media-amazon.com/images/I/61BJ2MpgTTL._AC_SL1500_.jpg",
    imageAlt: "Razer Viper V3 Pro ultra-lightweight wireless esports gaming mouse in black",
    affiliateUrl: "https://amzn.to/3TMs0Mj",
    shortDescription:
      "Razer's pro-grade esports mouse — just 54g, a 35K DPI Focus Pro sensor, 8000Hz HyperPolling, Gen-3 optical switches and up to 95 hours of battery.",
    description:
      "Designed with world-class esports pros, the Viper V3 Pro weighs a featherlight 54g for swift, precise flicks. Its Focus Pro 35K optical sensor tracks flawlessly — even on glass — with 1-DPI adjustments for fine aim, while 8000Hz HyperPolling over HyperSpeed wireless keeps performance smooth even in noisy tournament halls. Gen-3 optical switches deliver 0.2ms actuation with no double-clicking, and the battery lasts up to 95 hours.",
    features: [
      "54g ultra-lightweight competitive design",
      "Focus Pro 35K optical sensor, 1-DPI steps",
      "True 8000Hz HyperPolling wireless",
      "HyperSpeed wireless — stable even in noisy arenas",
      "Gen-3 optical switches, 0.2ms, no double-click",
      "Up to 95 hours of battery life",
    ],
    pros: ["Ultra-light 54g", "Elite 35K sensor", "Long 95h battery"],
    cons: ["Premium price", "Minimalist — fewer buttons"],
    whoFor: "Competitive FPS players who want one of the best wireless gaming mice made.",
    whyRecommend: "It's a genuine top-tier esports mouse — light, fast and used by the pros.",
    faqs: [
      { q: "Does it work on a glass desk?", a: "Yes — the Focus Pro 35K sensor is designed to track on a wide range of surfaces, including glass." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["mouse", "gaming", "razer", "esports", "wireless"],
    featured: true,
    trending: true,
  },

  // ---------------------------------------------------------------- Monitor mounts
  {
    name: "VIVO Dual Monitor Desk Mount (13–30\", C-Clamp)",
    slug: "vivo-dual-monitor-desk-mount-stand-v002",
    brand: "VIVO",
    category: "developer-gear",
    subcategory: "monitor-mounts",
    imageUrl: "https://m.media-amazon.com/images/I/71MzRgGoXUL._AC_SL1500_.jpg",
    imageAlt: "VIVO heavy-duty dual monitor desk mount with C-clamp in black",
    affiliateUrl: "https://amzn.to/3TZH4Gk",
    shortDescription:
      "A heavy-duty steel dual-monitor arm holding two screens up to 30\" and 22 lbs each — full articulation, C-clamp or grommet mount, and a 3-year warranty.",
    description:
      "Free up your desk and get both monitors to the perfect height. This VIVO steel mount holds two screens from 13\" to 30\" (up to 22 lbs each) and offers +90°/-90° tilt, 180° swivel, 360° rotation and height adjustment along the pole — portrait or landscape. It clamps to desks up to 3.25\" thick (or uses the grommet option), routes cables along the arms, and is backed by a 3-year warranty.",
    features: [
      "Fits two 13–30\" screens, up to 22 lbs each",
      "+90°/-90° tilt, 180° swivel, 360° rotation",
      "Height-adjustable along the centre pole",
      "Heavy-duty C-clamp or grommet mounting",
      "VESA 75×75 / 100×100 with cable management",
      "Sturdy steel build — 3-year warranty",
    ],
    pros: ["Holds up to 22 lbs per arm", "Full articulation", "3-year warranty"],
    cons: ["Assembly required", "Heavy screens need a solid desk"],
    whoFor: "Dual-monitor users who want maximum weight capacity and adjustment.",
    whyRecommend: "One of the most capable dual mounts — big weight limit, full motion and a long warranty.",
    faqs: [
      { q: "How does it attach to my desk?", a: "Via a heavy-duty C-clamp for desks up to 3.25\" thick, or an included grommet mount option." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["monitor mount", "dual monitor", "vivo", "desk", "developer"],
    featured: true,
  },
  {
    name: "VIVO Dual Monitor Stand — Spring Arms (17–32\")",
    slug: "vivo-dual-monitor-spring-arm-stand",
    brand: "VIVO",
    category: "developer-gear",
    subcategory: "monitor-mounts",
    imageUrl: "https://m.media-amazon.com/images/I/712XH9EBijL._AC_SL1500_.jpg",
    imageAlt: "VIVO dual monitor stand with mechanical spring articulating arms in black",
    affiliateUrl: "https://amzn.to/4wvMYfL",
    shortDescription:
      "A mechanical spring-arm dual-monitor mount for 17–32\" screens — tool-free counterbalanced positioning, full articulation and a heavy-duty C-clamp.",
    description:
      "This VIVO stand uses mechanical spring arms so you can reposition each screen with a fingertip and it stays put — perfectly counterbalanced in any direction. It fits flat and curved screens from 17\" to 32\" (4.4–19.8 lbs each) with +90°/-90° tilt, 180° swivel and 360° rotation. Open-top VESA plates make monitors slide on easily, and the heavy-duty C-clamp or grommet mount frees up your whole desktop.",
    features: [
      "Fits two 17–32\" flat/curved screens, 4.4–19.8 lbs each",
      "Mechanical spring arms — tool-free repositioning",
      "+90°/-90° tilt, 180° swivel, 360° rotation",
      "Open-top VESA 75×75 / 100×100 slide-on plates",
      "Heavy-duty C-clamp or grommet mount",
      "Clears desk space by elevating both screens",
    ],
    pros: ["Effortless spring positioning", "Fits large 32\" screens", "Easy slide-on install"],
    cons: ["Arms extend past the desk edge", "Assembly required"],
    whoFor: "Anyone wanting smooth, gas-spring-style adjustment for two large monitors.",
    whyRecommend: "Spring arms make daily repositioning effortless — nudge a screen and it holds.",
    faqs: [
      { q: "Will it fit curved monitors?", a: "Yes — it's compatible with most 17–32\" flat and curved screens from 4.4 to 19.8 lbs each." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["monitor mount", "dual monitor", "vivo", "spring arm", "developer"],
  },
  {
    name: "HUANUO FlowLift Dual Monitor Stand (13–32\")",
    slug: "huanuo-flowlift-dual-monitor-stand",
    brand: "HUANUO",
    category: "developer-gear",
    subcategory: "monitor-mounts",
    imageUrl: "https://m.media-amazon.com/images/I/7182jSFV25L._AC_SL1500_.jpg",
    imageAlt: "HUANUO FlowLift full-motion dual monitor desk mount with dual C-clamp",
    affiliateUrl: "https://amzn.to/4qi0DFW",
    shortDescription:
      "A full-motion dual-monitor mount for 13–32\" screens with a reinforced dual-C-clamp base for rock-solid stability, one-hand adjustment and tidy cable routing.",
    description:
      "HUANUO's FlowLift is built around stability: an upgraded platform with a dual-C-clamp structure locks both arms firmly to your desk, so there's no wobble while you type, click or game. Move each screen with one hand — +85°/-50° tilt, ±90° swivel, 360° rotation and up to 15.75\" of height — to hit your natural line of sight and ease neck and back strain. Built-in cable management keeps the whole setup clean.",
    features: [
      "Fits two 13–32\" screens, 4.4–19.8 lbs each",
      "Reinforced dual-C-clamp base for stability",
      "One-hand full-motion adjustment",
      "+85°/-50° tilt, ±90° swivel, 360° rotation",
      "Raises screens up to 15.75\" for healthy posture",
      "VESA 75×75 / 100×100 with cable management",
    ],
    pros: ["Extra-stable dual clamp", "Smooth one-hand movement", "Good height range"],
    cons: ["Wooden desks only (0.59–3.54\" thick)", "Check VESA + weight before buying"],
    whoFor: "Dual-monitor users who prioritise a wobble-free, secure mount.",
    whyRecommend: "The dual-C-clamp base makes it noticeably steadier than single-clamp stands.",
    faqs: [
      { q: "What desks does it fit?", a: "Wooden desks 0.59–3.54\" thick without cross-beams underneath; glass or plastic desks aren't supported." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["monitor mount", "dual monitor", "huanuo", "desk", "developer"],
    trending: true,
  },

  // ---------------------------------------------------------------- Power / surge
  {
    name: "Amazon Basics Surge Protector Power Strip (6-Outlet)",
    slug: "amazon-basics-surge-protector-6-outlet",
    brand: "Amazon Basics",
    category: "accessories",
    subcategory: "power-surge",
    imageUrl: "https://m.media-amazon.com/images/I/61fRF3ebo3L._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics 6-outlet surge protector power strip in white",
    affiliateUrl: "https://amzn.to/4gb8hNA",
    shortDescription:
      "A dependable 6-outlet surge protector with 790 joules of protection, a 15-amp circuit breaker, an LED indicator and a 6ft cord.",
    description:
      "Protect your phones, lamps and small appliances from damaging power surges with this simple 6-outlet strip. It offers 790 joules of 3-line surge protection with a red LED that confirms protection is active, a 15-amp circuit breaker for added safety, and a 6-foot cord to reach where you need it. One transformer-spaced outlet leaves room for a bulky adapter.",
    features: [
      "6 outlets (1 transformer-spaced) for adapters",
      "790 joules of 3-line surge protection",
      "Red LED confirms active surge protection",
      "15-amp circuit breaker for safety",
      "6-foot 14 AWG extension cord",
      "1875 watts / 125 volts / 15 amps",
    ],
    pros: ["Trusted Amazon Basics", "Circuit breaker + LED", "Adapter-friendly spacing"],
    cons: ["No USB ports", "Entry-level 790J rating"],
    whoFor: "Anyone who wants basic, reliable surge protection for a desk or living room.",
    whyRecommend: "A safe, affordable staple to keep your electronics protected from surges.",
    faqs: [
      { q: "What does 790 joules mean?", a: "It's the amount of energy the strip can absorb from surges before wearing out — fine for phones, lamps and small electronics." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["surge protector", "power strip", "amazon basics", "home office", "accessories"],
  },
  {
    name: "Amazon Basics Wall-Mount Surge Protector (9-in-1, USB-C)",
    slug: "amazon-basics-wall-mount-surge-9-in-1",
    brand: "Amazon Basics",
    category: "accessories",
    subcategory: "power-surge",
    imageUrl: "https://m.media-amazon.com/images/I/51HeQ7pbw+L._AC_SL1500_.jpg",
    imageAlt: "Amazon Basics wall-mount 9-in-1 surge protector with USB-C in white",
    affiliateUrl: "https://amzn.to/4g8I0iT",
    shortDescription:
      "A wall-mounted 9-in-1 hub that turns one outlet into 6 AC outlets plus USB-C and USB-A — 1080 joules of protection and 20W fast charging in a fireproof shell.",
    description:
      "This clever wall-mount hub turns a single outlet into a whole charging station: 6 AC outlets, two USB-C ports and one USB-A port (sharing 20W), all with 1080 joules of surge protection. Widely spaced outlets fit bulky adapters, a fireproof shell adds safety, and comprehensive protection guards against over-heat, over-voltage, over-current and short circuits. USB-C fast charging takes an iPhone 17 from 10% to 50% in about 20 minutes.",
    features: [
      "9-in-1: 6 AC outlets + 2 USB-C + 1 USB-A",
      "1080 joules of surge protection",
      "20W USB-C fast charging (iPhone 10–50% in ~20 min)",
      "Widely spaced 1.6\" outlets for big adapters",
      "Wall-mountable, fits standard outlet spacings",
      "Fireproof shell + multi-layer safety protection",
    ],
    pros: ["Adds USB-C fast charging", "Space-saving wall mount", "Higher 1080J rating"],
    cons: ["3 USB ports share 20W", "No long cord — mounts at the outlet"],
    whoFor: "Anyone who wants to expand a wall outlet with both AC and USB-C charging.",
    whyRecommend: "It replaces a cluttered power block and adds fast USB-C charging in one neat unit.",
    faqs: [
      { q: "Can it fast-charge my phone?", a: "Yes — the USB-C ports deliver up to 20W, taking an iPhone 17 from 10% to 50% in around 20 minutes." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["surge protector", "wall mount", "usb-c", "amazon basics", "accessories"],
    featured: true,
  },
  {
    name: "Teiobar Surge Protector Power Strip (12 Outlets, 4 USB)",
    slug: "teiobar-surge-protector-12-outlet-4-usb",
    brand: "Teiobar",
    category: "accessories",
    subcategory: "power-surge",
    imageUrl: "https://m.media-amazon.com/images/I/71yS+m1YKnL._AC_SL1500_.jpg",
    imageAlt: "Teiobar 12-outlet surge protector power strip with 4 USB ports in black",
    affiliateUrl: "https://amzn.to/4wpZQEc",
    shortDescription:
      "A heavy-duty power hub with 12 AC outlets and 4 USB ports (2 USB-C), 2700 joules of surge protection, a 6ft cord and ETL safety certification.",
    description:
      "For a busy desk, dorm or workshop, this Teiobar strip does it all: 12 AC outlets (two widely spaced for large adapters) plus four USB ports — two of them USB-C — on a 6-foot heavy-duty cord. A strong 2700-joule rating with overload protection guards against spikes, smart USB charging picks the optimal speed for each device, and the flame-retardant PC shell is ETL safety-certified with a 12-month warranty.",
    features: [
      "12 AC outlets + 4 USB ports (2× USB-C)",
      "2700 joules of surge protection with overload cut-off",
      "2 widely spaced outlets for large adapters",
      "USB-A 2.4A max, USB-C 3A max with smart charging",
      "6-foot heavy-duty extension cord",
      "ETL-certified, flame-retardant shell, 12-month warranty",
    ],
    pros: ["Huge 12-outlet capacity", "High 2700J protection", "USB-C + smart charging"],
    cons: ["Large footprint", "Not for high-draw appliances"],
    whoFor: "Anyone powering a full workstation, dorm or entertainment setup from one strip.",
    whyRecommend: "Twelve outlets, four USB ports and a strong 2700J rating make it a true power hub.",
    faqs: [
      { q: "Is it safety certified?", a: "Yes — it's ETL safety-certified with overload protection and a flame-retardant shell, backed by a 12-month warranty." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["surge protector", "power strip", "usb-c", "teiobar", "accessories"],
    trending: true,
  },
];

export function amazonToData(p: AmazonProduct): Prisma.MarketProductUncheckedCreateInput {
  const price = PRICES_XAF[p.slug] ?? null;
  return {
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory,
    price,
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
