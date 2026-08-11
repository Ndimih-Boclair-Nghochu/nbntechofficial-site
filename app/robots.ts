import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal search results and sort/filter/tracking parameter variants are
      // kept out of the index; canonicals point crawlers at the clean URLs.
      disallow: ["/admin", "/api", "/marketplace/search", "/*?sort=", "/*?*utm_"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
