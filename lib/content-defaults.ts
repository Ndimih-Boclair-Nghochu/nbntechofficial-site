/**
 * On-brand default content for NBN TECH.
 *
 * Two jobs:
 *  1. Seed data — the seed script writes these into the database.
 *  2. Graceful fallback — if the database is empty or unreachable, the public
 *     site renders this instead of blank sections (never lorem ipsum).
 *
 * All of it is editable from the admin panel once a database is connected.
 */

export type SocialLinks = {
  linkedin?: string;
  github?: string;
  x?: string;
  website?: string;
};

export const defaultSocialLinks: SocialLinks = {
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/Ndimih-Boclair-Nghochu",
  x: "https://x.com/",
};

export const defaultSiteContent = {
  id: "singleton",
  heroHeadline: "Software that earns its keep.",
  heroSubheadline:
    "I'm the engineer behind NBN TECH — I design, build, and ship web platforms, mobile apps, and the cloud infrastructure that keeps them fast, secure, and quietly reliable.",
  heroPhotoUrl: null as string | null,
  heroPhotoAlt: "Portrait of the founder of NBN TECH",
  positioningStatement:
    "Full-stack engineering for teams that need it done properly the first time.",
  aboutTitle: "An engineer, not a template.",
  aboutText:
    "NBN TECH is the practice of a software engineer who has spent years shipping real products — not demos. I work across the whole stack: the interface a customer touches, the API behind it, the database it leans on, and the cloud pipeline that deploys it on a Friday without anyone holding their breath.\n\nI care about the unglamorous parts — observability, migrations, error budgets, the second release — because that is where projects quietly succeed or quietly rot. If you want someone who treats your codebase like it has to outlive the engagement, we'll get along.",
  aboutPhotoUrl: null as string | null,
  aboutPhotoAlt: "The founder of NBN TECH at work",
  contactEmail: "hello@nbntech.dev",
  contactHeadline: "Let's build something that lasts.",
  contactBody:
    "Tell me what you're trying to ship and where it's stuck. I read every message myself and reply within two business days.",
  metaTitle: "NBN TECH — Software Engineering, Done Properly",
  metaDescription:
    "NBN TECH is the personal engineering brand of a software engineer specializing in web development, mobile apps, cloud computing, and DevOps.",
  socialLinks: defaultSocialLinks,
};

export type Pillar = {
  key: string;
  title: string;
  blurb: string;
  points: string[];
  icon: "Globe" | "Smartphone" | "Cloud" | "Workflow";
};

/** The four expertise pillars shown on the home page. */
export const pillars: Pillar[] = [
  {
    key: "web",
    title: "Web Development",
    blurb:
      "Fast, accessible, SEO-sound web apps — from marketing sites to complex dashboards.",
    points: [
      "Next.js / React / TypeScript front-ends",
      "REST & typed API design",
      "Performance & Core Web Vitals",
    ],
    icon: "Globe",
  },
  {
    key: "mobile",
    title: "Mobile App Development",
    blurb:
      "Cross-platform apps that feel native, ship to both stores, and update over the air.",
    points: [
      "React Native & Electron builds",
      "Offline-first & sync",
      "App Store / Play deployment",
    ],
    icon: "Smartphone",
  },
  {
    key: "cloud",
    title: "Cloud Computing",
    blurb:
      "Architecture that scales with demand and bills you for what you actually use.",
    points: [
      "AWS / serverless & containers",
      "Postgres, Redis & queues",
      "Cost-aware infrastructure",
    ],
    icon: "Cloud",
  },
  {
    key: "devops",
    title: "DevOps",
    blurb:
      "Pipelines that turn a commit into a safe production release without the drama.",
    points: [
      "CI/CD & automated releases",
      "Infrastructure as code",
      "Monitoring & incident response",
    ],
    icon: "Workflow",
  },
];

/** Engagement process, shown on /process and previewed on /about. */
export const processSteps = [
  {
    step: "01",
    title: "Discover",
    body: "We pin down the real problem, the constraints, and what success actually looks like — before a line of code is written.",
  },
  {
    step: "02",
    title: "Design & Plan",
    body: "Architecture, data model, and a milestone plan you can see. No black boxes, no surprise scope.",
  },
  {
    step: "03",
    title: "Build",
    body: "Shipping in small, reviewable increments. You watch it come together in a live environment, not a status meeting.",
  },
  {
    step: "04",
    title: "Launch",
    body: "A careful release: migrations rehearsed, monitoring in place, rollback ready. Launch day is boring on purpose.",
  },
  {
    step: "05",
    title: "Support",
    body: "The second release matters as much as the first. Ongoing fixes, iteration, and a codebase your team can own.",
  },
];
