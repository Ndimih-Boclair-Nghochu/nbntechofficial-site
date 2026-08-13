"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

type Option = { value: string; label: string };

/**
 * Course filter + sort controls. Reads/writes URL search params so results stay
 * server-rendered, shareable and SEO-friendly. The parent page reads the same
 * params and queries the database. Scalable: add a new <Select> and the page
 * only needs to read one more param.
 */
export function CourseFilters({
  categories,
  providers,
  levels,
  languages,
  sorts,
  current,
  hideCategory = false,
  resultCount,
}: {
  categories: Option[];
  providers: Option[];
  levels: Option[];
  languages: Option[];
  sorts: Option[];
  current: Record<string, string>;
  hideCategory?: boolean;
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      // Always reset any pagination when a filter changes (future-proofing).
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const hasFilters = ["category", "provider", "level", "language", "rating", "maxPrice", "free"].some(
    (k) => current[k],
  );

  return (
    <div className="rounded-lg border border-ink-line bg-surface p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4 text-cyan-deep" /> Filters
        </span>
        <span className="text-xs text-ink-muted">{resultCount} result{resultCount === 1 ? "" : "s"}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {!hideCategory && (
          <Select
            label="Category"
            value={current.category || ""}
            onChange={(v) => setParam("category", v)}
            options={[{ value: "", label: "All categories" }, ...categories]}
          />
        )}
        <Select
          label="Provider"
          value={current.provider || ""}
          onChange={(v) => setParam("provider", v)}
          options={[{ value: "", label: "All providers" }, ...providers]}
        />
        <Select
          label="Level"
          value={current.level || ""}
          onChange={(v) => setParam("level", v)}
          options={[{ value: "", label: "Any level" }, ...levels]}
        />
        <Select
          label="Language"
          value={current.language || ""}
          onChange={(v) => setParam("language", v)}
          options={[{ value: "", label: "Any language" }, ...languages]}
        />
        <Select
          label="Rating"
          value={current.rating || ""}
          onChange={(v) => setParam("rating", v)}
          options={[
            { value: "", label: "Any rating" },
            { value: "4.5", label: "4.5 & up" },
            { value: "4", label: "4.0 & up" },
            { value: "3.5", label: "3.5 & up" },
          ]}
        />
        <Select
          label="Sort"
          value={current.sort || ""}
          onChange={(v) => setParam("sort", v)}
          options={sorts}
        />
      </div>

      {hasFilters && (
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            ["category", "provider", "level", "language", "rating", "maxPrice", "free"].forEach((k) =>
              params.delete(k),
            );
            const qs = params.toString();
            router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
          }}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-deep hover:underline"
        >
          <X className="h-3.5 w-3.5" /> Clear filters
        </button>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-ink-line bg-white px-2 py-1.5 text-sm text-ink focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
