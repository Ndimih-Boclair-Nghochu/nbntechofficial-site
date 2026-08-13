"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, ChevronDown, ArrowUpRight } from "lucide-react";
import type { AvailableCategory } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";

/**
 * Marketplace hamburger → a category drawer (all product categories + their
 * sub-categories), not site links, so the marketplace feels like its own site.
 * The bottom links to NBN TECH (the maker) — the author of NBN MARKET.
 */
export function MarketNav({ categories }: { categories: AvailableCategory[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open categories menu"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[60] bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Product categories"
      >
        <div className="flex items-center justify-between border-b border-ink-line px-4 py-3">
          <span className="text-sm font-bold text-ink">Shop by category</span>
          <button onClick={() => setOpen(false)} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-ink-line/40">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {categories.length === 0 && <p className="p-4 text-sm text-ink-muted">No categories yet — add products to see them here.</p>}
          {categories.map((c) => (
            <div key={c.slug} className="border-b border-ink-line/60">
              <div className="flex items-center">
                <Link
                  href={`/nbnmarket/category/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center gap-2 px-3 py-3 text-sm font-semibold text-ink hover:text-cyan-deep"
                >
                  <span aria-hidden>{c.icon}</span>
                  {c.name}
                  <span className="ml-1 text-xs font-normal text-ink-muted">({c.count})</span>
                </Link>
                {c.subcategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => (e === c.slug ? null : c.slug))}
                    aria-label={`Toggle ${c.name} sub-categories`}
                    className="px-3 py-3 text-ink-muted"
                  >
                    {expanded === c.slug ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                )}
              </div>
              {expanded === c.slug && c.subcategories.length > 0 && (
                <div className="pb-2 pl-9">
                  {c.subcategories.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/nbnmarket/category/${c.slug}?sub=${s.slug}`}
                      onClick={() => setOpen(false)}
                      className="block py-1.5 text-sm text-ink-body hover:text-cyan-deep"
                    >
                      {s.name} <span className="text-xs text-ink-muted">({s.count})</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-ink-line p-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            <span>About the maker · NBN TECH</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <p className="mt-2 text-center text-[11px] text-ink-muted">
            NBN MARKET is an independent product-discovery platform by NBN TECH.
          </p>
        </div>
      </aside>
    </>
  );
}
