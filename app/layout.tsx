import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Inter } from "next/font/google";
import { getSiteContent, getGalleryImages } from "@/lib/data";
import { siteUrl } from "@/lib/utils";
import { OWNER, seoKeywords, seoDescription, buildJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const url = siteUrl();
  const title =
    content.metaTitle ||
    `${OWNER.brand} — ${OWNER.name} | Software Engineer (Web · Mobile · Cloud · DevOps)`;
  const description = seoDescription(content.metaDescription);

  return {
    metadataBase: new URL(url),
    title: {
      default: title,
      template: `%s · ${OWNER.brand} — ${OWNER.name}`,
    },
    description,
    applicationName: OWNER.brand,
    authors: [{ name: OWNER.name, url }],
    creator: OWNER.name,
    publisher: OWNER.brand,
    keywords: seoKeywords(),
    alternates: { canonical: url },
    verification: {
      google: "4T3wr-CcOy_a12yG0pPccDCUhszu5kXZGHuq9_KpddI",
    },
    // Favicon + apple icon are auto-detected from app/icon.png and
    // app/apple-icon.png (Next.js file-based metadata).
    openGraph: {
      type: "website",
      siteName: `${OWNER.brand} — ${OWNER.name}`,
      title,
      description,
      url,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@nbntech",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [content, gallery] = await Promise.all([getSiteContent(), getGalleryImages({ take: 12 })]);
  const jsonLd = buildJsonLd(content, siteUrl(), gallery.map((g) => g.url));

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Structured data: Person + ProfessionalService + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        {children}

        {/* Awin Publisher MasterTag (publisher 3033801) — loaded globally once
            via next/script; persists across client-side navigation without
            duplicating. Powers Awin tracking, Convert-a-Link, Bounceless
            Tracking and adMission disclosure. */}
        <Script
          id="awin-mastertag"
          src="https://www.dwin2.com/pub.3033801.min.js"
          strategy="afterInteractive"
        />

        {/* impact.com Universal Tracking Tag (account P-A7615000-...). Loads the
            impact.com tracker, transforms affiliate links and records impressions.
            Also serves as impact.com site verification. Loaded globally once. */}
        <Script id="impact-utt" strategy="afterInteractive">
          {`(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7615000-1d05-4453-8029-7ba278f054be1.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`}
        </Script>
      </body>
    </html>
  );
}
