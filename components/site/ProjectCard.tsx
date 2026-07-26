import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@prisma/client";
import { categoryLabel } from "@/lib/utils";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl2 border border-ink-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-50">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={project.coverImageAlt || project.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CoverFallback title={project.title} />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {categoryLabel(project.category)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="flex items-start justify-between gap-3 text-lg font-semibold text-ink">
          <span className="transition-colors group-hover:text-cyan-deep">{project.title}</span>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-ink-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-deep" />
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-body">
          {project.summary}
        </p>
        {project.techStack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
            {project.techStack.length > 4 && (
              <li className="tag border-transparent bg-transparent text-ink-muted">
                +{project.techStack.length - 4}
              </li>
            )}
          </ul>
        )}
      </div>
    </Link>
  );
}

/** Branded gradient placeholder when a project has no cover image yet. */
export function CoverFallback({ title }: { title: string }) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4FC3F7 1px, transparent 1px), linear-gradient(to bottom, #4FC3F7 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <span className="relative font-serif text-4xl font-semibold text-cyan/80">{initials}</span>
    </div>
  );
}
