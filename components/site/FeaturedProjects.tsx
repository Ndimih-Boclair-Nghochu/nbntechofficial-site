"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@prisma/client";
import { ProjectCard } from "@/components/site/ProjectCard";
import { cn } from "@/lib/utils";

const filters = [
  { key: "all", label: "All" },
  { key: "Web", label: "Web" },
  { key: "Mobile", label: "Mobile" },
  { key: "Desktop", label: "Desktop" },
  { key: "CloudDevOps", label: "Cloud & DevOps" },
  { key: "Other", label: "Other" },
] as const;

/** Filterable projects grid for the home page (featured first). */
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>("all");

  const available = useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return filters.filter((f) => f.key === "all" || present.has(f.key as Project["category"]));
  }, [projects]);

  const shown = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  );

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
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active === f.key
                  ? "border-cyan bg-cyan text-navy-950 shadow-[0_6px_18px_rgba(79,195,247,0.3)]"
                  : "border-ink-line bg-white/70 text-ink-body hover:border-cyan hover:text-cyan-deep",
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
    </div>
  );
}
