import type { ResolvedSiteContent } from "@/lib/data";

/**
 * Identity + SEO config. Centralises the owner's name, aliases and services so
 * they flow into metadata, keywords and JSON-LD structured data consistently —
 * this is what lets search engines associate the site with the person's name
 * and services.
 */
export const OWNER = {
  name: "Ndimih Boclair Nghochu",
  alternateNames: ["Ndimih Boclair", "Boclair Nghochu", "Ndimih Boclair Nghochu", "NBN"],
  brand: "NBN TECH",
  jobTitle: "Software Engineer",
  services: [
    "Web Development",
    "Mobile App Development",
    "Cloud Computing",
    "DevOps",
    "Software Engineering",
  ],
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "React Native",
    "AWS",
    "Docker",
    "CI/CD",
    "PostgreSQL",
  ],
} as const;

/** Keyword list combining the owner's names and services for meta keywords. */
export function seoKeywords(): string[] {
  return [
    ...OWNER.alternateNames,
    OWNER.name,
    OWNER.brand,
    `${OWNER.name} software engineer`,
    `${OWNER.brand} ${OWNER.name}`,
    ...OWNER.services,
    ...OWNER.skills,
    "software engineer",
    "full-stack developer",
    "web developer",
    "mobile app developer",
    "cloud engineer",
    "DevOps engineer",
  ];
}

/** Default description that names the person + brand + services. */
export function seoDescription(fallback?: string): string {
  return (
    fallback ||
    `${OWNER.name} (${OWNER.brand}) is a ${OWNER.jobTitle.toLowerCase()} specializing in web development, mobile apps, cloud computing and DevOps — building software that ships and lasts.`
  );
}

/**
 * JSON-LD graph: Person (the owner, with name aliases + services), the brand as
 * a ProfessionalService, and the WebSite. Emitted in the document head.
 */
export function buildJsonLd(content: ResolvedSiteContent, url: string, galleryUrls: string[] = []) {
  const sameAs = Object.values(content.socialLinks || {}).filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
  const email = content.contactEmail || undefined;
  const icon = `${url}/icon.png`;
  const abs = (r: string) => (r.startsWith("http") ? r : `${url}${r}`);
  // Person image(s): the brand mark plus any gallery photos (helps image search).
  const image = [icon, ...galleryUrls.map(abs)];

  const person = {
    "@type": "Person",
    "@id": `${url}/#person`,
    name: OWNER.name,
    alternateName: OWNER.alternateNames,
    url,
    image,
    jobTitle: OWNER.jobTitle,
    description: seoDescription(content.metaDescription),
    knowsAbout: [...OWNER.services, ...OWNER.skills],
    email,
    sameAs,
    worksFor: { "@id": `${url}/#brand` },
  };

  const brand = {
    "@type": "ProfessionalService",
    "@id": `${url}/#brand`,
    name: OWNER.brand,
    alternateName: `${OWNER.brand} — ${OWNER.name}`,
    url,
    image: icon,
    logo: icon,
    email,
    founder: { "@id": `${url}/#person` },
    description: seoDescription(content.metaDescription),
    areaServed: "Worldwide",
    knowsAbout: OWNER.services,
    sameAs,
    makesOffer: OWNER.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s },
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: `${OWNER.brand} — ${OWNER.name}`,
    description: seoDescription(content.metaDescription),
    publisher: { "@id": `${url}/#person` },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, brand, website],
  };
}
