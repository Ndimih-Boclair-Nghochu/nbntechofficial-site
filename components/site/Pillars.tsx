import { Check } from "lucide-react";
import { Icon } from "@/components/site/Icon";
import { RevealGroup, RevealItem } from "@/components/site/Reveal";
import { pillars } from "@/lib/content-defaults";
import { cn } from "@/lib/utils";

export function Pillars({ dark = false }: { dark?: boolean }) {
  return (
    <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p) => (
        <RevealItem
          key={p.key}
          as="article"
          className={cn(
            "group relative flex flex-col overflow-hidden rounded-xl2 border p-6 transition-all duration-300 hover:-translate-y-1.5",
            dark
              ? "border-white/10 bg-white/[0.04] backdrop-blur-sm hover:border-cyan/50 hover:bg-white/[0.07]"
              : "border-ink-line bg-gradient-to-b from-white to-sand/40 shadow-card hover:border-cyan/40 hover:shadow-card-hover",
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan/0 blur-2xl transition-colors duration-300 group-hover:bg-cyan/25"
          />
          <span
            className={cn(
              "relative inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105",
              dark ? "bg-cyan/15 text-cyan" : "bg-navy text-cyan",
            )}
          >
            <Icon name={p.icon} className="h-6 w-6" />
          </span>
          <h3 className={cn("mt-5 text-lg font-semibold", dark ? "text-white" : "text-ink")}>
            {p.title}
          </h3>
          <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-white/65" : "text-ink-body")}>
            {p.blurb}
          </p>
          <ul
            className={cn(
              "mt-4 space-y-2 border-t pt-4",
              dark ? "border-white/10" : "border-ink-line",
            )}
          >
            {p.points.map((pt) => (
              <li
                key={pt}
                className={cn(
                  "flex items-start gap-2 text-sm",
                  dark ? "text-white/70" : "text-ink-body",
                )}
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                {pt}
              </li>
            ))}
          </ul>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
