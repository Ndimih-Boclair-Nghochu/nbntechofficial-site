import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { BRAND } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Our affiliate disclosure: some marketplace links are Amazon affiliate links. We may earn a commission at no extra cost to you; it never changes our recommendations.",
  alternates: { canonical: "/marketplace/disclosure" },
  openGraph: { title: `Affiliate Disclosure — ${BRAND}`, type: "website" },
};

export default function DisclosurePage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Marketplace", url: "/marketplace" },
    { name: "Affiliate disclosure", url: "/marketplace/disclosure" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <MarketHeader />
      <Container className="pb-4">
        <Breadcrumbs items={crumbs} />
        <article className="mx-auto max-w-3xl space-y-4 text-ink-body">
          <h1 className="font-serif text-3xl font-bold text-ink">Affiliate disclosure</h1>
          <p>
            Some links on the NBN MARKET are affiliate links, including links to Amazon
            marketplaces (amazon.de, amazon.co.uk, amazon.fr, amazon.it, amazon.es and others). If you
            click one of these links and make a purchase, we may earn a commission at no additional cost
            to you.
          </p>
          <p>
            As an Amazon Associate we earn from qualifying purchases. Affiliate commissions help us keep
            the marketplace free to use. They never change which products we recommend or what we say
            about them.
          </p>
          <p>
            Prices and availability shown on this site are indicative and may be out of date. The price
            you pay, and whether an item is in stock, are always confirmed on Amazon at the time of
            purchase.
          </p>
          <p>
            We are an independent platform. We are not affiliated with, endorsed by, or operated by
            Amazon.
          </p>
        </article>
      </Container>
    </>
  );
}
