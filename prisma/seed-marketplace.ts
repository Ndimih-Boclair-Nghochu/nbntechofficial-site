import type { PrismaClient } from "@prisma/client";

/**
 * Illustrative starter products for the Ndimih Boclair Marketplace so the
 * storefront renders richly out of the box. These are meant to be edited or
 * replaced from the admin panel.
 *
 * Honesty: Amazon availability is intentionally "AVAILABILITY_UNKNOWN" for every
 * country — we never fabricate listings, prices or stock. Set a real Amazon URL
 * in the admin and switch a country to "AVAILABLE" once you have that data.
 *
 * Idempotent: upserts by unique slug.
 */

const UNVERIFIED = ["DE", "GB", "FR", "IT", "ES"].reduce(
  (m, c) => ({ ...m, [c]: { status: "AVAILABILITY_UNKNOWN" } }),
  {} as Record<string, { status: string }>,
);

type SeedProduct = {
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  imageAlt: string;
  shortDescription: string;
  description: string;
  whoFor: string;
  whyRecommend: string;
  features: string[];
  pros: string[];
  cons: string[];
  specs: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
  tags: string[];
  related?: string[];
  featured?: boolean;
  trending?: boolean;
};

const PRODUCTS: SeedProduct[] = [
  {
    name: "14-inch Programming Laptop (16GB / 512GB)",
    slug: "best-laptop-for-programming-14-inch",
    brand: "Reference build",
    category: "laptops",
    price: 999,
    currency: "EUR",
    imageUrl: "/logo-mark.png",
    imageAlt: "14-inch laptop suited to programming and development work",
    shortDescription:
      "A balanced 14-inch laptop with 16GB RAM and a fast SSD — enough headroom to run an IDE, browser and containers at once.",
    description:
      "This is the class of machine we point most developers toward: a 14-inch chassis that is genuinely portable, 16GB of memory so you are not constantly closing tabs to free up RAM, and a fast 512GB SSD that keeps builds and project switches snappy.",
    whoFor:
      "Developers, computer-science students and anyone who needs a portable machine that can comfortably run a full development environment all day.",
    whyRecommend:
      "It hits the sweet spot of memory, storage, portability and battery life without paying for specs most developers never use.",
    features: [
      "16GB RAM for multitasking and containers",
      "512GB NVMe SSD for fast builds",
      "14-inch display — portable yet readable",
      "All-day battery for untethered work",
    ],
    pros: ["Great balance of power and portability", "Enough RAM for real development work", "Fast storage keeps builds quick"],
    cons: ["Not aimed at heavy 3D or AAA gaming", "Integrated graphics only"],
    specs: [
      { label: "Memory", value: "16GB" },
      { label: "Storage", value: "512GB SSD" },
      { label: "Display", value: "14-inch, IPS" },
    ],
    faqs: [
      { q: "Is 16GB of RAM enough for programming?", a: "For most web, backend and application development, yes — 16GB comfortably runs an IDE, browser and a few containers." },
    ],
    tags: ["programming", "developer", "student", "cloud"],
    featured: true,
    trending: true,
  },
  {
    name: "Budget Student Laptop (8GB / 256GB)",
    slug: "best-budget-laptop-for-students",
    brand: "Reference build",
    category: "student-essentials",
    price: 499,
    currency: "EUR",
    imageUrl: "/logo-mark.png",
    imageAlt: "Affordable lightweight laptop for students",
    shortDescription:
      "A light, affordable laptop for note-taking, research, writing and everyday coursework with all-day battery life.",
    description:
      "For lectures, essays, research and browsing, a well-chosen budget laptop is all you need — and it leaves money in your pocket for the rest of student life.",
    whoFor:
      "Students on a budget whose workload is mostly writing, research, browsing and light apps rather than heavy development.",
    whyRecommend:
      "It covers everyday student tasks reliably without overspending. Battery life and portability matter more than benchmarks here.",
    features: ["Lightweight and easy to carry", "All-day battery life", "Enough performance for coursework"],
    pros: ["Very affordable", "Light and portable", "Long battery life"],
    cons: ["8GB RAM limits heavy multitasking", "Not ideal for large development projects"],
    specs: [
      { label: "Memory", value: "8GB" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: "14-inch" },
    ],
    faqs: [{ q: "Can I code on a budget laptop?", a: "Light coding and learning to program are fine. For larger projects, 16GB of RAM is a more comfortable starting point." }],
    tags: ["student", "budget"],
    related: ["best-laptop-for-programming-14-inch"],
    featured: true,
  },
  {
    name: "27-inch 1440p Developer Monitor",
    slug: "best-monitor-for-programming-27-inch-1440p",
    brand: "Reference build",
    category: "developer-gear",
    price: 279,
    currency: "EUR",
    imageUrl: "/logo-mark.png",
    imageAlt: "27-inch 1440p IPS monitor for programming",
    shortDescription:
      "A 27-inch 1440p IPS monitor that fits far more code on screen — one of the best value productivity upgrades for developers.",
    description:
      "More screen real estate means more code and context in front of you at once. A 27-inch 1440p IPS panel is the classic developer choice: sharp text, accurate colour and room for a split-screen editor and browser.",
    whoFor: "Developers and anyone who spends long days reading and writing code, logs or documents.",
    whyRecommend:
      "It is the cheapest large productivity gain most developers can make. The jump from a cramped laptop screen is felt every day.",
    features: ["27-inch 1440p resolution", "IPS panel for consistent colour", "Height-adjustable stand", "Flicker-free backlight"],
    pros: ["Lots of usable screen space", "Sharp, comfortable text", "Great value for productivity"],
    cons: ["Not a high-refresh gaming panel", "Desk space required"],
    specs: [
      { label: "Size", value: "27-inch" },
      { label: "Resolution", value: "2560 x 1440 (1440p)" },
      { label: "Panel", value: "IPS" },
    ],
    faqs: [{ q: "Is 1440p better than 4K for coding?", a: "1440p on a 27-inch panel gives crisp text and plenty of space without needing display scaling, which keeps things simple." }],
    tags: ["monitor", "programming", "developer"],
    trending: true,
  },
  {
    name: "Mechanical Keyboard for Developers",
    slug: "best-mechanical-keyboard-for-developers",
    brand: "Reference build",
    category: "developer-gear",
    price: 119,
    currency: "EUR",
    imageUrl: "/logo-mark.png",
    imageAlt: "Compact mechanical keyboard for programmers",
    shortDescription:
      "A comfortable mechanical keyboard built for long typing sessions, with a tidy layout that keeps common keys within reach.",
    description:
      "You touch your keyboard more than any other tool, so comfort compounds over a career. A quality mechanical board with the right switches reduces fatigue during long coding sessions.",
    whoFor: "Programmers and writers who type all day and want a more comfortable, durable typing experience.",
    whyRecommend: "The right switches and a solid build make a real difference to comfort, and a good board lasts for years.",
    features: ["Mechanical switches for comfortable typing", "Durable build quality", "Compact, efficient layout"],
    pros: ["Comfortable for long sessions", "Built to last", "Satisfying, precise typing"],
    cons: ["Louder than a membrane keyboard", "Compact layouts take adjustment"],
    specs: [
      { label: "Type", value: "Mechanical" },
      { label: "Layout", value: "Compact (75%)" },
    ],
    faqs: [{ q: "Are mechanical keyboards better for programming?", a: "Many developers find them more comfortable and precise for long sessions. The best switch type is personal." }],
    tags: ["keyboard", "developer"],
  },
  {
    name: "Cloud & DevOps Laptop (32GB / 1TB)",
    slug: "best-laptop-for-cloud-computing-devops",
    brand: "Reference build",
    category: "laptops",
    price: 1499,
    currency: "EUR",
    imageUrl: "/logo-mark.png",
    imageAlt: "High-memory laptop for cloud and DevOps work",
    shortDescription: "A 32GB / 1TB laptop for engineers who run many containers, terminals and remote sessions at once.",
    description:
      "Cloud and DevOps work is about running a lot at once — containers, terminals, dashboards and remote sessions. Generous memory and storage keep everything responsive.",
    whoFor: "Cloud engineers, DevOps practitioners and power users who routinely run heavy local workloads.",
    whyRecommend: "The extra memory headroom pays off exactly when you need it — spinning up containers without the machine grinding to a halt.",
    features: ["32GB RAM for containers and VMs", "1TB SSD for images and projects", "Sharp display for dense logs"],
    pros: ["Huge multitasking headroom", "Fast, spacious storage", "Handles local container workloads well"],
    cons: ["Higher price", "More than casual users need"],
    specs: [
      { label: "Memory", value: "32GB" },
      { label: "Storage", value: "1TB SSD" },
    ],
    faqs: [{ q: "Do I need 32GB of RAM for DevOps?", a: "If you regularly run multiple containers or VMs locally, 32GB makes a noticeable difference. For lighter work, 16GB is often enough." }],
    tags: ["cloud", "devops", "developer", "programming"],
    related: ["best-laptop-for-programming-14-inch"],
    trending: true,
  },
  {
    name: "Noise-Cancelling Headphones for Focus",
    slug: "best-noise-cancelling-headphones-for-focus",
    brand: "Reference build",
    category: "accessories",
    price: 199,
    currency: "EUR",
    imageUrl: "/logo-mark.png",
    imageAlt: "Over-ear noise-cancelling headphones for focused work",
    shortDescription: "Comfortable over-ear headphones with active noise cancelling to help you focus in busy or shared spaces.",
    description: "Deep work needs quiet. Active noise cancelling takes the edge off open offices, cafés and shared homes so you can concentrate.",
    whoFor: "Developers, students and remote workers who need to concentrate in noisy or shared environments.",
    whyRecommend: "Good ANC and long battery life make focused work easier wherever you are, and they double as solid everyday headphones.",
    features: ["Active noise cancellation", "Long battery life", "Comfortable over-ear fit"],
    pros: ["Blocks out distractions", "Comfortable for long wear", "Versatile for work and travel"],
    cons: ["Bulkier than earbuds", "ANC adds to the price"],
    specs: [
      { label: "Type", value: "Over-ear, ANC" },
      { label: "Connectivity", value: "Bluetooth" },
    ],
    faqs: [{ q: "Do noise-cancelling headphones help concentration?", a: "For many people, yes — reducing background noise lowers distraction and makes it easier to stay in flow." }],
    tags: ["accessories", "travel", "student"],
  },
];

export async function seedMarketplace(prisma: PrismaClient) {
  for (const p of PRODUCTS) {
    const data = {
      ...p,
      related: p.related ?? [],
      guides: [],
      gallery: [],
      amazonAvailability: UNVERIFIED,
      published: true,
      featured: p.featured ?? false,
      trending: p.trending ?? false,
    };
    await prisma.marketProduct.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }
  console.log(`✔ ${PRODUCTS.length} marketplace products seeded`);
}
