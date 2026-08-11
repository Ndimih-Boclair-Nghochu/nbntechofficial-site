import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CountryProvider } from "@/components/marketplace/CountryProvider";
import { getRequestCountry } from "@/lib/marketplace-server";

/**
 * Marketplace shell: shares the country context + a slim footer across every
 * marketplace page. Sits inside the global (site) layout, so it inherits the
 * main site navbar and footer — the marketplace feels like a natural extension
 * of the Ndimih Boclair site, not a separate app. Kept intentionally lean so
 * the storefront stays clean and product-first.
 */
export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const initial = getRequestCountry();

  return (
    <CountryProvider initial={initial}>
      {/* pt clears the fixed global navbar; bg keeps the storefront light */}
      <div className="min-h-screen bg-sand-soft pt-16 md:pt-[72px]">
        {children}

        {/* Slim marketplace footer */}
        <div className="mt-8 border-t border-ink-line bg-surface">
          <Container className="flex flex-col items-center gap-3 py-6 text-center text-xs text-ink-muted sm:flex-row sm:justify-between sm:text-left">
            <p className="max-w-xl">
              As an Amazon Associate we may earn from qualifying purchases at no extra cost to you.{" "}
              <Link href="/marketplace/disclosure" className="text-cyan-deep hover:underline">
                Affiliate disclosure
              </Link>
              . Independent platform — not affiliated with Amazon.
            </p>
            <nav className="flex gap-4">
              <Link href="/marketplace/about" className="hover:text-cyan-deep">About</Link>
              <Link href="/marketplace/guides" className="hover:text-cyan-deep">Guides</Link>
              <Link href="/contact" className="hover:text-cyan-deep">Contact</Link>
            </nav>
          </Container>
        </div>
      </div>
    </CountryProvider>
  );
}
