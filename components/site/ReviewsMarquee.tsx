import Image from "next/image";
import { Quote } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { Stars } from "@/components/site/StarRating";

/** Background colour of the reviews band — used for the marquee edge fades too. */
export const REVIEWS_BAND = "#BCD2EF";

function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[320px] shrink-0 flex-col rounded-xl2 border border-white/70 bg-white p-6 shadow-card sm:w-[380px]">
      <div className="flex items-center justify-between">
        <Quote className="h-7 w-7 text-cyan/50" aria-hidden />
        <Stars value={t.rating} />
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-body">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-line pt-4">
        {t.avatarUrl ? (
          <Image
            src={t.avatarUrl}
            alt={t.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan/15 font-semibold text-cyan-deep">
            {t.name.charAt(0)}
          </span>
        )}
        <div>
          <p className="text-sm font-semibold text-ink">{t.name}</p>
          {t.role && <p className="text-xs text-ink-muted">{t.role}</p>}
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Continuously scrolling reviews, seamless via a duplicated track. Edges fade
 * into the light-blue band.
 */
export function ReviewsMarquee({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;

  const base = items.length < 4 ? [...items, ...items, ...items] : items;
  const track = [...base, ...base];
  const duration = Math.max(28, base.length * 7);

  return (
    <div className="nbn-marquee relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28"
        style={{ background: `linear-gradient(to right, ${REVIEWS_BAND}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28"
        style={{ background: `linear-gradient(to left, ${REVIEWS_BAND}, transparent)` }}
      />
      <div className="nbn-marquee-track gap-5 py-1" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {track.map((t, i) => (
          <ReviewCard key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
