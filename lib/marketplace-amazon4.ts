import type { Prisma } from "@prisma/client";
import { COUNTRIES } from "@/lib/marketplace";

/**
 * Fourth batch of real Amazon affiliate products (home gym & fitness, office
 * furniture, storage and cleaning), added to NBN MARKET with the owner's exact
 * amzn.to tracking links. Every field — title, image, feature copy — is based on
 * the live Amazon product page.
 *
 * Prices are the real amounts Amazon displayed at listing time, captured in XAF
 * (the same currency as the rest of the store) so the storefront's live currency
 * conversion localizes them per visitor. Amazon prices change, so the
 * "Buy on Amazon" button always links to the live listing for the exact current
 * price. One item is sold via "buying options" (no single featured price) and
 * keeps a null price. We never fabricate prices, ratings, reviews or stock.
 *
 * Availability: the amzn.to short links are OneLink-enabled, so a single link
 * routes each visitor to their local Amazon store and earns globally — marked
 * available across every supported country (platform "Amazon").
 */

type AmazonProduct4 = {
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

export const AMAZON_PICKS_4: AmazonProduct4[] = [
  // ---------------------------------------------------------------- Fitness & home gym
  {
    name: "WHATAFIT Resistance Bands Set with Handles (150 lb)",
    slug: "whatafit-resistance-bands-set",
    brand: "WHATAFIT",
    category: "fitness",
    subcategory: "resistance-bands",
    price: 12736,
    imageUrl: "https://m.media-amazon.com/images/I/716FpX+hctL._AC_SL1200_.jpg",
    imageAlt: "WHATAFIT resistance bands set with handles, ankle straps and door anchor",
    affiliateUrl: "https://amzn.to/4cgUXWU",
    shortDescription:
      "A complete natural-latex resistance band set — 5 stackable bands (10–50 lb, up to 150 lb), cushioned handles, ankle straps, a door anchor and a carry pouch.",
    description:
      "A full home-gym kit in a small pouch. Five colour-coded natural-latex bands rate at 10, 20, 30, 40 and 50 lb and stack up to 150 lb of resistance, so you can progress from light stretching to serious strength work. Steel carabiners, reinforced nylon webbing and non-slip cushioned handles keep everything secure, and the included ankle straps and door anchor open up dozens of upper-body, lower-body and core exercises anywhere.",
    features: [
      "5 stackable bands: 10/20/30/40/50 lb (up to 150 lb)",
      "High-density natural latex, consistent elasticity",
      "Steel carabiners + non-slip cushioned handles",
      "Includes 2 ankle straps and a door anchor",
      "Carry pouch + exercise guide included",
      "For strength, yoga, Pilates and mobility",
    ],
    pros: ["Full kit with accessories", "Stacks to 150 lb", "Packs away for travel"],
    cons: ["Latex (not for allergies)", "Door anchor needs a solid door"],
    whoFor: "Anyone building a versatile home or travel workout without bulky machines.",
    whyRecommend: "It replaces a rack of dumbbells with a compact, progressive, do-anywhere kit.",
    faqs: [
      { q: "Can beginners use it?", a: "Yes — start with a single light band and stack more as you get stronger, up to 150 lb." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["resistance bands", "fitness", "home gym", "whatafit", "workout"],
    featured: true,
    trending: true,
  },
  {
    name: "Pull-Up Assist & Resistance Bands Set (5-Pack)",
    slug: "pull-up-assist-resistance-bands-set",
    brand: "NBN Pick",
    category: "fitness",
    subcategory: "resistance-bands",
    price: 13844,
    imageUrl: "https://m.media-amazon.com/images/I/71ALgXGX21L._AC_SL1500_.jpg",
    imageAlt: "Set of 5 long loop pull-up assist resistance bands with carry bag",
    affiliateUrl: "https://amzn.to/3TWRKpc",
    shortDescription:
      "A 5-band set of long loop resistance bands (5–125 lb) for assisted pull-ups, strength training, stretching and physical therapy — natural latex, odorless and durable.",
    description:
      "These long loop bands are built for pulling, assisting and stretching. Five graduated bands cover 5–15, 15–35, 25–65, 35–85 and 50–125 lb, so you can assist pull-ups and chin-ups, add resistance to rows and presses, or support rehab and mobility work. Made from 100% natural latex with double-layered tubing, they're non-toxic, odorless, anti-slip and built to last. A carry bag and workout guide are included.",
    features: [
      "5 bands: 5–15 to 50–125 lb resistance",
      "Assist pull-ups, chin-ups and dips",
      "Add resistance to rows, presses and squats",
      "100% natural latex, double-layered tubing",
      "Non-toxic, odorless and anti-slip",
      "Carry bag + workout guide included",
    ],
    pros: ["Great for assisted pull-ups", "Wide resistance range", "Durable latex"],
    cons: ["Latex material", "Loop style (no handles)"],
    whoFor: "Anyone training pull-ups or wanting versatile resistance for strength and rehab.",
    whyRecommend: "A simple, durable band set that makes pull-ups achievable and adds resistance anywhere.",
    faqs: [
      { q: "Can these help me do pull-ups?", a: "Yes — loop them over the bar and step in; the band takes some of your weight to assist the movement." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["resistance bands", "pull up bands", "fitness", "home gym", "workout"],
  },
  {
    name: "CHRLEISURE High-Waisted Tummy-Control Leggings with Pockets",
    slug: "chrleisure-tummy-control-leggings-pockets",
    brand: "CHRLEISURE",
    category: "fitness",
    subcategory: "activewear",
    price: 23077,
    imageUrl: "https://m.media-amazon.com/images/I/71BQpA02w1L._AC_SL1500_.jpg",
    imageAlt: "CHRLEISURE high-waisted tummy-control workout yoga leggings with pockets",
    affiliateUrl: "https://amzn.to/3SBBbPf",
    shortDescription:
      "High-waisted tummy-control workout leggings with side pockets — a soft, stretchy, squat-proof fit for yoga, the gym and everyday wear.",
    description:
      "Comfortable, flattering leggings that work as hard as you do. The high waistband gives gentle tummy control and stays put through squats and stretches, while side pockets hold your phone and keys during a workout or a busy day. The soft, four-way-stretch fabric moves with you for yoga, running, the gym or lounging — a versatile everyday staple.",
    features: [
      "High-waisted with gentle tummy control",
      "Functional side pockets for phone & keys",
      "Soft, four-way-stretch, squat-proof fabric",
      "Stays in place through workouts",
      "Versatile for yoga, gym and everyday wear",
      "Flattering, comfortable fit",
    ],
    pros: ["Handy side pockets", "Tummy-control waistband", "Soft and stretchy"],
    cons: ["Check the size chart", "Colour/finish varies by option"],
    whoFor: "Anyone who wants comfortable, pocketed leggings for workouts and daily wear.",
    whyRecommend: "Tummy control plus real pockets makes them a genuinely practical everyday legging.",
    faqs: [
      { q: "Are they squat-proof?", a: "The thick, high-waisted stretch fabric is designed to stay opaque and in place during squats and stretches." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["leggings", "activewear", "yoga pants", "fitness", "chrleisure"],
  },
  {
    name: "Gaiam Yoga Bolster Pillow",
    slug: "gaiam-yoga-bolster-pillow",
    brand: "Gaiam",
    category: "fitness",
    subcategory: "yoga",
    price: 27111,
    imageUrl: "https://m.media-amazon.com/images/I/81SQ8qfG2iL._AC_SL1500_.jpg",
    imageAlt: "Gaiam cotton-filled yoga bolster pillow with carry handle",
    affiliateUrl: "https://amzn.to/3SxSbpx",
    shortDescription:
      "A firm, cotton-filled yoga bolster that supports restorative poses, stretching and meditation — with a carry handle and a machine-washable cover.",
    description:
      "A supportive prop for restorative yoga and relaxation. Filled with firm natural cotton batting, this Gaiam bolster cushions and supports your body through restorative poses, deep stretches and meditation, helping you relax more fully and hold positions comfortably. A sturdy handle makes it easy to carry, and the removable cover is machine washable.",
    features: [
      "Firm natural cotton-batting fill",
      "Supports restorative poses & stretching",
      "Great for meditation and relaxation",
      "Sturdy carry handle",
      "Removable, machine-washable cover",
      "Trusted Gaiam yoga brand",
    ],
    pros: ["Firm, genuine support", "Washable cover", "Easy to carry"],
    cons: ["Bulky to store", "Cotton fill is heavier than foam"],
    whoFor: "Yoga practitioners who want proper support for restorative and deep-stretch work.",
    whyRecommend: "A quality, firm bolster makes restorative yoga far more comfortable and effective.",
    faqs: [
      { q: "Can I wash it?", a: "Yes — the cover is removable and machine washable." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["yoga bolster", "yoga", "fitness", "gaiam", "meditation"],
  },
  {
    name: "Vibration Plate Exercise Machine (200W, Bluetooth)",
    slug: "vibration-plate-exercise-machine-200w",
    brand: "AXV",
    category: "fitness",
    subcategory: "gym-equipment",
    price: 51931,
    imageUrl: "https://m.media-amazon.com/images/I/71kwg999QyL._AC_SL1500_.jpg",
    imageAlt: "Curved vibration plate exercise machine with Bluetooth, bands and handles",
    affiliateUrl: "https://amzn.to/3TVnRpi",
    shortDescription:
      "A whole-body vibration plate with a curved anti-slip deck, 200W motor, speeds 1–120, Bluetooth music, an LED display, remote and resistance bands.",
    description:
      "Add whole-body vibration training to your routine in just 10 minutes a day. This plate creates full-body vibrations that stimulate muscle contractions to support toning, circulation and recovery, with adjustable speeds from 1 to 120 and two resistance bands for upper- and lower-body work. Bluetooth lets you play music through it, an LED display shows time, speed and calories, and it's compact with an anti-slip surface, remote control and user manual included.",
    features: [
      "Whole-body vibration, speeds 1–120",
      "Powerful 200W motor, curved anti-slip deck",
      "2 resistance bands for upper/lower body",
      "Bluetooth music + LED time/speed/calorie display",
      "Remote control included",
      "Compact and easy to store",
    ],
    pros: ["Low-impact whole-body workout", "Quick 10-minute sessions", "Bands + remote included"],
    cons: ["Not a substitute for cardio", "Heavier item to move"],
    whoFor: "Anyone wanting a low-impact way to tone, recover and boost circulation at home.",
    whyRecommend: "A compact, feature-packed vibration plate that fits short, low-impact daily sessions.",
    faqs: [
      { q: "How long are the workouts?", a: "You can complete a session in around 10 minutes a day, adjusting the speed to your level." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["vibration plate", "fitness", "home gym", "toning", "low impact"],
    trending: true,
  },
  {
    name: "Tangle-Free Speed Jump Rope with Ball Bearings",
    slug: "tangle-free-speed-jump-rope",
    brand: "NBN Pick",
    category: "fitness",
    subcategory: "cardio",
    price: 5188,
    imageUrl: "https://m.media-amazon.com/images/I/71wm42EtoNL._AC_SL1500_.jpg",
    imageAlt: "Adjustable tangle-free speed jump rope with foam handles and ball bearings",
    affiliateUrl: "https://amzn.to/4bN24pZ",
    shortDescription:
      "An adjustable, tangle-free speed rope with ball bearings and ergonomic foam handles — a cheap, effective cardio tool for home, gym or travel.",
    description:
      "Simple, effective cardio that fits in your pocket. A PVC-coated steel cable with built-in ball bearings spins fast and smooth without tangling, and the adjustable length suits kids and adults alike. Ergonomic foam handles are soft, non-slip and moisture-wicking so your grip stays comfortable and dry through fast sets. Great for burning calories, building stamina and warming up anywhere.",
    features: [
      "Ball-bearing system for fast, smooth spins",
      "Tangle-free PVC-coated steel cable",
      "Adjustable length for kids and adults",
      "Ergonomic non-slip foam handles",
      "Great for cardio, HIIT and warm-ups",
      "Lightweight and pocket-portable",
    ],
    pros: ["Very affordable", "Smooth, fast rotation", "Adjustable length"],
    cons: ["Basic (no counter)", "Cable may need trimming to size"],
    whoFor: "Anyone who wants cheap, effective cardio they can do anywhere.",
    whyRecommend: "A smooth, tangle-free speed rope is one of the best-value cardio tools you can buy.",
    faqs: [
      { q: "Can I adjust the length?", a: "Yes — the rope length is adjustable to suit your height, for both kids and adults." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["jump rope", "cardio", "fitness", "home gym", "workout"],
  },
  {
    name: "Zeerun Adjustable Weighted Vest (6–30 lb)",
    slug: "zeerun-adjustable-weighted-vest",
    brand: "Zeerun",
    category: "fitness",
    subcategory: "gym-equipment",
    price: 8650,
    imageUrl: "https://m.media-amazon.com/images/I/81zh-RIi18L._AC_SL1500_.jpg",
    imageAlt: "Zeerun adjustable weighted vest with reflective stripe for rucking and training",
    affiliateUrl: "https://amzn.to/4wYtTUC",
    shortDescription:
      "A comfortable neoprene weighted vest with a reflective stripe and adjustable buckle — for walking, running, rucking and strength training.",
    description:
      "Add intensity to any workout with this Zeerun weighted vest. Skin-friendly neoprene with strong internal sealing keeps the weight secure without chafing or leaking, and double-stitched reinforced seams handle rigorous movement. Thickened shoulder pads spread the load, while an elastic band and adjustable buckle keep it snug and shake-free. A reflective stripe adds visibility, and several weight options let you progress as you get stronger.",
    features: [
      "Skin-friendly neoprene, no chafing or leaks",
      "Double-stitched reinforced seams",
      "Thickened shoulder pads spread the load",
      "Elastic band + adjustable buckle for snug fit",
      "Reflective stripe for low-light visibility",
      "Multiple weight options to progress",
    ],
    pros: ["Comfortable, snug fit", "Boosts any workout", "Reflective for safety"],
    cons: ["Fixed weight per vest", "Check the weight before buying"],
    whoFor: "Walkers, runners and lifters who want to add resistance to everyday training.",
    whyRecommend: "A comfortable, secure vest is the simplest way to level up walks, runs and calisthenics.",
    faqs: [
      { q: "Is the weight adjustable?", a: "The vest is sold in set weights (6–30 lb options); the fit is adjustable via the buckle and elastic band." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["weighted vest", "rucking", "fitness", "zeerun", "strength training"],
    trending: true,
  },
  {
    name: "NICEPEOPLE Adjustable Foldable Weight Bench (660 lb)",
    slug: "nicepeople-adjustable-weight-bench",
    brand: "NICEPEOPLE",
    category: "fitness",
    subcategory: "gym-equipment",
    price: 36350,
    imageUrl: "https://m.media-amazon.com/images/I/719zG2ZrQzL._AC_SL1500_.jpg",
    imageAlt: "NICEPEOPLE adjustable foldable weight bench with 8 backrest angles",
    affiliateUrl: "https://amzn.to/4x5wgoY",
    shortDescription:
      "A sturdy adjustable weight bench with 8 backrest angles and a 660 lb capacity — foldable and compact for small-space home gyms.",
    description:
      "A versatile bench for a complete home strength setup. Eight backrest angles cover incline, flat and decline work so you can target chest, shoulders, arms and core, and a long 29.3\" backrest supports about 90% of users comfortably. Built from alloy steel with a reinforced triangular frame and tested through 8,000+ cycles, it holds up to 660 lb with non-slip leveling feet. When you're done, remove two pins and it folds flat to store under a bed or in a corner.",
    features: [
      "8 backrest angles: incline, flat, decline",
      "660 lb capacity, reinforced steel frame",
      "Long 29.3\" backrest fits ~90% of users",
      "Non-slip breathable, easy-clean padding",
      "1-step fold; compact 30.7 × 16.3 × 9.25\" folded",
      "4 rotatable leveling feet reduce wobble",
    ],
    pros: ["High 660 lb capacity", "Folds flat to store", "Many angles for full-body work"],
    cons: ["Assembly required", "No leg-developer attachment"],
    whoFor: "Home lifters in small spaces who want a strong, foldable adjustable bench.",
    whyRecommend: "Gym-grade capacity and eight angles in a bench that folds away when you're done.",
    faqs: [
      { q: "Does it fold for storage?", a: "Yes — remove two pins and it folds to a compact size for under a bed or in a corner." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["weight bench", "home gym", "fitness", "strength training", "foldable"],
    featured: true,
  },
  {
    name: "FitBeast Grip Strengthener Kit (5-Pack)",
    slug: "fitbeast-grip-strengthener-kit",
    brand: "FitBeast",
    category: "fitness",
    subcategory: "gym-equipment",
    price: 9804,
    imageUrl: "https://m.media-amazon.com/images/I/718tBdzFF6L._AC_SL1500_.jpg",
    imageAlt: "FitBeast hand grip strengthener kit, 5-pack with adjustable resistance",
    affiliateUrl: "https://amzn.to/4wYhvUF",
    shortDescription:
      "A 5-piece hand and forearm strengthener kit with adjustable resistance and an ergonomic, non-slip grip — for training, rehab and stress relief.",
    description:
      "Build grip and forearm strength anywhere with this 5-piece FitBeast kit. An adjustable-resistance gripper lets you progress from beginner to advanced, while finger exercisers, a grip ring and a stress ball round out the set. The contoured, textured, non-slip handles fit comfortably in your palm to reduce strain, and the compact design travels easily — great for athletes, musicians, office workers and hand or wrist rehabilitation.",
    features: [
      "5-piece grip & forearm training set",
      "Adjustable resistance from beginner to advanced",
      "Ergonomic contoured, non-slip handles",
      "Aids rehab and improves dexterity",
      "Compact and travel-friendly",
      "For sports, music, work and stress relief",
    ],
    pros: ["Complete 5-piece kit", "Adjustable resistance", "Good for rehab too"],
    cons: ["Niche training focus", "Small parts"],
    whoFor: "Athletes, climbers, musicians and anyone rehabbing or building grip strength.",
    whyRecommend: "A cheap, complete kit that builds grip strength and aids hand recovery anywhere.",
    faqs: [
      { q: "Is the resistance adjustable?", a: "Yes — the main gripper adjusts from beginner to advanced so you can progress over time." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["grip strengthener", "forearm", "fitness", "fitbeast", "rehab"],
  },
  {
    name: "Trideer Exercise & Yoga Ball with Pump",
    slug: "trideer-exercise-yoga-ball",
    brand: "Trideer",
    category: "fitness",
    subcategory: "yoga",
    price: 9804,
    imageUrl: "https://m.media-amazon.com/images/I/61XRN-EDViL._AC_SL1500_.jpg",
    imageAlt: "Trideer anti-burst exercise and yoga stability ball with quick pump",
    affiliateUrl: "https://amzn.to/4xFUcis",
    shortDescription:
      "An anti-slip, anti-burst stability ball (holds up to 330 lb) for yoga, Pilates, core training, pregnancy prep and active sitting — quick pump included.",
    description:
      "A do-it-all stability ball for exercise and posture. Anti-slip stripes and a frosted texture keep it steady during yoga, Pilates, balance and core work, while the burst-resistant PVC (California Prop 65 compliant) holds up to 330 lb and releases air slowly for safety if punctured. It doubles as an active-sitting office chair to ease back strain from long desk hours, and comes with a quick-inflation pump, two air stoppers and instructions in five sizes.",
    features: [
      "Anti-slip stripes + frosted texture for grip",
      "Burst-resistant, holds up to 330 lb",
      "Non-toxic PVC, Prop 65 compliant",
      "For yoga, Pilates, core and pregnancy prep",
      "Doubles as an active-sitting office chair",
      "Quick pump + 2 air stoppers, 5 sizes",
    ],
    pros: ["Anti-burst safety", "Great for posture too", "Pump included"],
    cons: ["Pick the right size for your height", "Needs occasional re-inflation"],
    whoFor: "Anyone doing yoga, Pilates, core work, birthing prep or wanting active sitting.",
    whyRecommend: "A safe, grippy, well-made ball that works for workouts and desk posture alike.",
    faqs: [
      { q: "What size should I get?", a: "It comes in five sizes to fit different heights; check the size chart on the listing and pump to firm." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["yoga ball", "stability ball", "fitness", "trideer", "core"],
  },
  {
    name: "Gaiam Yoga Block (Latex-Free EVA Foam)",
    slug: "gaiam-yoga-block-eva-foam",
    brand: "Gaiam",
    category: "fitness",
    subcategory: "yoga",
    price: null,
    imageUrl: "https://m.media-amazon.com/images/I/81xT4xrd3eL._AC_SL1500_.jpg",
    imageAlt: "Gaiam latex-free EVA foam yoga block with beveled edges",
    affiliateUrl: "https://amzn.to/4wtXrbP",
    shortDescription:
      "A supportive latex-free EVA foam yoga block with a non-slip surface and beveled edges — for alignment, deeper poses and added stability.",
    description:
      "A yoga essential that helps you practise safely. This Gaiam block provides the stability and balance you need for optimal alignment, deeper poses and increased strength. The durable foam — 50% denser than standard EVA blocks — has a non-slip surface and beveled edges for easy gripping. Place it under your hands, feet or seat to modify poses to your flexibility and extend your stretches without risking injury.",
    features: [
      "Supportive, 50%-denser EVA foam",
      "Non-slip surface with beveled edges",
      "Aids alignment and deeper poses",
      "Use under hands, feet or seat",
      "Lightweight and easy to grip",
      "Latex-free",
    ],
    pros: ["Denser than standard blocks", "Non-slip beveled grip", "Trusted Gaiam brand"],
    cons: ["Single block (many use two)", "Foam can dent over time"],
    whoFor: "Yoga practitioners of any level who want support for alignment and deeper poses.",
    whyRecommend: "A denser, grippier block gives more reliable support than cheap foam alternatives.",
    faqs: [
      { q: "Do I need one or two?", a: "Many poses use a pair, but one block is enough to start modifying and supporting poses." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["yoga block", "yoga", "fitness", "gaiam", "alignment"],
  },
  {
    name: "HPYGN Exercise Cable Handles (Pair)",
    slug: "hpygn-exercise-cable-handles",
    brand: "HPYGN",
    category: "fitness",
    subcategory: "gym-equipment",
    price: 5765,
    imageUrl: "https://m.media-amazon.com/images/I/81MrcTHj7qL._AC_SL1500_.jpg",
    imageAlt: "HPYGN heavy-duty exercise cable machine handles, replacement grips",
    affiliateUrl: "https://amzn.to/4wTr2fG",
    shortDescription:
      "Heavy-duty replacement exercise handles for cable machines, resistance bands and home gyms — wide, comfortable grips that hold up to 260 kg.",
    description:
      "Upgrade or replace worn handles across your gym gear. These HPYGN handles fit cable machines, weight pulleys, resistance bands, Pilates reformers and functional trainers, so you can use one comfortable pair everywhere. Braided nylon straps with triple stitching hold up to 260 kg, and the extra-wide, ergonomically shaped grips give a firm, comfortable hold for pushes and pulls without digging into your hands.",
    features: [
      "Fit cable machines, bands & home gyms",
      "Heavy-duty — hold up to 260 kg",
      "Braided nylon straps, triple-stitched",
      "Extra-wide ergonomic grips",
      "Comfortable for pushes and pulls",
      "Great replacement for worn handles",
    ],
    pros: ["Very affordable upgrade", "Strong and durable", "Universal compatibility"],
    cons: ["Handles only (no cable)", "Basic accessory"],
    whoFor: "Anyone with a cable machine or bands who wants comfier, tougher handles.",
    whyRecommend: "A cheap, durable upgrade that makes every cable and band exercise more comfortable.",
    faqs: [
      { q: "Will they fit my machine?", a: "Yes — they're designed to integrate with most cable machines, pulleys, bands and functional trainers." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["cable handles", "gym accessories", "fitness", "hpygn", "home gym"],
  },
  {
    name: "VINSGUIR Ab Roller Wheel with Knee Pad",
    slug: "vinsguir-ab-roller-wheel",
    brand: "VINSGUIR",
    category: "fitness",
    subcategory: "gym-equipment",
    price: 13844,
    imageUrl: "https://m.media-amazon.com/images/I/71CH7yY6m2L._AC_SL1497_.jpg",
    imageAlt: "VINSGUIR dual-wheel ab roller with knee pad for core training",
    affiliateUrl: "https://amzn.to/4hyEzo9",
    shortDescription:
      "A stable 3.2\" dual-wheel ab roller with a knee pad — targets abs, core and back, holds up to 440 lb, and travels anywhere for home workouts.",
    description:
      "Build a stronger core with this VINSGUIR ab roller. The 3.2\" dual-wheel design adds stability over single-wheel rollers, so rollouts feel controlled rather than wobbly, and the included knee pad protects your joints. It targets your abs, hip flexors and back to strengthen your core while lowering injury risk, and the high-strength stainless steel shaft holds up to 440 lb. Compact and portable, it works at home, the office or outdoors.",
    features: [
      "Stable 3.2\" dual-wheel design",
      "Knee pad included for comfort",
      "Targets abs, hip flexors and back",
      "Stainless steel shaft holds up to 440 lb",
      "Non-slip EVA foam handles",
      "Compact and portable",
    ],
    pros: ["More stable than single wheel", "Knee pad included", "Strong and portable"],
    cons: ["Challenging for beginners", "Core-focused only"],
    whoFor: "Anyone wanting an effective, low-cost core and ab workout at home.",
    whyRecommend: "The dual-wheel design makes ab rollouts steadier and more beginner-friendly.",
    faqs: [
      { q: "Is it good for beginners?", a: "The dual wheels add stability; start with small rollouts or from your knees and build up." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["ab roller", "core", "fitness", "vinsguir", "home gym"],
    trending: true,
  },

  // ---------------------------------------------------------------- Office furniture
  {
    name: "Flash Furniture Mid-Back Mesh Office Desk Chair",
    slug: "flash-furniture-mid-back-office-chair",
    brand: "Flash Furniture",
    category: "home-office",
    subcategory: "office-chairs",
    price: 80755,
    imageUrl: "https://m.media-amazon.com/images/I/7124sGrUyvL._AC_SL1500_.jpg",
    imageAlt: "Flash Furniture mid-back black mesh swivel office desk chair with flip-up arms",
    affiliateUrl: "https://amzn.to/3TWc0az",
    shortDescription:
      "An ergonomic mid-back office chair with a ventilated mesh back, built-in lumbar support, a padded LeatherSoft seat, flip-up arms and tilt-lock adjustment.",
    description:
      "A comfortable, commercial-grade chair for home or office. The ventilated curved mesh back with integrated lumbar support prevents overheating and promotes better posture, while the padded LeatherSoft waterfall seat relieves pressure on your legs. A pneumatic height-adjustable seat swivels 360°, the tilt-lock with tension lets you recline how you like, and flip-up armrests tuck away to save space. It assembles quickly with the included tools.",
    features: [
      "Ventilated mesh back with lumbar support",
      "Padded LeatherSoft waterfall seat",
      "Pneumatic height adjust + 360° swivel",
      "Tilt-lock with adjustable tilt tension",
      "Flip-up armrests to save space",
      "Commercial-grade; easy assembly",
    ],
    pros: ["Breathable, supportive back", "Flip-up arms save space", "Commercial-grade build"],
    cons: ["Mid-back (not full headrest)", "Assembly required"],
    whoFor: "Anyone who wants an affordable, breathable, supportive chair for desk work.",
    whyRecommend: "Mesh comfort, lumbar support and flip-up arms make it a strong-value work chair.",
    faqs: [
      { q: "Does the back have lumbar support?", a: "Yes — the curved mesh back has integrated lumbar support to promote better posture." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["office chair", "home office", "desk chair", "flash furniture", "ergonomic"],
    featured: true,
  },
  {
    name: "3-Drawer Fluted Mobile Filing Cabinet with Lock (Oak)",
    slug: "3-drawer-fluted-mobile-filing-cabinet-oak",
    brand: "NBN Pick",
    category: "home-office",
    subcategory: "filing-cabinets",
    price: 69243,
    imageUrl: "https://m.media-amazon.com/images/I/8127uT6ZAcL._AC_SL1500_.jpg",
    imageAlt: "Oak 3-drawer fluted mobile filing cabinet with lock and printer stand top",
    affiliateUrl: "https://amzn.to/4wYG04h",
    shortDescription:
      "A rolling 3-drawer wooden filing cabinet with a lock — two supply drawers, a Letter/A4 file drawer, an open shelf and a printer-ready top that holds 150 lb.",
    description:
      "A stylish, functional filing cabinet for a tidy home office. Two top drawers hold supplies and daily essentials, while the bottom drawer runs on rails for Letter and A4 hanging files. An open shelf and a spacious top (rated to 150 lb) hold a printer or other devices. Scratch- and stain-resistant wood wipes clean, one lock with two keys secures all three drawers, and locking wheels let you roll it under or beside the desk and keep it steady.",
    features: [
      "3 drawers: 2 supply + 1 Letter/A4 file",
      "Open shelf + printer-ready top (holds 150 lb)",
      "Lock with 2 keys secures all drawers",
      "Scratch- & stain-resistant wood",
      "Locking wheels for easy, stable rolling",
      "Fits beside or under a desk",
    ],
    pros: ["Doubles as a printer stand", "Lockable for security", "Rolls and locks"],
    cons: ["Assembly required", "Engineered wood, not solid"],
    whoFor: "Home-office workers who want lockable, rolling storage plus a printer stand.",
    whyRecommend: "It combines files, supply drawers and a printer stand in one lockable, mobile unit.",
    faqs: [
      { q: "Does it lock?", a: "Yes — one lock with two keys secures all three drawers." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["filing cabinet", "home office", "printer stand", "storage", "lockable"],
  },
  {
    name: "3-Drawer Fluted Rolling File Cabinet & Printer Stand (Oak)",
    slug: "3-drawer-fluted-rolling-file-cabinet-oak",
    brand: "NBN Pick",
    category: "home-office",
    subcategory: "filing-cabinets",
    price: 57701,
    imageUrl: "https://m.media-amazon.com/images/I/81R95GksgoL._AC_SL1500_.jpg",
    imageAlt: "Oak 3-drawer fluted rolling file cabinet and printer stand for home office",
    affiliateUrl: "https://amzn.to/4i5fBwP",
    shortDescription:
      "A rolling 3-drawer wooden file cabinet and printer stand with a lock — organises books, documents and supplies beside or under your desk, holds up to 100 lb.",
    description:
      "Keep your workspace tidy with this mobile wooden file cabinet. Three drawers organise books, documents, supplies and collectibles, and it slots neatly beside or under the desk to free up your desktop. Locking wheels make it easy to reposition and keep it stable when parked, one lock with two keys secures all three drawers, and the scratch- and stain-resistant wood (rated to 100 lb) wipes clean. Clear illustrated instructions make assembly simple.",
    features: [
      "3 drawers for documents, books & supplies",
      "Lock with 2 keys secures all drawers",
      "Locking wheels for mobility and stability",
      "Doubles as a printer stand",
      "Scratch- & stain-resistant wood (holds 100 lb)",
      "Fits beside or under a desk",
    ],
    pros: ["Lockable and mobile", "Printer-stand top", "Tidy, space-saving"],
    cons: ["Assembly required", "Lower 100 lb top capacity"],
    whoFor: "Home offices needing compact, lockable rolling storage under the desk.",
    whyRecommend: "A tidy, lockable rolling cabinet that doubles as a printer stand under your desk.",
    faqs: [
      { q: "How much can the top hold?", a: "The top supports up to 100 lb — enough for most home printers and devices." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["filing cabinet", "home office", "printer stand", "storage", "rolling"],
  },
  {
    name: "2-Drawer Metal Vertical File Cabinet with Lock",
    slug: "2-drawer-metal-vertical-file-cabinet",
    brand: "NBN Pick",
    category: "home-office",
    subcategory: "filing-cabinets",
    price: 51931,
    imageUrl: "https://m.media-amazon.com/images/I/61RnEQk+CLL._AC_SL1500_.jpg",
    imageAlt: "Black steel 2-drawer vertical locking file cabinet for home office",
    affiliateUrl: "https://amzn.to/4xIojpB",
    shortDescription:
      "A heavy-duty steel 2-drawer vertical file cabinet with a central lock, anti-tip safety and smooth full-extension ball-bearing slides — for Letter, Legal and A4.",
    description:
      "Secure, organised document storage that lasts. This steel 2-drawer cabinet fits Letter, Legal and A4 hanging folders, with adjustable file rails to customise the layout. A reinforced, powder-coated frame resists scratches and rust, a central lock protects confidential files, and an anti-tip mechanism only lets one drawer open at a time for safety. Full-extension ball-bearing slides glide open smoothly and silently so you can reach files at the very back.",
    features: [
      "Fits Letter, Legal and A4 hanging files",
      "Heavy-duty powder-coated steel build",
      "Central lock secures both drawers",
      "Anti-tip safety (one drawer opens at a time)",
      "Full-extension, silent ball-bearing slides",
      "Adjustable file hanging rails",
    ],
    pros: ["Sturdy metal build", "Lockable & anti-tip", "Smooth full-extension drawers"],
    cons: ["Assembly required", "Heavier to move"],
    whoFor: "Anyone needing secure, durable document storage for a home or office.",
    whyRecommend: "Metal durability, a lock and anti-tip safety make it a serious filing upgrade.",
    faqs: [
      { q: "What file sizes fit?", a: "Each drawer accommodates Letter, Legal and A4 hanging folders, with adjustable rails." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["filing cabinet", "metal", "home office", "lockable", "storage"],
  },
  {
    name: "Flat-Plug Extension Cord Power Strip with USB-C (5 ft)",
    slug: "flat-plug-extension-cord-usb-c-power-strip",
    brand: "HANYCONY",
    category: "accessories",
    subcategory: "power-surge",
    price: 5753,
    imageUrl: "https://m.media-amazon.com/images/I/518tiMuntLL._AC_SL1500_.jpg",
    imageAlt: "HANYCONY flat-plug extension cord power strip with 4 outlets and 4 USB ports",
    affiliateUrl: "https://amzn.to/4fSoNTW",
    shortDescription:
      "An 8-in-1 flat-plug extension cord with 4 widely-spaced outlets and 4 USB ports (2 USB-C) on a 5 ft cord — compact, ETL-listed and cruise-friendly.",
    description:
      "Charge up to 8 devices from one slim strip. Four widely-spaced AC outlets (15A/1875W) fit bulky adapters without blocking each other, and four USB ports — two of them USB-C — add fast device charging. The flat plug and 5 ft cord tuck neatly behind desks and beds, and because it has no surge protection, it's one of the few strips allowed on cruise ships. It's ETL and RoHS certified with overload, short-circuit and overheating protection.",
    features: [
      "4 AC outlets (15A/1875W) + 4 USB (2 USB-C)",
      "Widely-spaced outlets fit big adapters",
      "Flat plug + 5 ft cord for tight spaces",
      "Cruise-ship friendly (no surge protection)",
      "ETL & RoHS certified, multi-safety protection",
      "Great for dorm, office, home and travel",
    ],
    pros: ["Charges 8 devices", "Flat plug + USB-C", "Cruise-approved"],
    cons: ["No surge protection", "5 ft cord length"],
    whoFor: "Students, travellers and desk users who need outlets plus USB in one compact strip.",
    whyRecommend: "Outlets and USB-C in a flat-plug, cruise-legal strip make it a versatile everyday pick.",
    faqs: [
      { q: "Can I take it on a cruise?", a: "Yes — it has no surge protection, which is exactly what cruise lines require." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["extension cord", "power strip", "usb-c", "accessories", "travel"],
  },

  // ---------------------------------------------------------------- Storage & organization
  {
    name: "Sakugi 5-Tier Heavy-Duty Storage Shelves (1,000 lb)",
    slug: "sakugi-5-tier-storage-shelves",
    brand: "Sakugi",
    category: "storage-organization",
    subcategory: "garage-storage",
    price: 31733,
    imageUrl: "https://m.media-amazon.com/images/I/71on9WAB0KL._AC_SL1500_.jpg",
    imageAlt: "Sakugi 5-tier heavy-duty black metal storage shelving unit",
    affiliateUrl: "https://amzn.to/4g7BZDg",
    shortDescription:
      "A 5-tier heavy-duty metal shelving unit with a 1,000 lb total capacity, leveling feet and a wall-fixing kit — for garage, pantry, kitchen or closet.",
    description:
      "Sturdy, versatile shelving that holds a serious load. Built from 0.9\" heavy-duty metal tubes, this 5-tier unit carries up to 1,000 lb in total, so you can store bulky boxes, tools and equipment without sagging. A smooth protective finish resists rust, scratches and water and wipes clean, and double stabilization — four non-slip leveling feet plus a wall-fixing kit — keeps it steady. It assembles quickly with no tools (33 × 12.6 × 72\").",
    features: [
      "5 tiers, up to 1,000 lb total capacity",
      "0.9\" heavy-duty metal tube frame",
      "Rust-, scratch- & water-resistant finish",
      "4 non-slip leveling feet + wall-fixing kit",
      "Tool-free assembly",
      "33 × 12.6 × 72\" — garage, pantry or closet",
    ],
    pros: ["High weight capacity", "No tools to assemble", "Wall-anchor for stability"],
    cons: ["Open wire shelves", "Tall footprint"],
    whoFor: "Anyone needing strong, tall shelving for a garage, pantry or utility room.",
    whyRecommend: "A 1,000 lb capacity and tool-free setup make it a dependable heavy-duty organizer.",
    faqs: [
      { q: "Do I need tools to build it?", a: "No — it assembles without tools, and includes a wall-fixing kit for extra stability." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["shelving", "garage storage", "storage rack", "sakugi", "organization"],
    featured: true,
  },
  {
    name: "Wall-Mount Garage Tool Organizer Rack (48\", 300 lb)",
    slug: "wall-mount-garage-tool-organizer-48",
    brand: "TIDYME",
    category: "storage-organization",
    subcategory: "garage-storage",
    price: 28825,
    imageUrl: "https://m.media-amazon.com/images/I/81+JOJfqqKL._AC_SL1500_.jpg",
    imageAlt: "48-inch wall-mount garage tool organizer rack with adjustable hooks",
    affiliateUrl: "https://amzn.to/4wTAXSp",
    shortDescription:
      "A 48\" wall-mounted tool organizer in anti-rust carbon steel with 3 rails and 6 adjustable hooks — holds up to 300 lb of shovels, rakes and power tools.",
    description:
      "Clear the garage floor and hang your tools in order. This 48\" TIDYME rack mounts to wall studs (16\" on center) and holds up to 300 lb of shovels, brooms, rakes and power tools. Solid carbon steel resists corrosion and wear for indoor or outdoor use, and six adjustable hooks slide along the rails so you can arrange and rearrange tools however you like. Pre-drilled holes and included hardware make installation quick.",
    features: [
      "48\" rack, up to 300 lb capacity",
      "3 rails + 6 adjustable sliding hooks",
      "Anti-rust solid carbon steel",
      "Mounts to studs (16\" on center)",
      "Pre-drilled holes + hardware included",
      "For shovels, rakes, brooms & power tools",
    ],
    pros: ["Frees up floor space", "Strong 300 lb capacity", "Adjustable hook layout"],
    cons: ["Wall mounting required", "Studs needed for full capacity"],
    whoFor: "Anyone wanting to get garden and power tools off the garage floor and organised.",
    whyRecommend: "A tough, adjustable wall rack that clears the floor and keeps every tool in reach.",
    faqs: [
      { q: "How is it mounted?", a: "It screws into wall studs (16\" on center) using the pre-drilled holes and included hardware." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["tool organizer", "garage storage", "wall mount", "organization", "tidyme"],
  },

  // ---------------------------------------------------------------- Home cleaning & appliances
  {
    name: "KNKA Air Purifier for Home (up to 1,695 ft²)",
    slug: "knka-air-purifier-home-aph4000",
    brand: "KNKA",
    category: "home-cleaning",
    subcategory: "air-purifiers",
    price: 69237,
    imageUrl: "https://m.media-amazon.com/images/I/71eM07+OB6L._AC_SL1500_.jpg",
    imageAlt: "KNKA APH4000 white HEPA air purifier with AQI display and pet mode",
    affiliateUrl: "https://amzn.to/4qlVVHq",
    shortDescription:
      "An AHAM-verified HEPA air purifier for large rooms — 3-stage filtration with a washable pre-filter, real-time AQI display, pet mode and a 22 dB sleep mode.",
    description:
      "Cleaner air for big spaces. This AHAM-verified KNKA purifier uses dual front-and-back cartridges, each with a 3-stage system — a washable pre-filter, a high-efficiency filter and activated carbon — to trap pet hair, dust, pollen and microscopic particles. It refreshes the air up to 4.8× per hour in 350 ft² rooms and covers up to 1,695 ft². A built-in sensor shows real-time AQI with color-coded lights, Pet and ECO modes adapt to conditions, and Sleep mode runs as quiet as 22 dB.",
    features: [
      "AHAM-verified HEPA-grade performance",
      "3-stage filter: washable pre + HEPA + carbon",
      "Covers up to 1,695 ft²; 4.8× ACH in 350 ft²",
      "Real-time AQI display with color lights",
      "Pet & ECO modes; filter-change indicator",
      "Ultra-quiet 22 dB sleep mode",
    ],
    pros: ["Large room coverage", "Real AQI display", "Very quiet at night"],
    cons: ["Replacement filters needed (3–6 mo)", "Larger footprint"],
    whoFor: "Households with pets, allergies or dust who want cleaner air in large rooms.",
    whyRecommend: "AHAM-verified coverage, an AQI display and pet mode make it a serious air cleaner.",
    faqs: [
      { q: "How often do filters need changing?", a: "For best performance, replace the filters every 3–6 months; a change indicator reminds you." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["air purifier", "hepa", "home cleaning", "knka", "allergies"],
    featured: true,
  },
  {
    name: "Handheld Steam Cleaner with 16 Accessories (1500W)",
    slug: "handheld-steam-cleaner-16-accessories",
    brand: "NBN Pick",
    category: "home-cleaning",
    subcategory: "cleaning-tools",
    price: 28848,
    imageUrl: "https://m.media-amazon.com/images/I/710EPs-7hML._AC_SL1500_.jpg",
    imageAlt: "Portable handheld steam cleaner with 16-piece accessory set",
    affiliateUrl: "https://amzn.to/4g8BZD7",
    shortDescription:
      "A 1500W handheld steam cleaner that heats in 15 seconds and blasts 221°F steam to dissolve grease, grime and bacteria — chemical-free, with 16 accessories.",
    description:
      "Deep-clean without chemicals. This portable steamer heats up in just 15 seconds and releases high-temperature 221°F steam at 3 bar to dissolve stubborn grease, grime, stains and bacteria across floors, sofas, windows, kitchens, bathrooms and car interiors. Six touch-adjustable steam levels, a 1.25 L tank, a 6.6 ft hose and 16 accessories (brushes, scraper, nozzle, cloth, gloves and more) let you tackle almost any surface — using only pure steam, no chemical residue.",
    features: [
      "1500W, heats up in just 15 seconds",
      "221°F steam at 3 bar dissolves grease & grime",
      "6 adjustable steam levels (touch control)",
      "Large 1.25 L tank + 6.6 ft hose",
      "16 accessories for many surfaces",
      "Chemical-free, family- and pet-friendly",
    ],
    pros: ["Chemical-free deep cleaning", "Fast 15-sec heat-up", "16-piece accessory set"],
    cons: ["Corded", "Refill for very large jobs"],
    whoFor: "Anyone who wants powerful, chemical-free cleaning for the home and car.",
    whyRecommend: "Hot pressurised steam plus 16 tools cleans grime and grout without chemicals.",
    faqs: [
      { q: "Does it use chemicals?", a: "No — it cleans with pure high-temperature steam, leaving no chemical residue or fumes." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["steam cleaner", "home cleaning", "chemical-free", "car detailing", "cleaning"],
    trending: true,
  },
  {
    name: "Kitchen Gizmo Snap N' Strain Clip-On Pasta Strainer",
    slug: "kitchen-gizmo-snap-n-strain-strainer",
    brand: "Kitchen Gizmo",
    category: "home-kitchen",
    subcategory: "kitchen-tools",
    price: 10381,
    imageUrl: "https://m.media-amazon.com/images/I/61SarkuabfL._AC_SL1500_.jpg",
    imageAlt: "Kitchen Gizmo Snap N' Strain gray silicone clip-on pasta strainer",
    affiliateUrl: "https://amzn.to/45sGLGB",
    shortDescription:
      "A clip-on silicone strainer that snaps onto pots, pans and bowls for hands-free draining — heat-resistant to 400°F and folds flat to store.",
    description:
      "Drain without a bulky colander. This Snap N' Strain clips securely onto most pots, pans and bowls so you can pour off water hands-free — no more juggling a heavy pot over the sink. The heat-resistant silicone withstands up to 400°F and grips firmly on hot cookware, and it folds flat to tuck into a drawer, making it ideal for small kitchens, apartments, dorms and camping.",
    features: [
      "Clips onto pots, pans and bowls",
      "Hands-free, spill-resistant draining",
      "Heat-resistant silicone up to 400°F",
      "Folds flat for compact storage",
      "Universal fit for most cookware",
      "Great for pasta, veggies and fruit",
    ],
    pros: ["Space-saving vs a colander", "Secure hands-free draining", "Heat-resistant"],
    cons: ["Best on standard-rim cookware", "Not for very fine grains"],
    whoFor: "Small-kitchen cooks who want easy draining without a bulky colander.",
    whyRecommend: "It replaces a full colander with a clip-on tool that folds flat and drains hands-free.",
    faqs: [
      { q: "Does it fit my pots?", a: "It's designed to clip onto most small and large pots, pans and bowls." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["strainer", "colander", "kitchen tools", "home kitchen", "kitchen gizmo"],
  },
  {
    name: "OHIFAST Touchless Automatic Soap Dispenser (380 ml)",
    slug: "ohifast-touchless-soap-dispenser",
    brand: "OHIFAST",
    category: "home-kitchen",
    subcategory: "bathroom-accessories",
    price: 9227,
    imageUrl: "https://m.media-amazon.com/images/I/61QIimnunPL._AC_SL1500_.jpg",
    imageAlt: "OHIFAST white touchless automatic soap dispenser, wall-mountable",
    affiliateUrl: "https://amzn.to/4i27q4s",
    shortDescription:
      "A touchless automatic soap dispenser with an infrared sensor, 6 adjustable volumes, IPX5 waterproofing and USB-C recharging — for kitchen or bathroom.",
    description:
      "Hygienic, hands-free soap every time. An infrared sensor detects your hand within about 2.7\" and dispenses in 0.25 seconds, and six adjustable volume levels reduce waste (with a 10-second continuous flow for cleaning tasks). The 12.8 oz (380 ml) dispenser is IPX5 waterproof for kitchens and bathrooms, sits on the counter or mounts on the wall, and works with hand soap, dish soap, shampoo, shower gel or sanitizer. A 1200 mAh battery recharges over USB-C in about 3 hours for up to 5,000 cycles.",
    features: [
      "Touchless infrared sensor, 0.25s dispensing",
      "6 adjustable soap volumes + continuous mode",
      "IPX5 waterproof for kitchen & bathroom",
      "380 ml capacity; counter or wall-mount",
      "USB-C rechargeable (1200 mAh, ~5,000 cycles)",
      "Works with soap, dish soap, sanitizer & more",
    ],
    pros: ["Hygienic hands-free use", "Adjustable amounts", "Rechargeable & waterproof"],
    cons: ["Best with thinner liquids", "Audible pump sound"],
    whoFor: "Families and germ-conscious homes who want touch-free soap in the kitchen or bath.",
    whyRecommend: "Touchless, adjustable and rechargeable — a hygienic upgrade for any sink.",
    faqs: [
      { q: "What soap can I use?", a: "Standard free-flowing liquids — hand soap, dish soap, shampoo, shower gel or sanitizer (avoid thick gels)." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["soap dispenser", "touchless", "bathroom", "home kitchen", "ohifast"],
  },

  // ---------------------------------------------------------------- Travel & outdoors
  {
    name: "Wise Owl Outfitters Camping Hammock with Tree Straps",
    slug: "wise-owl-outfitters-camping-hammock",
    brand: "Wise Owl Outfitters",
    category: "travel-lifestyle",
    subcategory: "outdoors",
    price: 16106,
    imageUrl: "https://m.media-amazon.com/images/I/81tSkm7YhlL._AC_SL1500_.jpg",
    imageAlt: "Wise Owl Outfitters portable camping hammock with tree straps",
    affiliateUrl: "https://amzn.to/3S25qPb",
    shortDescription:
      "A lightweight, packable parachute-nylon camping hammock with tree straps and carabiners — sets up in minutes and packs down smaller than an eggplant.",
    description:
      "Relax anywhere outdoors with this best-selling Wise Owl hammock. The single size (9 × 4.5 ft) gives one person plenty of room, and durable triple-stitched parachute nylon safely supports up to 400 lb without sagging. Everything you need is in the bag — 9 ft tree straps with five loops, carabiners and a built-in stuff sack — so it sets up in minutes with no tools. It weighs just 16 oz, packs down tiny, and the quick-dry fabric is machine washable.",
    features: [
      "Roomy single size (9 × 4.5 ft)",
      "Triple-stitched nylon holds up to 400 lb",
      "Includes 9 ft tree straps + carabiners",
      "Sets up in minutes, no tools",
      "Only 16 oz — packs down tiny",
      "Quick-dry, machine-washable fabric",
    ],
    pros: ["Light and ultra-packable", "Strong and comfortable", "Complete kit included"],
    cons: ["Needs two anchor points", "Single-person size"],
    whoFor: "Campers, backpackers and anyone who wants to relax outdoors or in the backyard.",
    whyRecommend: "A proven, lightweight hammock that packs tiny and includes everything to hang it.",
    faqs: [
      { q: "Does it come with straps?", a: "Yes — it includes 9 ft tree straps and carabiners, so you can hang it right away." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["hammock", "camping", "outdoors", "travel", "wise owl"],
    trending: true,
  },
  {
    name: "Occer 12x25 Compact Binoculars",
    slug: "occer-12x25-compact-binoculars",
    brand: "Occer",
    category: "travel-lifestyle",
    subcategory: "outdoors",
    price: 18686,
    imageUrl: "https://m.media-amazon.com/images/I/71ni6tWpQ0L._AC_SL1500_.jpg",
    imageAlt: "Occer 12x25 compact binoculars for bird watching and travel",
    affiliateUrl: "https://amzn.to/4grVZBT",
    shortDescription:
      "Compact 12x25 binoculars with FMC-coated BAK4 optics and a wide field of view — pocket-sized and easy to focus for birding, travel and events.",
    description:
      "See farther and clearer, wherever you go. These Occer binoculars offer 12x magnification and a 25mm objective lens with a wide 273 ft/1000 yd field of view, and FMC broadband coating with BAK4 prisms delivers bright, true-to-life images. Adjustable eye cups suit glasses wearers and non-wearers alike, the one-hand focus is quick and easy, and the lightweight, life-waterproof body with a strap fits any pocket — great for bird watching, cruises, hiking, concerts and travel for adults and kids.",
    features: [
      "12x magnification, 25mm objective lens",
      "Wide 273 ft/1000 yd field of view",
      "FMC-coated BAK4 prisms for bright images",
      "Adjustable eye cups for glasses wearers",
      "Easy one-hand focus",
      "Lightweight, life-waterproof, pocket-sized",
    ],
    pros: ["Truly pocketable", "Clear, bright optics", "Good for kids and adults"],
    cons: ["Not for total darkness", "Small objective vs full-size"],
    whoFor: "Birders, travellers and event-goers who want clear, packable binoculars.",
    whyRecommend: "Bright BAK4 optics in a genuinely pocket-sized body make them easy to carry everywhere.",
    faqs: [
      { q: "Do they work with glasses?", a: "Yes — the adjustable eye cups fold down so glasses wearers get the full field of view." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["binoculars", "outdoors", "bird watching", "travel", "occer"],
  },
  {
    name: "LHKNL Rechargeable LED Headlamp (2-Pack)",
    slug: "lhknl-rechargeable-led-headlamp-2-pack",
    brand: "LHKNL",
    category: "travel-lifestyle",
    subcategory: "outdoors",
    price: 10381,
    imageUrl: "https://m.media-amazon.com/images/I/71DxWxvCwlL._AC_SL1500_.jpg",
    imageAlt: "LHKNL rechargeable LED headlamp 2-pack with motion sensor and red light",
    affiliateUrl: "https://amzn.to/4znbFOu",
    shortDescription:
      "A 2-pack of ultra-light rechargeable LED headlamps with a motion sensor, white and red light, 8 modes and IPX4 waterproofing — for running, camping and hiking.",
    description:
      "Bright, hands-free light for any adventure — and you get two. These LHKNL headlamps use high-lumen LEDs to light up a whole tent or trail, with a motion sensor so you can switch them on or off with a wave when your hands are dirty. A 1500 mAh rechargeable battery lasts 4–10 hours and can charge while in use, and eight modes (including red beam and SOS) cover every need. At just 1.87 oz with a 60°-tilt head and adjustable band, they're comfortable for adults and kids, and IPX4 waterproofing handles rain or snow.",
    features: [
      "2-pack of ultra-light 1.87 oz headlamps",
      "Motion sensor — wave to toggle on/off",
      "High-lumen white + red light, 8 modes",
      "Rechargeable 1500 mAh, 4–10 hr runtime",
      "60°-tilt head + adjustable elastic band",
      "IPX4 waterproof for rain or snow",
    ],
    pros: ["Two included", "Hands-free motion sensor", "Rechargeable"],
    cons: ["IPX4 (splash, not submersible)", "Mid-size battery"],
    whoFor: "Runners, campers, hikers and anyone who wants reliable hands-free light.",
    whyRecommend: "Two rechargeable, motion-sensor headlamps for the price of one make great everyday value.",
    faqs: [
      { q: "How long does the battery last?", a: "About 4–10 hours per charge, and it can run while charging over the built-in battery." },
      AMAZON_FAQ,
      PRICE_FAQ,
    ],
    tags: ["headlamp", "outdoors", "camping", "rechargeable", "lhknl"],
  },
];

export function amazon4ToData(p: AmazonProduct4): Prisma.MarketProductUncheckedCreateInput {
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
