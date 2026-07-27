import type { MetadataRoute } from "next";
import { OWNER } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${OWNER.brand} — ${OWNER.name}`,
    short_name: OWNER.brand,
    description: `${OWNER.name}: software engineer — web, mobile, cloud & DevOps.`,
    start_url: "/",
    display: "standalone",
    background_color: "#030A3B",
    theme_color: "#04045E",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
