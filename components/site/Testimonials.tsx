import Image from "next/image";
import { Quote } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { RevealGroup, RevealItem } from "@/components/site/Reveal";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;

  return (
    <RevealGroup className="grid gap-5 md:grid-cols-2">
      {items.map((t) => (
        <RevealItem
          key={t.id}
          as="article"
          className="relative flex flex-col rounded-xl2 border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
        >
          <Quote className="h-8 w-8 text-cyan/50" aria-hidden />
          <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-white/90">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            {t.avatarUrl ? (
              <Image
                src={t.avatarUrl}
                alt={t.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cyan/15 font-serif text-lg font-semibold text-cyan">
                {t.name.charAt(0)}
              </span>
            )}
            <div>
              <p className="text-sm font-semibold text-white">{t.name}</p>
              {t.role && <p className="text-sm text-white/55">{t.role}</p>}
            </div>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
