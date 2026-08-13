import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { CountrySelect } from "./CountrySelect";
import { MarketLogo } from "./MarketLogo";
import { MarketNav } from "./MarketNav";
import { getAvailableCategories } from "@/lib/marketplace-data";

/**
 * NBN MARKET header — its own storefront bar (no NBN TECH logo). Hamburger opens
 * the product-category drawer; brand icon + wordmark; prominent search; obvious
 * "Deliver to" country selector. The category bar and drawer show only
 * categories that actually have products right now. Async server component.
 */
export async function MarketHeader({ activeCategory, query }: { activeCategory?: string; query?: string }) {
  const categories = await getAvailableCategories();

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
      <button type="submit" aria-label="Search" className="inline-flex items-center gap-1.5 rounded-r-lg bg-[#ff9900] px-4 font-bold text-[#231a00] transition hover:brightness-105">
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );

  return (
    <div className="bg-navy-950 text-white shadow-[0_2px_20px_rgba(3,10,59,0.25)]">
      <Container className="py-3">
        <div className="flex flex-nowrap items-center gap-2 sm:gap-3">
          <MarketNav categories={categories} />

          <Link href="/marketplace" aria-label="NBN MARKET home" className="flex shrink-0 items-center gap-2">
            <MarketLogo size={34} className="shrink-0" />
            <span className="flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-tight sm:text-2xl">
                <span className="text-white">NBN</span> <span className="text-cyan">MARKET</span>
              </span>
              <span className="hidden text-[10px] font-medium tracking-wide text-white/55 sm:block">
                Discover products worth buying
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 md:block">{searchForm}</div>

          <div className="ml-auto shrink-0 md:ml-0">
            <CountrySelect variant="dark" />
          </div>
        </div>

        <div className="mt-3 md:hidden">{searchForm}</div>
      </Container>

      {categories.length > 0 && (
        <div className="border-t border-white/10 bg-navy-900">
          <Container>
            <nav aria-label="Product categories" className="hide-scrollbar flex gap-1 overflow-x-auto py-1">
              {categories.slice(0, 10).map((c) => {
                const active = activeCategory === c.slug;
                return (
                  <Link
                    key={c.slug}
                    href={`/marketplace/category/${c.slug}`}
                    className={cn(
                      "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-bold transition-colors",
                      active ? "border-cyan text-cyan" : "border-transparent text-white/85 hover:border-white/40 hover:text-white",
                    )}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      )}
    </div>
  );
}
