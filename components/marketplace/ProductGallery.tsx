"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Product image gallery — a large main image plus clickable thumbnails.
 * Clicking (or focusing) a thumbnail promotes it to the main view.
 */
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const pics = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const main = pics[active] || "/logo-mark.png";

  return (
    <div>
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-ink-line bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main}
          alt={alt}
          width={640}
          height={640}
          className="h-full w-full object-cover"
        />
      </div>

      {pics.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {pics.slice(0, 8).map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "h-16 w-16 overflow-hidden rounded-md border-2 bg-white transition-colors",
                i === active ? "border-cyan" : "border-ink-line hover:border-cyan/50",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" width={64} height={64} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
