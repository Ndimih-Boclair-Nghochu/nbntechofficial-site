import Image from "next/image";
import type { Skill } from "@prisma/client";
import { Icon, hasIcon } from "@/components/site/Icon";
import { RevealGroup, RevealItem } from "@/components/site/Reveal";
import { categoryLabel } from "@/lib/utils";

const order = ["Frontend", "Backend", "Mobile", "CloudDevOps", "Other"];

export function SkillGrid({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  const grouped = order
    .map((cat) => ({
      category: cat,
      items: skills.filter((s) => s.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-10">
      {grouped.map((group) => (
        <div key={group.category}>
          <h3 className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {categoryLabel(group.category)}
            <span className="h-px flex-1 bg-ink-line" />
          </h3>
          <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {group.items.map((s) => (
              <RevealItem
                key={s.id}
                className="flex items-center gap-3 rounded-xl border border-ink-line bg-surface px-4 py-3 shadow-card transition-colors hover:border-cyan/40"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                  {s.icon && !hasIcon(s.icon) && s.icon.startsWith("http") ? (
                    <Image src={s.icon} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
                  ) : (
                    <Icon name={s.icon} className="h-5 w-5" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                  {typeof s.proficiency === "number" && (
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-ink-line">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-deep to-cyan"
                        style={{ width: `${Math.min(100, Math.max(0, s.proficiency))}%` }}
                      />
                    </div>
                  )}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      ))}
    </div>
  );
}
