"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Product-card image area: a main image (links to the product) plus small
 * sub-image thumbnails. Hovering/clicking a thumbnail previews it in the card;
 * the main image still navigates to the product page.
 */
export function CardGallery({ images, alt, href }: { images: string[]; alt: string; href: string }) {
  const pics = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const main = pics[active] || "/logo-mark.png";

  return (
    <div>
      <Link href={href} aria-label={alt} className="block aspect-square overflow-hidden rounded-md bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main}
          alt={alt}
          loading="lazy"
          width={320}
          height={320}
          className="h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {pics.length > 1 && (
        <div className="mt-2 flex gap-1.5">
          {pics.slice(0, 4).map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-label={`Preview image ${i + 1}`}
              aria-pressed={i === active}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cn(
                "h-9 w-9 overflow-hidden rounded border bg-white transition-colors",
                i === active ? "border-cyan" : "border-ink-line hover:border-cyan/50",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" width={36} height={36} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
