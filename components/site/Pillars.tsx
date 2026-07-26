import { Check } from "lucide-react";
import { Icon } from "@/components/site/Icon";
import { RevealGroup, RevealItem } from "@/components/site/Reveal";
import { pillars } from "@/lib/content-defaults";

export function Pillars() {
  return (
    <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p) => (
        <RevealItem
          key={p.key}
          as="article"
          className="group relative flex flex-col overflow-hidden rounded-xl2 border border-ink-line bg-gradient-to-b from-white to-navy-50/50 p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan/40 hover:shadow-card-hover"
        >
          {/* soft corner glow on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan/0 blur-2xl transition-colors duration-300 group-hover:bg-cyan/20"
          />
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-cyan shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Icon name={p.icon} className="h-6 w-6" />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-ink">{p.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-body">{p.blurb}</p>
          <ul className="mt-4 space-y-2 border-t border-ink-line pt-4">
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
  );
}
