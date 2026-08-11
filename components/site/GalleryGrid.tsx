"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { GalleryImage } from "@prisma/client";
import { RevealItem, RevealGroup } from "@/components/site/Reveal";

/**
 * `masonry` — the classic column masonry (used on the full /gallery page).
 * `strip`   — an advanced, horizontally-scrolling photographic rail (home): big
 *             uniform-height frames you swipe through, like a photographer's
 *             portfolio, with a hover zoom + caption and a full-screen lightbox.
 */
export function GalleryGrid({
  images,
  variant = "masonry",
}: {
  images: GalleryImage[];
  variant?: "masonry" | "strip";
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, go]);

  if (!images.length) return null;

  return (
    <>
      {variant === "strip" ? (
        <div className="edge-fade-x">
          <RevealGroup className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-5">
            {images.map((img, i) => (
              <RevealItem key={img.id} className="shrink-0 snap-start">
                <button
                  onClick={() => setOpen(i)}
                  aria-label={img.alt}
                  className="group relative block h-64 w-[17rem] overflow-hidden rounded-xl2 border border-ink-line bg-navy-950 shadow-card sm:h-[22rem] sm:w-[26rem]"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 70vw, 26rem"
                    className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <Expand className="h-4 w-4" />
                  </span>
                  {img.caption && (
                    <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {img.caption}
                    </span>
                  )}
                </button>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      ) : (
        <RevealGroup className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {images.map((img, i) => (
            <RevealItem key={img.id} className="break-inside-avoid">
              <button
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-xl2 border border-ink-line bg-white shadow-card"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={600}
                  height={600}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {img.caption && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-navy-950/85 to-transparent p-3 text-left text-xs font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
                    {img.caption}
                  </span>
                )}
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <button onClick={close} aria-label="Close" className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="h-6 w-6" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); go(-1); }}
                  aria-label="Previous"
                  className="absolute left-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); go(1); }}
                  aria-label="Next"
                  className="absolute right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <motion.figure
              key={images[open].id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[85vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[open].url}
                alt={images[open].alt}
                width={1400}
                height={1400}
                className="max-h-[80vh] w-auto rounded-lg object-contain"
              />
              {(images[open].caption || images[open].alt) && (
                <figcaption className="mt-3 text-center text-sm text-white/75">
                  {images[open].caption || images[open].alt}
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
