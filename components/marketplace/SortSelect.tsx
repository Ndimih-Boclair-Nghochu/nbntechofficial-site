"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Category sort control. Updates the `sort` query param (canonical stays clean). */
export function SortSelect({ value }: { value?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-sm text-ink-muted">
      Sort:
      <select
        aria-label="Sort products"
        defaultValue={value || ""}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value) params.set("sort", e.target.value);
          else params.delete("sort");
          const qs = params.toString();
          router.push(qs ? `${pathname}?${qs}` : pathname);
        }}
        className="rounded-lg border border-ink-line bg-white px-2.5 py-1.5 text-sm text-ink focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/30"
      >
        <option value="">Recommended</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="rating">Top rated</option>
      </select>
    </label>
  );
}
