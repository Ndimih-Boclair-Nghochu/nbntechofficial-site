"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@prisma/client";
import { ProjectCard } from "@/components/site/ProjectCard";
import { cn, categoryLabel } from "@/lib/utils";

const filters = [
  { key: "all", label: "All" },
  { key: "Web", label: "Web" },
  { key: "Mobile", label: "Mobile" },
  { key: "CloudDevOps", label: "Cloud & DevOps" },
  { key: "Other", label: "Other" },
] as const;

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>("all");

  // Only show filters that actually have projects.
  const available = useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return filters.filter((f) => f.key === "all" || present.has(f.key as Project["category"]));
  }, [projects]);

  const shown = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  );

  if (!projects.length) {
    return (
      <div className="rounded-xl2 border border-dashed border-ink-line bg-surface p-12 text-center">
        <p className="text-lg font-medium text-ink">Work is on the way.</p>
        <p className="mt-2 text-ink-body">
          Case studies are being added. In the meantime, get in touch to hear
          about recent projects directly.
        </p>
      </div>
    );
  }

  return (
    <div>
      {available.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
          {available.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={active === f.key}
              onClick={() => setActive(f.key)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active === f.key
                  ? "border-navy bg-navy text-white"
                  : "border-ink-line bg-white text-ink-body hover:border-cyan hover:text-cyan-deep",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} priority={i < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-8 text-sm text-ink-muted" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
        {active !== "all" && ` in ${categoryLabel(active)}`}.
      </p>
    </div>
  );
}
