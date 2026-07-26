import Image from "next/image";
import { Quote } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { Stars } from "@/components/site/StarRating";

function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col rounded-xl2 border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:w-[380px]">
      <div className="flex items-center justify-between">
        <Quote className="h-7 w-7 text-cyan/50" aria-hidden />
        <Stars value={t.rating} />
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-white/90">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
        {t.avatarUrl ? (
          <Image
            src={t.avatarUrl}
            alt={t.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan/15 font-serif font-semibold text-cyan">
            {t.name.charAt(0)}
          </span>
        )}
        <div>
          <p className="text-sm font-semibold text-white">{t.name}</p>
          {t.role && <p className="text-xs text-white/55">{t.role}</p>}
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Continuously scrolling reviews (left → right), seamless via a duplicated
 * track. Pauses on hover. Edges fade out. Falls back to a static row when there
 * are only a couple of reviews.
 */
export function ReviewsMarquee({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;

  // Duplicate for a seamless loop; ensure enough cards to fill wide screens.
  const base = items.length < 4 ? [...items, ...items, ...items] : items;
  const track = [...base, ...base];
  const duration = Math.max(28, base.length * 7);

  return (
    <div className="nbn-marquee relative overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-navy-950 to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-navy-950 to-transparent sm:w-28" />
      <div className="nbn-marquee-track gap-5 py-1" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {track.map((t, i) => (
          <ReviewCard key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
