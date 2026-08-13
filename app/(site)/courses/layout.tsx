import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CountryProvider } from "@/components/marketplace/CountryProvider";
import { CompareProvider } from "@/components/courses/CompareProvider";
import { CompareTray } from "@/components/courses/CompareTray";
import { getRequestCountry } from "@/lib/marketplace-server";

/**
 * Online Courses shell: shares the country context + course comparison across
 * every /courses page, plus a slim footer. Sits inside the global (site) layout,
 * so courses feel like a natural extension of NBN Market — not a separate app.
 */
export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  const initial = getRequestCountry();

  return (
    <CountryProvider initial={initial}>
      <CompareProvider>
        <div className="min-h-screen bg-sand-soft pb-20">
          {children}

          {/* Slim courses footer */}
          <div className="mt-8 border-t border-ink-line bg-surface">
            <Container className="flex flex-col items-center gap-3 py-6 text-center text-xs text-ink-muted sm:flex-row sm:justify-between sm:text-left">
              <p className="max-w-xl">
                NBN Market may earn a commission when you enrol through qualifying affiliate links, at no
                extra cost to you.{" "}
                <Link href="/nbnmarket/disclosure" className="text-cyan-deep hover:underline">
                  Affiliate disclosure
                </Link>
                . Independent platform.
              </p>
              <nav className="flex flex-wrap items-center gap-4">
                <Link href="/courses" className="hover:text-cyan-deep">All courses</Link>
                <Link href="/nbnmarket" className="hover:text-cyan-deep">Marketplace</Link>
                <Link href="/contact" className="hover:text-cyan-deep">Contact</Link>
                <Link href="/" className="font-semibold text-ink hover:text-cyan-deep">By NBN TECH ↗</Link>
              </nav>
            </Container>
          </div>
        </div>

        {/* Floating comparison tray (renders only when courses are selected) */}
        <CompareTray />
      </CompareProvider>
    </CountryProvider>
  );
}
