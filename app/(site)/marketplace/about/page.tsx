import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { BRAND } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About & Methodology",
  description:
    "How the NBN MARKET researches and recommends products, and how our independent, affiliate-supported model works.",
  alternates: { canonical: "/marketplace/about" },
  openGraph: { title: `About & Methodology — ${BRAND}`, type: "website" },
};

export default function AboutPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Marketplace", url: "/marketplace" },
    { name: "About", url: "/marketplace/about" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <MarketHeader />
      <Container className="pb-4">
        <Breadcrumbs items={crumbs} />
        <article className="mx-auto max-w-3xl prose-nbn">
          <h1 className="font-serif text-3xl font-bold text-ink">About NBN MARKET</h1>
          <p className="mt-4 text-lg text-ink-body">
            NBN MARKET is an independent product-discovery platform. We research
            and recommend products worth buying, explain the trade-offs in plain language, and help
            you compare offers and check availability across Amazon and other trusted retailers in your
            country.
          </p>

          <h2 className="mt-10 font-serif text-2xl font-bold text-ink">How we recommend products</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-body marker:text-cyan">
            <li>We focus on real use cases — “best laptop for programming”, not vague superlatives.</li>
            <li>Every product page lists honest pros <em>and</em> cons.</li>
            <li>We never fabricate ratings, reviews, prices or availability. When we do not have reliable data, we say so.</li>
            <li>We only mark a product “available” in a country when we actually have that information.</li>
          </ul>

          <h2 className="mt-10 font-serif text-2xl font-bold text-ink">How we make money</h2>
          <p className="mt-3 text-ink-body">
            Some links are affiliate links — to Amazon and to other retailers through affiliate networks.
            If you buy through one, we may earn a commission at no additional cost to you. This never
            influences our recommendations — see our{" "}
            <Link href="/marketplace/disclosure" className="text-cyan-deep underline underline-offset-2">
              full affiliate disclosure
            </Link>
            .
          </p>

          <h2 className="mt-10 font-serif text-2xl font-bold text-ink">Who is behind it</h2>
          <p className="mt-3 text-ink-body">
            The marketplace is operated by NBN TECH under the Ndimih Boclair brand. Questions?{" "}
            <Link href="/contact" className="text-cyan-deep underline underline-offset-2">Get in touch</Link>.
          </p>
        </article>
      </Container>
    </>
  );
}
