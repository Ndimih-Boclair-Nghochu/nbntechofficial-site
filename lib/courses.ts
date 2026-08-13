import type { Course } from "@prisma/client";
import { siteUrl } from "@/lib/utils";

/**
 * NBN MARKET — Online Courses: static configuration + pure helpers.
 *
 * Courses are dynamic (Prisma, editable from the admin), but the taxonomy of
 * categories, the supported affiliate providers/networks, levels and languages
 * are curated here in code. Everything is designed to extend: add a category to
 * COURSE_CATEGORIES or a provider to COURSE_PROVIDERS and the routes, filters
 * and sitemap pick it up automatically — no schema change required.
 *
 * The course marketplace never processes payments — it is a discovery /
 * comparison platform, and the purchase happens on the provider's site (Udemy,
 * Coursera, …) via an affiliate network (Impact, …). We never fabricate
 * ratings, prices, reviews or instructors.
 */

export const COURSES_BRAND = "NBN MARKET Courses";
export const COURSES_TAGLINE = "Online courses worth taking";

/** Absolute courses base URL (canonical). */
export function coursesUrl(path = ""): string {
  return `${siteUrl()}/courses${path}`;
}

/* ------------------------------------------------------------------ *
 * Categories
 *
 * Grouped so the landing page can present them in tidy clusters, but each is a
 * flat slug used in the URL (/courses/<slug>) and stored on Course.category.
 * ------------------------------------------------------------------ */

export type CourseCategory = {
  slug: string;
  name: string;
  icon: string;
  group: string;
  blurb: string;
};

export const COURSE_CATEGORIES: CourseCategory[] = [
  // Cloud & Infrastructure
  { slug: "cloud-computing", name: "Cloud Computing", icon: "☁️", group: "Cloud & Infrastructure", blurb: "Master cloud platforms, architecture and deployment." },
  { slug: "aws", name: "AWS", icon: "🟠", group: "Cloud & Infrastructure", blurb: "Amazon Web Services — from fundamentals to certifications." },
  { slug: "microsoft-azure", name: "Microsoft Azure", icon: "🔷", group: "Cloud & Infrastructure", blurb: "Build, deploy and manage on Microsoft Azure." },
  { slug: "devops", name: "DevOps", icon: "♾️", group: "Cloud & Infrastructure", blurb: "CI/CD, containers, IaC and modern delivery." },
  { slug: "cybersecurity", name: "Cybersecurity", icon: "🛡️", group: "Cloud & Infrastructure", blurb: "Defend systems, networks and data." },
  { slug: "networking", name: "Networking", icon: "🌐", group: "Cloud & Infrastructure", blurb: "Networks, protocols and infrastructure." },
  // Programming
  { slug: "programming", name: "Programming", icon: "💻", group: "Programming & Development", blurb: "Core programming skills across languages." },
  { slug: "web-development", name: "Web Development", icon: "🖥️", group: "Programming & Development", blurb: "Front-end, back-end and full-stack web." },
  { slug: "mobile-development", name: "Mobile Development", icon: "📱", group: "Programming & Development", blurb: "iOS, Android and cross-platform apps." },
  { slug: "python", name: "Python", icon: "🐍", group: "Programming & Development", blurb: "Python for scripting, data and the web." },
  { slug: "javascript", name: "JavaScript", icon: "🟨", group: "Programming & Development", blurb: "The language of the web, end to end." },
  { slug: "react", name: "React", icon: "⚛️", group: "Programming & Development", blurb: "Build modern UIs with React." },
  { slug: "nextjs", name: "Next.js", icon: "▲", group: "Programming & Development", blurb: "Full-stack React with Next.js." },
  { slug: "software-engineering", name: "Software Engineering", icon: "🧩", group: "Programming & Development", blurb: "Design, architecture and best practices." },
  { slug: "database", name: "Database", icon: "🗄️", group: "Programming & Development", blurb: "SQL, NoSQL and data modelling." },
  // Data & AI
  { slug: "data-science", name: "Data Science", icon: "📊", group: "Data & AI", blurb: "Turn data into insight and decisions." },
  { slug: "artificial-intelligence", name: "Artificial Intelligence", icon: "🤖", group: "Data & AI", blurb: "AI foundations and applications." },
  { slug: "machine-learning", name: "Machine Learning", icon: "🧠", group: "Data & AI", blurb: "Models, training and real-world ML." },
  // Design & Creative
  { slug: "ui-ux-design", name: "UI/UX Design", icon: "🎨", group: "Design & Creative", blurb: "Design products people love to use." },
  { slug: "graphic-design", name: "Graphic Design", icon: "🖌️", group: "Design & Creative", blurb: "Visual design, branding and layout." },
  { slug: "video-editing", name: "Video Editing", icon: "🎬", group: "Design & Creative", blurb: "Edit and produce professional video." },
  // Business & Growth
  { slug: "digital-marketing", name: "Digital Marketing", icon: "📈", group: "Business & Growth", blurb: "SEO, ads, content and social growth." },
  { slug: "business", name: "Business", icon: "💼", group: "Business & Growth", blurb: "Entrepreneurship, strategy and operations." },
  { slug: "finance", name: "Finance", icon: "💰", group: "Business & Growth", blurb: "Personal finance, investing and accounting." },
  { slug: "personal-development", name: "Personal Development", icon: "🌱", group: "Business & Growth", blurb: "Productivity, mindset and career growth." },
  { slug: "project-management", name: "Project Management", icon: "📋", group: "Business & Growth", blurb: "Agile, Scrum and delivery leadership." },
  { slug: "excel-office", name: "Excel & Office", icon: "📑", group: "Business & Growth", blurb: "Spreadsheets and productivity tools." },
  { slug: "languages", name: "Languages", icon: "🗣️", group: "Business & Growth", blurb: "Learn a new language, faster." },
  { slug: "other", name: "Other", icon: "🏷️", group: "More", blurb: "Everything else worth learning." },
];

