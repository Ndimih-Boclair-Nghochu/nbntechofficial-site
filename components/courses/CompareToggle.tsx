"use client";

import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CompareCourse } from "./compare-types";
import { useCompare } from "./CompareProvider";

/** A small "compare" toggle button placed on each course card. */
export function CompareToggle({ course }: { course: CompareCourse }) {
  const { has, toggle, isFull } = useCompare();
  const active = has(course.slug);
  const disabled = !active && isFull;

  return (
    <button
      type="button"
      onClick={() => toggle(course)}
      disabled={disabled}
      aria-pressed={active}
      title={
        active ? "Remove from comparison" : disabled ? "Comparison is full (max 4)" : "Add to comparison"
      }
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-2 text-xs font-semibold transition",
        active
          ? "border-cyan bg-cyan/10 text-cyan-deep"
          : "border-ink-line text-ink-muted hover:border-cyan hover:text-cyan-deep",
        disabled && "cursor-not-allowed opacity-50 hover:border-ink-line hover:text-ink-muted",
      )}
    >
      <Scale className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{active ? "Added" : "Compare"}</span>
    </button>
  );
}
