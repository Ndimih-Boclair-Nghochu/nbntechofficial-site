import Link from "next/link";
import { Search, Store } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { CountrySelect } from "@/components/marketplace/CountrySelect";
import { MarketLogo } from "@/components/marketplace/MarketLogo";
import { getAvailableCourseCategories } from "@/lib/courses-data";
import { coursePath } from "@/lib/courses";

/**
 * NBN MARKET — Online Courses header. Mirrors the storefront header's design
 * language (same navy bar, logo and search styling) so courses feel like a
 * native part of NBN Market, while linking back to the main marketplace. The
 * category bar shows only course categories that actually have courses.
 * Async server component.
 */
export async function CourseHeader({ activeCategory, query }: { activeCategory?: string; query?: string }) {
  const categories = await getAvailableCourseCategories();

  const searchForm = (
    <form action="/courses" method="get" role="search" className="flex w-full">
      <input
        type="search"
        name="q"
        defaultValue={query || ""}
        placeholder="Search courses, topics, instructors…"
        aria-label="Search courses"
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
      {/* Brand bar */}
      <Container className="flex items-center justify-between py-2.5">
        <Link href="/courses" aria-label="NBN MARKET Courses home" className="flex items-center gap-2.5">
          <MarketLogo size={38} className="shrink-0" />
          <span className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
              <span className="text-white">NBN</span> <span className="text-cyan">MARKET</span>
            </span>
            <span className="mt-0.5 text-[10px] font-medium tracking-wide text-white/55">
              Online courses worth taking
            </span>
          </span>
        </Link>

        <Link
          href="/nbnmarket"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <Store className="h-4 w-4" />
          <span className="hidden sm:inline">Marketplace</span>
        </Link>
      </Container>

      {/* Tools row */}
      <div className="border-t border-white/10">
        <Container className="py-2.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/courses"
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                !activeCategory ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/5 hover:text-white",
              )}
            >
              All courses
            </Link>
            <div className="hidden min-w-0 flex-1 md:block">{searchForm}</div>
            <div className="ml-auto shrink-0 md:ml-0">
              <CountrySelect variant="dark" />
            </div>
          </div>
          <div className="mt-2.5 md:hidden">{searchForm}</div>
        </Container>
      </div>

      {categories.length > 0 && (
        <div className="border-t border-white/10 bg-navy-900">
          <Container>
            <nav aria-label="Course categories" className="hide-scrollbar flex gap-1 overflow-x-auto py-1">
              {categories.slice(0, 12).map((c) => {
                const active = activeCategory === c.slug;
                return (
                  <Link
                    key={c.slug}
                    href={coursePath(c.slug)}
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
      )}
    </div>
  );
}
