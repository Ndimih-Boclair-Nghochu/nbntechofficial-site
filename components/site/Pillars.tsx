import { Check } from "lucide-react";
import { Icon } from "@/components/site/Icon";
import { RevealGroup, RevealItem } from "@/components/site/Reveal";
import { pillars } from "@/lib/content-defaults";

/**
 * Expertise as a horizontal, swipeable rail of numbered service cards. Users
 * scroll through them (touch / trackpad / drag) — a cleaner, more modern read
 * than a dense grid, and it scales gracefully as more disciplines are added.
 */
export function Pillars() {
  return (
    <div className="edge-fade-x">
      <RevealGroup className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-5">
        {pillars.map((p, i) => (
          <RevealItem
            key={p.key}
            as="article"
            className="group relative flex w-[80%] shrink-0 snap-start flex-col overflow-hidden rounded-xl2 border border-ink-line bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan/40 hover:shadow-card-hover sm:w-[20.5rem]"
          >
            <span
              aria-hidden
              className="absolute right-4 top-2 font-serif text-6xl font-extrabold leading-none text-navy/[0.06] transition-colors duration-300 group-hover:text-cyan/20"
            >
              0{i + 1}
            </span>
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-cyan shadow-sm transition-transform duration-300 group-hover:scale-110">
              <Icon name={p.icon} className="h-6 w-6" />
            </span>
            <h3 className="relative mt-5 text-lg font-bold text-ink">{p.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-ink-body">{p.blurb}</p>
            <ul className="relative mt-4 space-y-2 border-t border-ink-line pt-4">
              {p.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2 text-sm text-ink-body">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-deep" />
                  {pt}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
