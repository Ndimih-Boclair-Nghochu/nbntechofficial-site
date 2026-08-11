"use client";

import { useEffect } from "react";
import { track } from "./track";

/** Fires a single analytics view event on mount (product_view, category_view…). */
export function PageView({ event, params }: { event: string; params?: Record<string, unknown> }) {
  useEffect(() => {
    track(event, params || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
