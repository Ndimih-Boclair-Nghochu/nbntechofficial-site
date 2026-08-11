import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CountryProvider } from "@/components/marketplace/CountryProvider";
import { AffiliateDisclosure } from "@/components/marketplace/AffiliateDisclosure";
import { getRequestCountry } from "@/lib/marketplace-server";
import { CATEGORIES, GUIDES } from "@/lib/marketplace";

/**
 * Marketplace shell: shares the country context + a compact footer across every
 * marketplace page. Sits inside the global (site) layout, so it inherits the
 * main site navbar and footer — the marketplace feels like a natural extension
 * of the Ndimih Boclair site, not a separate app.
 */
export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const initial = getRequestCountry();

  return (
    <CountryProvider initial={initial}>
      {/* pt clears the fixed global navbar */}
      <div className="min-h-screen bg-canvas pt-16 md:pt-[72px]">
        {children}

        {/* Marketplace footer band */}
        <div className="mt-16 border-t border-ink-line bg-surface">
          <Container className="py-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-serif text-lg font-bold text-ink">Ndimih Boclair Marketplace</p>
                <p className="mt-2 text-sm text-ink-muted">
                  Independent product recommendations. We help you compare options and decide with
                  confidence — the purchase happens securely on Amazon.
                </p>
              </div>
              <FooterCol title="Categories">
                {CATEGORIES.slice(0, 6).map((c) => (
                  <Link key={c.slug} href={`/marketplace/category/${c.slug}`} className="hover:text-cyan-deep">
                    {c.name}
                  </Link>
                ))}
              </FooterCol>
              <FooterCol title="Buying guides">
                {GUIDES.slice(0, 4).map((g) => (
                  <Link key={g.slug} href={`/marketplace/guides/${g.slug}`} className="hover:text-cyan-deep">
                    {g.title}
                  </Link>
                ))}
              </FooterCol>
              <FooterCol title="About">
                <Link href="/marketplace/about" className="hover:text-cyan-deep">About &amp; methodology</Link>
                <Link href="/marketplace/disclosure" className="hover:text-cyan-deep">Affiliate disclosure</Link>
                <Link href="/contact" className="hover:text-cyan-deep">Contact</Link>
              </FooterCol>
            </div>
            <div className="mt-8">
              <AffiliateDisclosure />
            </div>
            <p className="mt-6 text-xs text-ink-muted">
              Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. The
              Ndimih Boclair Marketplace is an independent platform and is not affiliated with or
              endorsed by Amazon.
            </p>
          </Container>
        </div>
      </div>
    </CountryProvider>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-ink">{title}</p>
      <nav className="flex flex-col gap-2 text-sm text-ink-muted">{children}</nav>
    </div>
  );
}
