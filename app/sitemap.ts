import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/data";
import { getAllProductSlugs } from "@/lib/marketplace-data";
import { CATEGORIES, GUIDES } from "@/lib/marketplace";
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
    { path: "/marketplace", priority: 0.9, freq: "daily" as const },
    { path: "/marketplace/guides", priority: 0.7, freq: "weekly" as const },
    { path: "/marketplace/about", priority: 0.4, freq: "monthly" as const },
    { path: "/marketplace/disclosure", priority: 0.3, freq: "yearly" as const },
  ].map((r) => ({ url: `${base}${r.path}`, lastModified: now, changeFrequency: r.freq, priority: r.priority }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${base}/marketplace/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guideRoutes = GUIDES.map((g) => ({
    url: `${base}/marketplace/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productSlugs = await getAllProductSlugs();
  const productRoutes = productSlugs.map((slug) => ({
    url: `${base}/marketplace/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...marketplaceHubs,
    ...categoryRoutes,
    ...guideRoutes,
    ...productRoutes,
  ];
}
