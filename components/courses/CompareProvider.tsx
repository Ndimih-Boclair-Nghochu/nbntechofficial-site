"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CompareCourse } from "./compare-types";
import { COMPARE_MAX, COMPARE_STORAGE_KEY } from "./compare-types";

/**
 * Client-side course comparison. Selection lives in React state (persisted to
 * localStorage so it survives navigation across the courses vertical). Kept
 * deliberately simple — a scalable base that can later back a dedicated
 * comparison page or richer feature matrix.
 */
type CompareContextValue = {
  items: CompareCourse[];
  has: (slug: string) => boolean;
  toggle: (course: CompareCourse) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isFull: boolean;
  max: number;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareCourse[]>([]);

  // Load persisted selection once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.slice(0, COMPARE_MAX));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist on change.
  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const has = useCallback((slug: string) => items.some((c) => c.slug === slug), [items]);

  const toggle = useCallback((course: CompareCourse) => {
    setItems((prev) => {
      if (prev.some((c) => c.slug === course.slug)) {
        return prev.filter((c) => c.slug !== course.slug);
      }
      if (prev.length >= COMPARE_MAX) return prev; // ignore beyond the cap
      return [...prev, course];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((c) => c.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CompareContextValue>(
    () => ({ items, has, toggle, remove, clear, isFull: items.length >= COMPARE_MAX, max: COMPARE_MAX }),
    [items, has, toggle, remove, clear],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    // Safe no-op fallback so cards render even outside a provider (e.g. tests).
    return {
      items: [],
      has: () => false,
      toggle: () => {},
      remove: () => {},
      clear: () => {},
      isFull: false,
      max: COMPARE_MAX,
    };
  }
  return ctx;
}
