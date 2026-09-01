"use client";

import { Children } from "react";

/**
 * Continuously-rotating showcase rail. Receives server-rendered product cards as
 * children, duplicates them, and scrolls them horizontally forever (pauses on
 * hover; respects reduced-motion via the shared .nbn-marquee CSS). Used for the
 * home "Featured" band that mixes products from every category.
 */
export function ShowcaseRail({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children);
  if (items.length === 0) return null;
  // Slower for more cards so the motion stays gentle and readable.
  const duration = `${Math.min(160, Math.max(40, items.length * 3))}s`;

  return (
    <div className="nbn-marquee relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-surface to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-surface to-transparent sm:w-16" />
      <div className="nbn-marquee-track gap-3 py-1 md:gap-4" style={{ ["--marquee-duration" as string]: duration }}>
        {items.map((c, i) => (
          <div key={i} className="w-40 shrink-0 sm:w-48 lg:w-56">{c}</div>
        ))}
        {/* seamless duplicate */}
        {items.map((c, i) => (
          <div key={`dup-${i}`} aria-hidden className="w-40 shrink-0 sm:w-48 lg:w-56">{c}</div>
        ))}
      </div>
    </div>
  );
}
