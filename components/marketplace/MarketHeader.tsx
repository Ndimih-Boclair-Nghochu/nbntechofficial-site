import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { CountrySelect } from "./CountrySelect";

/**
 * NBN MARKET header — a premium two-tone storefront bar.
 *  • wordmark (no logo)  • prominent search  • obvious "Deliver to" country pill
 *  • a bold, clear category bar beneath.
 * Shared by every marketplace page; fully responsive.
 */
export function MarketHeader({ activeCategory, query }: { activeCategory?: string; query?: string }) {
  return (
    <div className="bg-navy-950 text-white shadow-[0_2px_20px_rgba(3,10,59,0.25)]">
      {/* Top row */}
      <Container className="flex flex-wrap items-center gap-x-5 gap-y-3 py-3">
        <Link
          href="/marketplace"
          aria-label="NBN MARKET home"
          className="shrink-0 text-2xl font-extrabold tracking-tight"
        >
          <span className="text-white">NBN</span>{" "}
          <span className="text-cyan">MARKET</span>
        </Link>

        <form
          action="/marketplace/search"
          method="get"
          role="search"
          className="order-3 flex w-full min-w-[220px] flex-1 md:order-none md:w-auto"
        >
          <input
            type="search"
            name="q"
            defaultValue={query || ""}
            placeholder="Search products, categories, brands…"
            aria-label="Search NBN MARKET"
            autoComplete="off"
            className="w-full rounded-l-lg border-0 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-cyan"
          />
          <button
            type="submit"
            aria-label="Search"
            className="inline-flex items-center gap-1.5 rounded-r-lg bg-[#ff9900] px-4 font-bold text-[#231a00] transition hover:brightness-105"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        <div className="ml-auto md:ml-0">
          <CountrySelect variant="dark" />
        </div>
      </Container>

      {/* Category bar */}
      <div className="border-t border-white/10 bg-navy-900">
        <Container>
          <nav aria-label="Product categories" className="flex gap-1 overflow-x-auto py-1">
            {CATEGORIES.map((c) => {
              const active = activeCategory === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={`/marketplace/category/${c.slug}`}
                  className={cn(
                    "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-bold transition-colors",
                    active
                      ? "border-cyan text-cyan"
                      : "border-transparent text-white/85 hover:border-white/40 hover:text-white",
                  )}
                >
                  {c.name}
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>
    </div>
  );
}
