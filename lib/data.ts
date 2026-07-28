import type { Project, Skill, Testimonial } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  defaultSiteContent,
  defaultSocialLinks,
  type SocialLinks,
} from "@/lib/content-defaults";

/**
 * Resilient read layer for the public site.
 *
 * Every query is wrapped so that a missing/empty/unreachable database degrades
 * gracefully: site copy falls back to on-brand defaults, and list sections
 * (skills, projects, testimonials) simply render empty and hide themselves.
 * This keeps the site rendering on first deploy before content is added, and
 * keeps local preview working without a database configured.
 */

export type ResolvedSiteContent = Omit<
  typeof defaultSiteContent,
  "socialLinks"
> & {
  socialLinks: SocialLinks;
};

function logDbIssue(where: string, err: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[data] ${where}: falling back to defaults —`, (err as Error)?.message);
  }
}

export async function getSiteContent(): Promise<ResolvedSiteContent> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { id: "singleton" } });
    if (!row) return { ...defaultSiteContent, socialLinks: defaultSocialLinks };

    const social =
      row.socialLinks && typeof row.socialLinks === "object"
        ? (row.socialLinks as SocialLinks)
        : defaultSocialLinks;

    // Merge: a stored empty string means "not set yet" → keep the default copy.
    const merged: ResolvedSiteContent = {
      ...defaultSiteContent,
      ...Object.fromEntries(
        Object.entries(row).filter(([, v]) => v !== "" && v !== null),
      ),
      socialLinks: Object.keys(social).length ? social : defaultSocialLinks,
    } as ResolvedSiteContent;

    return merged;
  } catch (err) {
    logDbIssue("getSiteContent", err);
    return { ...defaultSiteContent, socialLinks: defaultSocialLinks };
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    return await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
    });
  } catch (err) {
    logDbIssue("getSkills", err);
    return [];
  }
}

export async function getProjects(opts?: {
  featured?: boolean;
}): Promise<Project[]> {
  try {
    return await prisma.project.findMany({
      where: opts?.featured ? { featured: true } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    logDbIssue("getProjects", err);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const featured = await getProjects({ featured: true });
  if (featured.length) return featured.slice(0, 4);
  // If nothing is explicitly featured, surface the first few projects.
  const all = await getProjects();
  return all.slice(0, 4);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await prisma.project.findUnique({ where: { slug } });
  } catch (err) {
    logDbIssue("getProjectBySlug", err);
    return null;
  }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.project.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch (err) {
    logDbIssue("getAllProjectSlugs", err);
    return [];
  }
}

/** Previous/next project in display order, for case-study navigation. */
export async function getAdjacentProjects(slug: string): Promise<{
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}> {
  try {
    const ordered = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: { slug: true, title: true },
    });
    const i = ordered.findIndex((p) => p.slug === slug);
    if (i === -1) return { prev: null, next: null };
    return {
      prev: i > 0 ? ordered[i - 1] : null,
      next: i < ordered.length - 1 ? ordered[i + 1] : null,
    };
  } catch (err) {
    logDbIssue("getAdjacentProjects", err);
    return { prev: null, next: null };
  }
}

export async function getTestimonials(opts?: {
  approvedOnly?: boolean;
}): Promise<Testimonial[]> {
  try {
    return await prisma.testimonial.findMany({
      where: opts?.approvedOnly ? { approved: true } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    logDbIssue("getTestimonials", err);
    return [];
  }
}

export async function getGalleryImages(opts?: { featured?: boolean; take?: number }) {
  try {
    return await prisma.galleryImage.findMany({
      where: opts?.featured ? { featured: true } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: opts?.take,
    });
  } catch (err) {
    logDbIssue("getGalleryImages", err);
    return [];
  }
}

export async function getContactMessages() {
  try {
    return await prisma.contactMessage.findMany({
      orderBy: [{ createdAt: "desc" }],
    });
  } catch (err) {
    logDbIssue("getContactMessages", err);
    return [];
  }
}

/** Counts for the admin dashboard. */
export async function getAdminCounts() {
  try {
    const [projects, featured, skills, testimonials, pendingReviews, unreadMessages] =
      await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { featured: true } }),
        prisma.skill.count(),
        prisma.testimonial.count({ where: { approved: true } }),
        prisma.testimonial.count({ where: { approved: false } }),
        prisma.contactMessage.count({ where: { read: false } }),
      ]);
    return {
      projects,
      featured,
      skills,
      testimonials,
      pendingReviews,
      unreadMessages,
      ok: true as const,
    };
  } catch (err) {
    logDbIssue("getAdminCounts", err);
    return {
      projects: 0,
      featured: 0,
      skills: 0,
      testimonials: 0,
      pendingReviews: 0,
      unreadMessages: 0,
      ok: false as const,
    };
  }
}
