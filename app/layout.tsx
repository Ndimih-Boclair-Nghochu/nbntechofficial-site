import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { getSiteContent } from "@/lib/data";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const url = siteUrl();
  const title = content.metaTitle || "NBN TECH — Software Engineering, Done Properly";
  const description =
    content.metaDescription ||
    "NBN TECH is the personal engineering brand of a software engineer specializing in web development, mobile apps, cloud computing, and DevOps.";

  return {
    metadataBase: new URL(url),
    title: {
      default: title,
      template: "%s · NBN TECH",
    },
    description,
    applicationName: "NBN TECH",
    authors: [{ name: "NBN TECH" }],
    keywords: [
      "software engineer",
      "web development",
      "mobile app development",
      "cloud computing",
      "DevOps",
      "NBN TECH",
    ],
    icons: {
      icon: [{ url: "/icon.png", type: "image/png" }],
      apple: "/apple-icon.png",
    },
    openGraph: {
      type: "website",
      siteName: "NBN TECH",
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
