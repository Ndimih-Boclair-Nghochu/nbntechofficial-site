import Link from "next/link";
import { telegramBotUrl } from "@/lib/telegram-links";
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
      {/* The NBN TECH site navbar is hidden here, so the NBN MARKET header sits
          flush at the top (no clearance needed). */}
      <div className="min-h-screen bg-sand-soft">
        {children}

        {/* Slim marketplace footer */}
        <div className="mt-8 border-t border-ink-line bg-surface">
          <Container className="flex flex-col items-center gap-3 py-6 text-center text-xs text-ink-muted sm:flex-row sm:justify-between sm:text-left">
            <p className="max-w-xl">
              We may earn a commission from qualifying purchases on Amazon and other platforms, at no
              extra cost to you.{" "}
              <Link href="/nbnmarket/disclosure" className="text-cyan-deep hover:underline">
                Affiliate disclosure
              </Link>
              . Independent platform.
            </p>
            <nav className="flex flex-wrap items-center gap-4">
              <a
                href={telegramBotUrl("market_footer")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cyan-deep hover:underline"
              >
                📣 Join on Telegram
              </a>
              <Link href="/nbnmarket/amazon" className="hover:text-cyan-deep">Search Amazon</Link>
              <Link href="/nbnmarket/about" className="hover:text-cyan-deep">About</Link>
              <Link href="/nbnmarket/guides" className="hover:text-cyan-deep">Guides</Link>
              <Link href="/contact" className="hover:text-cyan-deep">Contact</Link>
              <Link href="/" className="font-semibold text-ink hover:text-cyan-deep">By NBN TECH ↗</Link>
            </nav>
          </Container>
        </div>
      </div>
    </CountryProvider>
  );
}
