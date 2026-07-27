import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** URL-safe slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Human label for the ProjectCategory / SkillCategory enum values. */
export function categoryLabel(value: string): string {
  switch (value) {
    case "CloudDevOps":
      return "Cloud & DevOps";
    case "Web":
      return "Web";
    case "Mobile":
      return "Mobile";
    case "Desktop":
      return "Desktop";
    case "Frontend":
      return "Frontend";
    case "Backend":
      return "Backend";
    default:
      return "Other";
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

/** The site's canonical production domain. */
export const SITE_DOMAIN = "https://www.ndimihboclair.com";

/** Absolute site origin, safe on server and client. Prefers an explicit
 *  NEXT_PUBLIC_SITE_URL; on Vercel production it uses the canonical custom
 *  domain; preview deployments use their per-deployment URL; else localhost.
 *  Keeps canonical/OG/sitemap/JSON-LD URLs consistent for SEO. */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_ENV === "production") {
    return SITE_DOMAIN;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
