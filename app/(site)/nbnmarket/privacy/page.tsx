import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/marketplace/MarketHeader";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/marketplace/Breadcrumbs";
import { JsonLd } from "@/components/marketplace/JsonLd";
import { BRAND } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

const CONTACT_EMAIL = "ndimihboclair4@gmail.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How NBN MARKET collects, uses and protects your information. We keep data collection minimal, never sell your data, and explain the third-party services (analytics, affiliate networks, Telegram, Pinterest) involved.",
  alternates: { canonical: "/nbnmarket/privacy" },
  openGraph: { title: `Privacy Policy — ${BRAND}`, type: "website" },
};

export default function PrivacyPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "NBN Market", url: "/nbnmarket" },
    { name: "Privacy Policy", url: "/nbnmarket/privacy" },
  ];
  const updated = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <MarketHeader />
      <Container className="pb-8">
        <Breadcrumbs items={crumbs} />
        <article className="mx-auto max-w-3xl space-y-4 text-ink-body">
          <h1 className="font-serif text-3xl font-bold text-ink">Privacy Policy</h1>
          <p className="text-sm text-ink-muted">Last updated: {updated}</p>

          <p>
            NBN MARKET (&ldquo;we&rdquo;, &ldquo;us&rdquo;), operated by NBN TECH, is a product-discovery and
            comparison platform. This policy explains what information we collect, how we use it, and the choices
            you have. We keep data collection to a minimum and we never sell your personal data.
          </p>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Who we are</h2>
          <p>
            NBN MARKET is an independent affiliate platform. We do not sell products directly or process payments —
            purchases happen on the retailer&rsquo;s own website (Amazon, Selar, Awin merchants and others). You can
            reach us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-cyan-deep hover:underline">{CONTACT_EMAIL}</a>.
          </p>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Information we collect</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <b>Usage &amp; analytics (non-identifying):</b> pages viewed, searches, category and product clicks,
              outbound &ldquo;buy&rdquo; clicks, and an approximate country (from your selection or coarse
              region), used to improve the site. We do not build profiles that identify you personally.
            </li>
            <li>
              <b>Preferences:</b> your selected delivery country is stored in your browser (local storage) so prices
              show in your currency.
            </li>
            <li>
              <b>Contact / WhatsApp:</b> if you message us (e.g. via WhatsApp or email), we receive the details you
              choose to send so we can reply and, where you ask, connect you with a trusted seller.
            </li>
            <li>
              <b>Telegram bot:</b> if you use our Telegram bot, we store your Telegram chat ID and chosen country so
              the bot can reply and localize prices. You can stop this at any time by blocking the bot.
            </li>
          </ul>
          <p>
            We do <b>not</b> run public sign-ups or collect passwords, card numbers, or government IDs on this site.
          </p>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">How we use information</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>To show relevant products and localize prices to your country.</li>
            <li>To understand which products and pages are useful, and improve the platform.</li>
            <li>To respond to your messages and support requests.</li>
          </ul>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Third-party services</h2>
          <p>
            When you click an outbound link, the destination retailer and its affiliate network (such as Amazon
            Associates, Awin, or impact.com) may set their own cookies to attribute a purchase. We may also use
            privacy-respecting analytics, and we distribute product content to social platforms such as{" "}
            <b>Pinterest</b> (pins link back to our pages). These third parties handle data under their own privacy
            policies, which we encourage you to review.
          </p>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Cookies &amp; local storage</h2>
          <p>
            We use essential storage to remember your country preference and best-effort analytics to measure
            engagement. You can clear cookies and local storage in your browser at any time; some conveniences
            (like your saved country) will simply reset.
          </p>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Data sharing &amp; retention</h2>
          <p>
            We do not sell your personal data. We share only what&rsquo;s necessary with the service providers above
            to run the platform. Analytics events are retained in aggregate; Telegram and contact data are kept only
            as long as needed to provide the service or until you ask us to delete them.
          </p>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Your choices &amp; rights</h2>
          <p>
            You may request access to, correction of, or deletion of information we hold about you (for example your
            Telegram record) by emailing{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-cyan-deep hover:underline">{CONTACT_EMAIL}</a>. You
            can opt out of the Telegram bot by blocking it, and you can decline non-essential cookies in your
            browser.
          </p>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Children</h2>
          <p>NBN MARKET is not directed at children under 13, and we do not knowingly collect their data.</p>

          <h2 className="pt-2 font-serif text-xl font-bold text-ink">Changes to this policy</h2>
          <p>
            We may update this policy from time to time; the &ldquo;last updated&rdquo; date above reflects the
            latest version. See also our{" "}
            <Link href="/nbnmarket/disclosure" className="text-cyan-deep hover:underline">affiliate disclosure</Link>{" "}
            and{" "}
            <Link href="/nbnmarket/returns" className="text-cyan-deep hover:underline">returns policy</Link>.
          </p>
        </article>
      </Container>
    </>
  );
}
