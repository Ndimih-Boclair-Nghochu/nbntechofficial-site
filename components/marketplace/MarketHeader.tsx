import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { CountrySelect } from "./CountrySelect";

/**
 * NBN MARKET header — a premium two-tone storefront bar.
 * On mobile the wordmark and the "Deliver to" country selector always sit on the
 * SAME line (never stacked); the search bar drops to its own line below. On
 * desktop everything sits inline.
 */
export function MarketHeader({ activeCategory, query }: { activeCategory?: string; query?: string }) {
  const searchForm = (
    <form action="/marketplace/search" method="get" role="search" className="flex w-full">
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
  );

  return (
    <div className="bg-navy-950 text-white shadow-[0_2px_20px_rgba(3,10,59,0.25)]">
      <Container className="py-3">
        {/* Brand + country: always one line */}
        <div className="flex flex-nowrap items-center gap-3">
          <Link
            href="/marketplace"
            aria-label="NBN MARKET home"
            className="shrink-0 text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            <span className="text-white">NBN</span> <span className="text-cyan">MARKET</span>
          </Link>

          {/* Desktop search sits between brand and country */}
          <div className="hidden min-w-0 flex-1 md:block">{searchForm}</div>

          <div className="ml-auto shrink-0 md:ml-0">
            <CountrySelect variant="dark" />
          </div>
        </div>

        {/* Mobile search on its own line below */}
        <div className="mt-3 md:hidden">{searchForm}</div>
      </Container>

      {/* Category bar */}
      <div className="border-t border-white/10 bg-navy-900">
        <Container>
          <nav aria-label="Product categories" className="hide-scrollbar flex gap-1 overflow-x-auto py-1">
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