export const COURSE_CATEGORY_MAP: Record<string, CourseCategory> = Object.fromEntries(
  COURSE_CATEGORIES.map((c) => [c.slug, c]),
);

export function isCourseCategorySlug(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(COURSE_CATEGORY_MAP, slug);
}

/** Turn any slug into a readable label (for admin-added categories). */
export function courseSlugToLabel(slug: string): string {
  return (slug || "")
    .split(/[-_/]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function courseCategoryLabel(slug?: string | null): string {
  if (!slug) return "";
  return COURSE_CATEGORY_MAP[slug]?.name || courseSlugToLabel(slug);
}

export function courseCategoryIcon(slug?: string | null): string {
  if (!slug) return "🏷️";
  return COURSE_CATEGORY_MAP[slug]?.icon || "🏷️";
}

/** Categories grouped for a scannable landing page. */
export function courseCategoriesByGroup(): { group: string; categories: CourseCategory[] }[] {
  const order = [
    "Cloud & Infrastructure",
    "Programming & Development",
    "Data & AI",
    "Design & Creative",
    "Business & Growth",
    "More",
  ];
  const groups: Record<string, CourseCategory[]> = {};
  for (const c of COURSE_CATEGORIES) (groups[c.group] ||= []).push(c);
  return Object.keys(groups)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map((group) => ({ group, categories: groups[group] }));
}

/* ------------------------------------------------------------------ *
 * Affiliate providers / networks
 *
 * A provider is where the course is sold (Udemy); the network is how the link
 * is tracked (Impact). New providers can be added here without code changes to
 * the UI — the frontend only ever consumes the resolved tracked URL.
 * ------------------------------------------------------------------ */

export type CourseProvider = {
  /** Stored on Course.provider (case-sensitive display name). */
  name: string;
  /** Default affiliate network for this provider (Course.affiliateNetwork). */
  network: string;
  /** Public homepage — used only for the provider badge/label, never for links. */
  homepage: string;
};

export const COURSE_PROVIDERS: CourseProvider[] = [
  { name: "Udemy", network: "Impact", homepage: "https://www.udemy.com" },
  { name: "Coursera", network: "Impact", homepage: "https://www.coursera.org" },
  { name: "Skillshare", network: "Impact", homepage: "https://www.skillshare.com" },
  { name: "LinkedIn Learning", network: "Impact", homepage: "https://www.linkedin.com/learning" },
  { name: "edX", network: "Impact", homepage: "https://www.edx.org" },
  { name: "Pluralsight", network: "Impact", homepage: "https://www.pluralsight.com" },
  { name: "Other", network: "Impact", homepage: "" },
];

export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"] as const;
export const COURSE_LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "German",
  "Portuguese",
  "Arabic",
  "Other",
] as const;

export const COURSE_SORTS = [
  { value: "", label: "Relevance" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Lowest Price" },
  { value: "price-desc", label: "Highest Price" },
  { value: "newest", label: "Newest" },
] as const;

/* ------------------------------------------------------------------ *
 * Centralized affiliate link resolution
 *
 * The SINGLE place the app turns a Course into an outbound tracked URL. The
 * frontend calls resolveCourseUrl(course) and never touches affiliate URLs
 * directly. Today it returns the stored, network-generated tracked link
 * (e.g. the Impact-generated Udemy URL); later it can layer sub-IDs or
 * per-network transforms here without any UI change.
 * ------------------------------------------------------------------ */

export function resolveCourseUrl(course: Pick<Course, "affiliateUrl" | "externalProductUrl">): string | null {
  const url = (course.affiliateUrl || "").trim();
  if (url) return url;
  // No affiliate link yet. We deliberately do NOT fall back to a non-tracked
  // external URL for the CTA — the button shows a "coming soon" state instead.
  return null;
}

/** Whether a course has a usable outbound (tracked) link. */
export function hasCourseLink(course: Pick<Course, "affiliateUrl" | "externalProductUrl">): boolean {
  return resolveCourseUrl(course) != null;
}

/** CTA label, contextual to the provider ("View on Udemy" / "View Course"). */
export function courseCtaLabel(course: Pick<Course, "provider">, context: "card" | "detail" = "card"): string {
  const provider = (course.provider || "").trim();
  if (context === "detail" && provider) return `View Course on ${provider}`;
  if (provider && provider.toLowerCase() !== "other") return `View on ${provider}`;
  return "View Course";
}

/** Course page path (relative). */
export function coursePath(slug: string): string {
  return `/courses/${slug}`;
}

/** Category page path (relative). */
export function courseCategoryPath(slug: string): string {
  return `/courses/${slug}`;
}

/* ------------------------------------------------------------------ *
 * Pricing / discount helpers
 * ------------------------------------------------------------------ */

/** Effective discount %: explicit value, else derived from price vs originalPrice. */
export function courseDiscountPercent(
  course: Pick<Course, "price" | "originalPrice" | "discountPercentage">,
): number | null {
  if (course.discountPercentage != null && course.discountPercentage > 0) {
    return Math.round(course.discountPercentage);
  }
  if (
    course.price != null &&
    course.originalPrice != null &&
    course.originalPrice > course.price &&
    course.originalPrice > 0
  ) {
    return Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
  }
  return null;
}

/** Affiliate disclosure copy — used on every course surface with links. */
export const COURSE_DISCLOSURE =
  "Disclosure: NBN Market may earn a commission when you purchase through qualifying affiliate links. This does not affect the price you pay.";
