import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { CountrySelect } from "./CountrySelect";

/**
 * Marketplace sub-header: brand, search, category strip and country selector.
 * Sits beneath the global site navbar and is shared by every marketplace page.
 */
export function MarketHeader({ activeCategory, query }: { activeCategory?: string; query?: string }) {
  return (
    <div className="border-b border-ink-line bg-surface">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
        <Link href="/marketplace" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-sm font-extrabold tracking-wide text-white">
            NB
          </span>
          <span className="text-[15px] text-ink">
            <strong className="font-bold">Ndimih Boclair</strong> Marketplace
          </span>
        </Link>

        <form action="/marketplace/search" method="get" role="search" className="order-3 flex min-w-[220px] flex-1 sm:order-none">
          <input
            type="search"
            name="q"
            defaultValue={query || ""}
            placeholder="Search products, categories, brands…"
            aria-label="Search the marketplace"
            autoComplete="off"
            className="w-full rounded-l-lg border border-r-0 border-ink-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/30"
          />
          <button
            type="submit"
            aria-label="Search"
            className="inline-flex items-center gap-1.5 rounded-r-lg bg-[#ff9900] px-4 text-sm font-bold text-[#231a00] hover:brightness-105"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        <div className="order-2 sm:order-none">
          <CountrySelect />
        </div>
      </Container>

      <Container className="flex gap-1 overflow-x-auto pb-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/marketplace/category/${c.slug}`}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors",
              activeCategory === c.slug
                ? "bg-cyan/10 font-semibold text-cyan-deep"
                : "text-ink-muted hover:bg-sand hover:text-cyan-deep",
            )}
          >
            {c.name}
          </Link>
        ))}
      </Container>
    </div>
  );
}
