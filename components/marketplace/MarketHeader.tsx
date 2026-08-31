import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { CountrySelect } from "./CountrySelect";
import { MarketLogo } from "./MarketLogo";
import { MarketNav } from "./MarketNav";
import { TelegramJoinButton } from "./TelegramJoin";
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
    <form action="/nbnmarket/search" method="get" role="search" className="flex w-full">
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
      {/* Brand bar — top row (where the site logo used to be) */}
      <Container className="flex items-center justify-between py-2.5">
        <Link href="/nbnmarket" aria-label="NBN MARKET home" className="flex items-center gap-2.5">
          <MarketLogo size={38} className="shrink-0" />
          <span className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
              <span className="text-white">NBN</span> <span className="text-cyan">MARKET</span>
            </span>
            <span className="mt-0.5 text-[10px] font-medium tracking-wide text-white/55">
              Discover products worth buying
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
        <TelegramJoinButton start="market_header" label="Get Deals" />
        <a
          href="https://wa.me/237652859412?text=Hi%20NBN%20MARKET"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with NBN MARKET on WhatsApp"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="hidden sm:inline">Chat</span>
        </a>
        </div>
      </Container>

      {/* Tools row — hamburger (categories) · search · country */}
      <div className="border-t border-white/10">
        <Container className="py-2.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <MarketNav categories={categories} />
            <div className="hidden min-w-0 flex-1 md:block">{searchForm}</div>
            <div className="ml-auto shrink-0 md:ml-0">
              <CountrySelect variant="dark" />
            </div>
          </div>
          <div className="mt-2.5 md:hidden">{searchForm}</div>
        </Container>
      </div>

      <div className="border-t border-white/10 bg-navy-900">
        <Container>
          <nav aria-label="Product categories" className="hide-scrollbar flex gap-1 overflow-x-auto py-1">
            {/* Online Courses — first-class link within the marketplace nav */}
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-sm font-bold text-cyan transition-colors hover:text-white"
            >
              🎓 Online Courses
            </Link>
            {categories.slice(0, 10).map((c) => {
                const active = activeCategory === c.slug;
                return (
                  <Link
                    key={c.slug}
                    href={`/nbnmarket/category/${c.slug}`}
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
    </div>
  );
}
