import type { Prisma } from "@prisma/client";

/**
 * Demo products for NBN MARKET — real photos + full info so the storefront can
 * be seen end-to-end. Shared by the CLI seed (prisma/seed-marketplace.ts) and
 * the admin "Load demo products" action (/api/marketplace/seed).
 *
 * Honesty: Amazon availability ships as "AVAILABILITY_UNKNOWN" for every country
 * — we never fabricate listings, prices or stock. Set a real Amazon URL per
 * country from the admin to flip a product to "Available". Every demo product is
 * deletable from /admin/marketplace.
 */

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=700&q=80&auto=format&fit=crop`;

const UNVERIFIED: Record<string, { status: string }> = ["DE", "GB", "FR", "IT", "ES"].reduce(
  (m, c) => ({ ...m, [c]: { status: "AVAILABILITY_UNKNOWN" } }),
  {},
);

export type DemoProduct = {
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  currency?: string;
  imageUrl: string;
  imageAlt: string;
  gallery?: string[];
  shortDescription: string;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  specs: { label: string; value: string }[];
  faqs?: { q: string; a: string }[];
  tags: string[];
  related?: string[];
  featured?: boolean;
  trending?: boolean;
};

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    name: "14-inch Programming Laptop (16GB / 512GB)",
    slug: "programming-laptop-14-16gb-512gb",
    brand: "Northbridge",
    category: "laptops",
    price: 999,
    imageUrl: img("1496181133206-80ce9b88a853"),
    imageAlt: "14-inch laptop for programming on a desk",
    gallery: [img("1541807084-5c52b6b3adef"), img("1517336714731-489689fd1ca8"), img("1588872657578-7efd1f1555ed")],
    shortDescription: "A portable 14-inch laptop with 16GB RAM and a fast 512GB SSD — enough headroom to run an IDE, browser and containers at once.",
    description: "The machine we point most developers toward: genuinely portable, 16GB of memory so you are not closing tabs to free up RAM, and a fast NVMe SSD that keeps builds and project switches snappy.",
    features: ["16GB RAM for multitasking and containers", "512GB NVMe SSD for fast builds", "14-inch IPS display — portable yet readable", "All-day battery for untethered work"],
    pros: ["Great balance of power and portability", "Enough RAM for real development work", "Fast storage keeps builds quick"],
    cons: ["Not aimed at heavy gaming", "Integrated graphics only"],
    specs: [{ label: "Memory", value: "16GB" }, { label: "Storage", value: "512GB SSD" }, { label: "Display", value: "14-inch IPS" }, { label: "Weight", value: "~1.4 kg" }],
    faqs: [{ q: "Is 16GB of RAM enough for programming?", a: "For most web, backend and application development, yes — 16GB comfortably runs an IDE, browser and a few containers." }],
    tags: ["programming", "developer", "student", "cloud"],
    featured: true,
    trending: true,
  },
  {
    name: "Budget Student Laptop (8GB / 256GB)",
    slug: "budget-student-laptop-8gb-256gb",
    brand: "Northbridge",
    category: "student-essentials",
    price: 499,
    imageUrl: img("1531297484001-80022131f5a1"),
    imageAlt: "Slim affordable laptop for students",
    shortDescription: "A light, affordable laptop for note-taking, research, writing and everyday coursework with all-day battery life.",
    description: "For lectures, essays, research and browsing, a well-chosen budget laptop is all you need — and it leaves money in your pocket for the rest of student life.",
    features: ["Lightweight and easy to carry", "All-day battery life", "Enough performance for coursework"],
    pros: ["Very affordable", "Light and portable", "Long battery life"],
    cons: ["8GB RAM limits heavy multitasking", "Not ideal for large projects"],
    specs: [{ label: "Memory", value: "8GB" }, { label: "Storage", value: "256GB SSD" }, { label: "Display", value: "14-inch" }],
    faqs: [{ q: "Can I code on a budget laptop?", a: "Light coding and learning to program are fine. For larger projects, 16GB of RAM is a more comfortable starting point." }],
    tags: ["student", "budget"],
    related: ["programming-laptop-14-16gb-512gb"],
    featured: true,
  },
  {
    name: "Cloud & DevOps Laptop (32GB / 1TB)",
    slug: "cloud-devops-laptop-32gb-1tb",
    brand: "Northbridge Pro",
    category: "laptops",
    price: 1499,
    imageUrl: img("1517336714731-489689fd1ca8"),
    imageAlt: "High-performance laptop for cloud and DevOps work",
    shortDescription: "A 32GB / 1TB laptop for engineers who run many containers, terminals and remote sessions at once.",
    description: "Cloud and DevOps work is about running a lot at once — containers, terminals, dashboards and remote sessions. Generous memory and storage keep everything responsive.",
    features: ["32GB RAM for containers and VMs", "1TB SSD for images and projects", "Sharp display for dense logs", "Strong Wi-Fi for remote work"],
    pros: ["Huge multitasking headroom", "Fast, spacious storage", "Handles local container workloads"],
    cons: ["Higher price", "More than casual users need"],
    specs: [{ label: "Memory", value: "32GB" }, { label: "Storage", value: "1TB SSD" }, { label: "Display", value: "16-inch, high-res" }],
    faqs: [{ q: "Do I need 32GB of RAM for DevOps?", a: "If you regularly run multiple containers or VMs locally, 32GB makes a noticeable difference. For lighter work, 16GB is often enough." }],
    tags: ["cloud", "devops", "developer", "programming"],
    related: ["programming-laptop-14-16gb-512gb"],
    trending: true,
  },
  {
    name: "13-inch Ultrabook (Aluminium, 1.1kg)",
    slug: "ultrabook-13-aluminium",
    brand: "Northbridge Air",
    category: "laptops",
    price: 1199,
    imageUrl: img("1593642702821-c8da6771f0c6"),
    imageAlt: "Thin aluminium 13-inch ultrabook",
    shortDescription: "An ultra-light 13-inch aluminium laptop for people who travel and want long battery life with a premium feel.",
    description: "A featherweight machine that slips into any bag. Ideal for writers, students and professionals who prize portability and battery life over raw power.",
    features: ["Just 1.1kg — barely there in a bag", "All-day battery life", "Premium aluminium chassis", "Bright, colour-accurate display"],
    pros: ["Extremely portable", "Excellent battery", "Premium build"],
    cons: ["Fewer ports", "Not for heavy workloads"],
    specs: [{ label: "Memory", value: "16GB" }, { label: "Storage", value: "512GB SSD" }, { label: "Weight", value: "1.1 kg" }],
    tags: ["student", "travel", "developer"],
  },
  {
    name: "27-inch 1440p IPS Monitor",
    slug: "monitor-27-1440p-ips",
    brand: "ClearView",
    category: "developer-gear",
    price: 279,
    imageUrl: img("1527443224154-c4a3942d3acf"),
    imageAlt: "27-inch 1440p monitor on a desk",
    gallery: [img("1543512214-318c7553f230"), img("1587202372775-e229f172b9d7")],
    shortDescription: "A 27-inch 1440p IPS monitor that fits far more code on screen — one of the best value productivity upgrades for developers.",
    description: "More screen real estate means more code and context in front of you at once. A 27-inch 1440p IPS panel is the classic developer choice: sharp text, accurate colour and room for a split-screen editor and browser.",
    features: ["27-inch 1440p resolution", "IPS panel for consistent colour", "Height-adjustable stand", "Flicker-free backlight"],
    pros: ["Lots of usable screen space", "Sharp, comfortable text", "Great value"],
    cons: ["Not a high-refresh gaming panel", "Desk space required"],
    specs: [{ label: "Size", value: "27-inch" }, { label: "Resolution", value: "2560 x 1440" }, { label: "Panel", value: "IPS" }],
    faqs: [{ q: "Is 1440p better than 4K for coding?", a: "1440p on a 27-inch panel gives crisp text and plenty of space without needing display scaling, which keeps things simple." }],
    tags: ["monitor", "programming", "developer"],
    trending: true,
  },
  {
    name: "32-inch 4K Creator Monitor",
    slug: "monitor-32-4k-creator",
    brand: "ClearView Pro",
    category: "developer-gear",
    price: 549,
    imageUrl: img("1587202372775-e229f172b9d7"),
    imageAlt: "32-inch 4K monitor for creative work",
    shortDescription: "A 32-inch 4K display with excellent colour coverage for developers and creators who want maximum detail and space.",
    description: "When you want the sharpest text and the most room, a 32-inch 4K panel delivers. Great for design, video and dense multi-window workflows.",
    features: ["32-inch 4K UHD resolution", "Wide colour gamut", "USB-C with power delivery", "Ergonomic stand"],
    pros: ["Huge, razor-sharp workspace", "Excellent colour", "Single-cable USB-C"],
    cons: ["Needs a capable GPU", "Premium price"],
    specs: [{ label: "Size", value: "32-inch" }, { label: "Resolution", value: "3840 x 2160" }, { label: "Ports", value: "USB-C, HDMI, DP" }],
    tags: ["monitor", "developer", "creator"],
    featured: true,
  },
  {
    name: "Compact Mechanical Keyboard (75%)",
    slug: "mechanical-keyboard-75",
    brand: "KeyForge",
    category: "developer-gear",
    price: 119,
    imageUrl: img("1587829741301-dc798b83add3"),
    imageAlt: "Compact mechanical keyboard",
    shortDescription: "A comfortable 75% mechanical keyboard built for long typing sessions, with a tidy layout that keeps common keys within reach.",
    description: "You touch your keyboard more than any other tool, so comfort compounds. A quality mechanical board with the right switches reduces fatigue during long coding sessions.",
    features: ["Tactile mechanical switches", "Compact 75% layout", "Durable build", "USB-C, optional wireless"],
    pros: ["Comfortable for long sessions", "Built to last", "Precise typing"],
    cons: ["Louder than membrane boards", "Compact layout takes adjustment"],
    specs: [{ label: "Type", value: "Mechanical" }, { label: "Layout", value: "75%" }, { label: "Connectivity", value: "USB-C / wireless" }],
    tags: ["keyboard", "developer"],
  },
  {
    name: "RGB Gaming Keyboard (Hot-swap)",
    slug: "rgb-gaming-keyboard-hotswap",
    brand: "KeyForge Play",
    category: "gaming",
    price: 139,
    imageUrl: img("1618384887929-16ec33fab9ef"),
    imageAlt: "RGB backlit gaming keyboard",
    shortDescription: "A hot-swappable RGB mechanical keyboard with fast switches for gaming and a bright, customisable backlight.",
    description: "Built for play: quick linear switches, per-key RGB and a hot-swap PCB so you can change switches without soldering.",
    features: ["Per-key RGB lighting", "Hot-swappable switches", "Fast linear switches", "Durable doubleshot keycaps"],
    pros: ["Great for gaming", "Fully customisable", "Solid build"],
    cons: ["RGB may distract at work", "Linear switches aren't for everyone"],
    specs: [{ label: "Type", value: "Mechanical (hot-swap)" }, { label: "Lighting", value: "Per-key RGB" }, { label: "Layout", value: "TKL" }],
    tags: ["keyboard", "gaming"],
  },
  {
    name: "Wireless Productivity Mouse",
    slug: "wireless-productivity-mouse",
    brand: "Glide",
    category: "accessories",
    price: 59,
    imageUrl: img("1527814050087-3793815479db"),
    imageAlt: "Wireless ergonomic mouse",
    shortDescription: "A quiet, ergonomic wireless mouse with fast scrolling and multi-device switching for a tidy, productive desk.",
    description: "A comfortable everyday mouse that pairs with several devices, scrolls fast through long files and lasts weeks on a charge.",
    features: ["Ergonomic shape", "Multi-device pairing", "Fast, precise scroll wheel", "Rechargeable, weeks of battery"],
    pros: ["Very comfortable", "Multi-device switching", "Quiet clicks"],
    cons: ["Not aimed at competitive gaming"],
    specs: [{ label: "Connection", value: "Bluetooth / USB receiver" }, { label: "Battery", value: "Rechargeable" }],
    tags: ["accessories", "developer", "productivity"],
  },
  {
    name: "Noise-Cancelling Headphones",
    slug: "noise-cancelling-headphones",
    brand: "Quietude",
    category: "accessories",
    price: 199,
    imageUrl: img("1505740420928-5e560c06d30e"),
    imageAlt: "Over-ear noise-cancelling headphones",
    gallery: [img("1484704849700-f032a568e944"), img("1583394838336-acd977736f90")],
    shortDescription: "Comfortable over-ear headphones with active noise cancelling to help you focus in busy or shared spaces.",
    description: "Deep work needs quiet. Active noise cancelling takes the edge off open offices, cafés and shared homes so you can concentrate.",
    features: ["Active noise cancellation", "Long battery life", "Comfortable over-ear fit", "Clear call quality"],
    pros: ["Blocks out distractions", "Comfortable for long wear", "Versatile for work and travel"],
    cons: ["Bulkier than earbuds", "ANC adds to the price"],
    specs: [{ label: "Type", value: "Over-ear, ANC" }, { label: "Battery", value: "All-day" }, { label: "Connectivity", value: "Bluetooth" }],
    faqs: [{ q: "Do noise-cancelling headphones help concentration?", a: "For many people, yes — reducing background noise lowers distraction and makes it easier to stay in flow." }],
    tags: ["accessories", "travel", "student"],
    featured: true,
  },
  {
    name: "Studio Monitor Headphones (Wired)",
    slug: "studio-monitor-headphones",
    brand: "Quietude Studio",
    category: "accessories",
    price: 129,
    imageUrl: img("1484704849700-f032a568e944"),
    imageAlt: "Wired studio over-ear headphones",
    shortDescription: "Wired over-ear headphones with a flat, accurate sound signature for editing, mixing and honest listening.",
    description: "For editing and mixing you want to hear what's really there. These deliver a flat, detailed signature and a comfortable fit for long sessions.",
    features: ["Flat, accurate sound", "Comfortable for long sessions", "Detachable cable", "Foldable for travel"],
    pros: ["Honest, detailed sound", "Comfortable", "Great value"],
    cons: ["Wired only", "No active noise cancelling"],
    specs: [{ label: "Type", value: "Over-ear, wired" }, { label: "Driver", value: "40mm" }],
    tags: ["accessories", "audio", "creator"],
  },
  {
    name: "Water-Resistant Laptop Backpack (20L)",
    slug: "laptop-backpack-20l",
    brand: "Trailhead",
    category: "travel-lifestyle",
    price: 79,
    imageUrl: img("1553062407-98eeb64c6a62"),
    imageAlt: "Water-resistant laptop backpack",
    shortDescription: "A water-resistant 20L backpack with a padded 16-inch laptop sleeve, USB pass-through and smart organisation.",
    description: "Carry your kit safely. A padded laptop compartment, water-resistant shell and thoughtful pockets make this a reliable daily commuter.",
    features: ["Padded 16-inch laptop sleeve", "Water-resistant shell", "USB charging pass-through", "Luggage strap"],
    pros: ["Protects your laptop", "Comfortable to carry", "Well organised"],
    cons: ["Not fully waterproof", "Neutral styling only"],
    specs: [{ label: "Capacity", value: "20L" }, { label: "Fits", value: "Up to 16-inch laptop" }],
    tags: ["travel", "student", "accessories"],
    trending: true,
  },
];

/** Map a demo product to a Prisma create/update payload. */
export function demoToData(p: DemoProduct): Prisma.MarketProductUncheckedCreateInput {
  return {
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: p.category,
    price: p.price,
    currency: p.currency || "EUR",
    imageUrl: p.imageUrl,
    imageAlt: p.imageAlt,
    gallery: p.gallery ?? [],
    shortDescription: p.shortDescription,
    description: p.description,
    features: p.features,
    pros: p.pros,
    cons: p.cons,
    tags: p.tags,
    related: p.related ?? [],
    guides: [],
    specs: p.specs as unknown as Prisma.InputJsonValue,
    faqs: (p.faqs ?? []) as unknown as Prisma.InputJsonValue,
    amazonAvailability: UNVERIFIED as unknown as Prisma.InputJsonValue,
    featured: p.featured ?? false,
    trending: p.trending ?? false,
    published: true,
  };
}
