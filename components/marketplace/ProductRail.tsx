"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal, swipeable product rail (Amazon-style). Users scroll SIDEWAYS
 * through a product section instead of down. Receives server-rendered cards as
 * children (each already wrapped to a fixed width), so cards stay server
 * components (SEO + server-side currency conversion). Arrows show on desktop;
 * touch/trackpad swipe on mobile.
 */
export function ProductRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.9, 720), behavior: "smooth" });
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-line bg-white text-ink shadow-card transition-opacity hover:text-cyan-deep md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div ref={ref} className="hide-scrollbar flex snap-x gap-3 overflow-x-auto pb-1 md:gap-4">
        {children}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-line bg-white text-ink shadow-card transition-opacity hover:text-cyan-deep md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/** Fixed-width wrapper for a card inside a rail (keeps cards a consistent size). */
export function RailItem({ children }: { children: React.ReactNode }) {
  return <div className="w-40 shrink-0 snap-start sm:w-48 lg:w-56">{children}</div>;
}
