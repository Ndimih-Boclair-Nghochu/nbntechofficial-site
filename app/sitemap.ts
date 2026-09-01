import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/data";
import { getAllProductSlugs } from "@/lib/marketplace-data";
import { CATEGORIES, GUIDES } from "@/lib/marketplace";
import { BLOG_POSTS } from "@/lib/blog";
import { getAllCourseSlugs, getAvailableCourseCategories } from "@/lib/courses-data";
import { siteUrl } from "@/lib/utils";

// Regenerate hourly so newly-added marketplace products appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes = ["", "/about", "/work", "/gallery", "/reviews", "/process", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const slugs = await getAllProjectSlugs();
  const projectRoutes = slugs.map((slug) => ({
    url: `${base}/work/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // --- Marketplace ---
  const marketplaceHubs = [
    { path: "/nbnmarket", priority: 0.9, freq: "daily" as const },
    { path: "/nbnmarket/guides", priority: 0.7, freq: "weekly" as const },
    { path: "/nbnmarket/about", priority: 0.4, freq: "monthly" as const },
    { path: "/nbnmarket/disclosure", priority: 0.3, freq: "yearly" as const },
    { path: "/nbnmarket/privacy", priority: 0.3, freq: "yearly" as const },
    { path: "/nbnmarket/returns", priority: 0.3, freq: "yearly" as const },
  ].map((r) => ({ url: `${base}${r.path}`, lastModified: now, changeFrequency: r.freq, priority: r.priority }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${base}/nbnmarket/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guideRoutes = GUIDES.map((g) => ({
    url: `${base}/nbnmarket/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogRoutes = [
    { url: `${base}/nbnmarket/blog`, lastModified: now, changeFrequency: "daily" as const, priority: 0.7 },
    ...BLOG_POSTS.map((p) => ({
      url: `${base}/nbnmarket/blog/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const productSlugs = await getAllProductSlugs();
  const productRoutes = productSlugs.map((slug) => ({
    url: `${base}/nbnmarket/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // One auto-generated blog article per product (created the moment it's added).
  const productBlogRoutes = productSlugs.map((slug) => ({
    url: `${base}/nbnmarket/blog/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // --- Online Courses ---
  const coursesHub = [{ url: `${base}/courses`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 }];

  const courseCategories = await getAvailableCourseCategories();
  const courseCategoryRoutes = courseCategories.map((c) => ({
    url: `${base}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const courseSlugs = await getAllCourseSlugs();
  const courseRoutes = courseSlugs.map((slug) => ({
    url: `${base}/courses/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // One auto-generated blog article per course (created the moment it's posted).
  const courseBlogRoutes = courseSlugs.map((slug) => ({
    url: `${base}/nbnmarket/blog/course/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...marketplaceHubs,
    ...categoryRoutes,
    ...guideRoutes,
    ...blogRoutes,
    ...productRoutes,
    ...productBlogRoutes,
    ...coursesHub,
    ...courseCategoryRoutes,
    ...courseRoutes,
    ...courseBlogRoutes,
  ];
}
