import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { BRAND } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description:
    "NBN MARKET return and refund policy. NBN MARKET is a product-discovery platform; purchases and returns are handled by the retailer where you complete your order (Amazon, Selar and partners).",
  alternates: { canonical: "/nbnmarket/returns" },
  openGraph: { title: `Return & Refund Policy — ${BRAND}`, type: "website" },
};

export default function ReturnsPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "NBN Market", url: "/nbnmarket" },
    { name: "Returns & refunds", url: "/nbnmarket/returns" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <MarketHeader />
      <Container className="pb-6">
        <Breadcrumbs items={crumbs} />
        <article className="mx-auto max-w-3xl space-y-5 text-ink-body">
          <h1 className="font-serif text-3xl font-bold text-ink">Return &amp; Refund Policy</h1>

          <p>
            NBN MARKET is an independent product-discovery and comparison platform. We do not sell,
            ship, or take payment for the products listed on this site. When you choose to buy an item,
            you are taken to the retailer&apos;s own website (for example Amazon, Selar or another
            partner store) to complete your purchase there.
          </p>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Where returns are handled</h2>
          <p>
            Because your order is placed and fulfilled by the retailer — not by NBN MARKET — all returns,
            refunds, exchanges, and cancellations are governed by <strong>that retailer&apos;s own return
            policy</strong>, which you agree to at checkout. To start a return, use the account or order
            history on the store where you completed the purchase.
          </p>

          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Amazon purchases:</strong> most physical items can be returned within{" "}
              <strong>30 days of delivery</strong> under Amazon&apos;s Returns Policy. Manage a return
              from <em>Your Orders → Return or replace items</em> on the Amazon site where you bought it.
            </li>
            <li>
              <strong>Selar &amp; digital products (courses, downloads):</strong> digital goods are often
              non-returnable once accessed or downloaded. Refund eligibility is set by the seller and
              Selar&apos;s policies shown at checkout.
            </li>
            <li>
              <strong>Other partner stores:</strong> the return window and conditions are those published
              by that specific retailer at the time of purchase.
            </li>
          </ul>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Prices &amp; availability</h2>
          <p>
            Prices and availability shown on NBN MARKET are indicative and may change. The price you pay,
            stock status, delivery, warranty, and the applicable return terms are always those confirmed
            on the retailer&apos;s own website at the moment of purchase.
          </p>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Need help?</h2>
          <p>
            If you&apos;re unsure where you bought an item or which policy applies, contact us at{" "}
            <a href="mailto:boclair42@gmail.com" className="text-cyan-deep hover:underline">
              boclair42@gmail.com
            </a>{" "}
            and we&apos;ll help you find the right retailer and their returns process. We can guide you,
            but the return itself is processed by the store that fulfilled your order.
          </p>

          <p className="text-sm text-ink-muted">
            NBN MARKET is an independent platform and is not affiliated with, endorsed by, or operated by
            Amazon, Selar, or any other retailer.
          </p>
        </article>
      </Container>
    </>
  );
}
