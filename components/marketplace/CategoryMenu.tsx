"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, LayoutGrid } from "lucide-react";
import type { AvailableCategory } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";

/**
 * Prominent "All categories" dropdown shown just before the product sections.
 * Lists only categories (and sub-categories) that currently have products, so it
 * is always accurate.
 */
export function CategoryMenu({ categories }: { categories: AvailableCategory[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!categories.length) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white shadow-card transition-colors hover:bg-navy-700"
      >
        <LayoutGrid className="h-4 w-4 text-cyan-soft" />
        All categories
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 z-40 mt-2 w-[min(94vw,760px)] rounded-2xl border border-ink-line bg-surface p-4 shadow-card-hover">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div key={c.slug} className="rounded-xl border border-ink-line p-3">
                <Link
                  href={`/marketplace/category/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-ink hover:text-cyan-deep"
                >
                  <span aria-hidden>{c.icon}</span>
                  {c.name}
                  <span className="ml-auto text-xs font-normal text-ink-muted">{c.count}</span>
                </Link>
                {c.subcategories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.subcategories.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/marketplace/category/${c.slug}?sub=${s.slug}`}
                        onClick={() => setOpen(false)}
                        className="rounded-full bg-sand-soft px-2.5 py-1 text-xs text-ink-body transition-colors hover:text-cyan-deep"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
