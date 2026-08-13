import type { Prisma } from "@prisma/client";
import { COUNTRIES } from "@/lib/marketplace";

/**
 * Real affiliate products from Selar (digital courses/trainings), added to NBN
 * MARKET with the exact affiliate links provided by the owner. These are digital
 * products, so they're available in every supported country (platform: "Selar").
 *
 * Prices are the amounts Selar displayed (XAF / CFA franc); the storefront's live
 * currency conversion localizes them per country. The affiliate URL is stored per
 * country so the "Buy on Selar" button always uses the correct tracked link.
 */

type SelarProduct = {
  name: string;
  slug: string;
  brand: string;
  subcategory: string;
  price: number | null;
  currency: string;
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

/** Availability for a digital product: available in every country via Selar. */
function selarAvailability(url: string) {
  return COUNTRIES.reduce<Record<string, { status: string; platform: string; url: string }>>(
    (m, c) => ({ ...m, [c.code]: { status: "AVAILABLE", platform: "Selar", url } }),
    {},
  );
}

export const SELAR_PRODUCTS: SelarProduct[] = [
  {
    name: "How To Earn Dollars With YouTube Automation",
    slug: "youtube-automation-earn-dollars",
    brand: "Williams — The YouTube Wizard",
    subcategory: "youtube-automation",
    price: 4961,
    currency: "XAF",
    imageUrl: "https://files.selar.co/product-images/2026/products/TheYoutubeWizard/how-to-earn-dollars-with--selar.com-6a1aab2eded1f.png",
    imageAlt: "How to earn dollars with YouTube automation — faceless YouTube blueprint",
    affiliateUrl: "https://selar.com/p/313zq3h53j?affiliate=9fod",
    shortDescription:
      "The step-by-step blueprint to building viral, faceless YouTube channels with AI — no camera, no face, fully automated, and built to earn in dollars.",
    description:
      "Imagine a YouTube channel that grows and earns without you ever showing your face. This guide hands you the exact faceless-YouTube system — from finding a profitable niche to generating scripts with AI, creating natural AI voiceovers, editing in CapCut, going viral and scaling. Everything is laid out step by step so a complete beginner can follow along and start building an automated channel today.",
    features: [
      "The complete faceless YouTube blueprint",
      "How to find profitable, low-competition niches",
      "AI script generation that keeps viewers watching",
      "Natural AI voiceovers — no need to record yourself",
      "CapCut editing walkthrough (beginner friendly)",
      "Viral strategy + how to scale to more channels",
      "Analytics breakdown so you know what's working",
    ],
    pros: ["No camera or face required", "Uses free / low-cost AI tools", "A proven, in-demand online income model"],
    cons: ["Requires consistency to see results", "Monetisation isn't instant"],
    whoFor: "Anyone who wants to earn from YouTube without being on camera — using AI to do the heavy lifting.",
    whyRecommend:
      "Faceless YouTube is one of the hottest online income models right now, and this breaks down the entire system so you're not guessing your way through it.",
    faqs: [
      { q: "Do I need to show my face?", a: "No — this is built entirely around faceless, automated channels using AI." },
      { q: "Is it available in my country?", a: "Yes. It's a digital guide delivered instantly and payable from anywhere via Selar." },
    ],
    tags: ["course", "youtube automation", "make money online", "ai", "faceless youtube"],
    featured: true,
    trending: true,
  },
  {
    name: "WhatsApp Automation Masterclass",
    slug: "whatsapp-automation-masterclass",
    brand: "Joseph Don",
    subcategory: "whatsapp-marketing",
    price: 3721,
    currency: "XAF",
    imageUrl: "https://files.selar.co/product-images/2022/products/JosephDon/whatsapp-automation-maste-selar.co-61deb691d3ae2.jpg",
    imageAlt: "WhatsApp Automation Masterclass — generate leads and close sales on WhatsApp",
    affiliateUrl: "https://selar.com/p/k85c?affiliate=qmir",
    shortDescription:
      "A brand-new training that reveals how to generate leads, increase your status views, and close sales automatically on WhatsApp — without expensive bots or stealing anyone's numbers.",
    description:
      "Your customers are already on WhatsApp — this masterclass shows you how to sell to them on autopilot. Learn how to attract fresh leads, get far more eyes on your status, and close sales automatically, all ethically and without paying for costly bots or harvesting people's phone numbers. If you sell anything on WhatsApp, this turns it into a real sales machine.",
    features: [
      "How to generate leads directly on WhatsApp",
      "Get more views on your WhatsApp status",
      "Close sales automatically, on autopilot",
      "No expensive bots or paid tools required",
      "100% ethical — no number-harvesting",
    ],
    pros: ["Works for any WhatsApp seller", "No costly tools needed", "Practical and ready to apply today"],
    cons: ["Requires an active WhatsApp account", "Digital delivery only"],
    whoFor: "Anyone who sells products or services on WhatsApp and wants more leads and automatic sales.",
    whyRecommend: "WhatsApp is where your customers already are — this shows you exactly how to sell there without lifting a finger every time.",
    faqs: [
      { q: "Do I need special software?", a: "No — the masterclass shows methods that don't rely on expensive bots." },
      { q: "Can I access it from my country?", a: "Yes. It's a digital training delivered instantly, payable from anywhere via Selar." },
    ],
    tags: ["course", "whatsapp marketing", "lead generation", "sales", "make money online"],
    featured: true,
    trending: true,
  },
  {
    name: "Promote Affiliate Products (PAP)",
    slug: "promote-affiliate-products",
    brand: "Rasheed Jatto",
    subcategory: "affiliate-marketing",
    price: null,
    currency: "XAF",
    imageUrl: "https://files.selar.co/product-images/2025/products/rasheedjatto/promote-affiliate-product-selar.co-67922a997a1e4.jpg",
    imageAlt: "Promote Affiliate Products — detailed affiliate marketing training",
    affiliateUrl: "https://selar.com/p/13s7oy?affiliate=dvy3",
    shortDescription:
      "One of the most detailed, well-explained affiliate marketing trainings on Selar — the exact strategies for building a profitable affiliate business, revealed step by step.",
    description:
      "Affiliate marketing is one of the simplest ways to earn online — when you know what actually works. In this training the creator reveals the full strategy behind a profitable affiliate business, from choosing the right offers to driving traffic and closing sales, so you can start earning by promoting other people's products with no product of your own.",
    features: [
      "A complete, beginner-to-advanced affiliate blueprint",
      "How to choose winning products to promote",
      "How to drive traffic and generate sales",
      "The mindset and habits of top affiliates",
      "Learn at your own pace, from anywhere",
    ],
    pros: ["No product of your own needed", "Detailed and clearly explained", "Start with a small budget"],
    cons: ["Results depend on your effort", "Digital delivery only"],
    whoFor: "Anyone who wants to earn online by promoting other people's products — no product or big budget required.",
    whyRecommend: "It's one of the most thorough affiliate trainings on Selar, so you learn exactly what works instead of wasting months guessing.",
    faqs: [
      { q: "Do I need my own product?", a: "No — affiliate marketing is about promoting other people's products and earning a commission." },
      { q: "Is it available in my country?", a: "Yes. It's a digital training delivered instantly, payable from anywhere via Selar." },
    ],
    tags: ["course", "affiliate marketing", "make money online", "passive income"],
    trending: true,
  },
  {
    name: "Digital Product Starter Pack",
    slug: "digital-product-starter-pack",
    brand: "AlfaChemistry",
    subcategory: "digital-business",
    price: 2400,
    currency: "XAF",
    imageUrl: "https://files.selar.co/product-images/2026/products/alfachemistry/digital-product-starter-p-selar.com-6959265075535.jpg",
    imageAlt: "Digital Product Starter Pack — start selling digital products online",
    affiliateUrl: "https://selar.com/p/575x30?affiliate=xllc",
    shortDescription:
      "Everything you need to start selling digital products online — a done-for-you starter pack with a step-by-step launch roadmap and private Telegram community support.",
    description:
      "Skip the guesswork and start your online business fast. This affordable starter pack hands you the digital products and the exact roadmap to launch — even if you're starting from absolute zero. You get instant access plus a private Telegram community to keep you motivated and moving.",
    features: [
      "A ready-to-use digital product pack",
      "A step-by-step launch roadmap",
      "Private Telegram community access",
      "Beginner-friendly — start from zero",
      "Instant download after purchase",
    ],
    pros: ["A low-cost way to start a digital business", "Community support included", "Works from any country"],
    cons: ["You still need to put in the work", "Digital delivery only"],
    whoFor: "Anyone who wants to start earning online with digital products but doesn't know where to begin.",
    whyRecommend: "It removes the hardest part — getting started — by giving you the products and the plan in one affordable pack.",
    faqs: [
      { q: "Do I need experience?", a: "No — it's designed for complete beginners and includes a step-by-step roadmap." },
      { q: "Is it available in my country?", a: "Yes. It's a digital product delivered instantly, payable from anywhere via Selar." },
    ],
    tags: ["course", "digital products", "make money online", "side hustle"],
    featured: true,
  },
];

export function selarToData(p: SelarProduct): Prisma.MarketProductUncheckedCreateInput {
  return {
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: "courses",
    subcategory: p.subcategory,
    price: p.price ?? null,
    currency: p.currency,
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
    amazonAvailability: selarAvailability(p.affiliateUrl) as unknown as Prisma.InputJsonValue,
    featured: p.featured ?? false,
    trending: p.trending ?? false,
    published: true,
  };
}
