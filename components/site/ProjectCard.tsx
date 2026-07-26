import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@prisma/client";
import { categoryLabel } from "@/lib/utils";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl2 border border-ink-line bg-gradient-to-b from-white to-navy-50/40 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan/40 hover:shadow-card-hover">
      {/* stretched link → case study (kept behind interactive footer buttons) */}
      <Link
        href={`/work/${project.slug}`}
        aria-label={`${project.title} — case study`}
        className="absolute inset-0 z-0"
      />

      {/* top accent line grows on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-20 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-cyan-deep to-cyan transition-transform duration-300 group-hover:scale-x-100"
      />

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
        {/* gradient scrim for legibility of the chip */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {categoryLabel(project.category)}
        </span>
        {project.featured && (
          <span className="absolute right-4 top-4 rounded-full bg-cyan px-2.5 py-1 text-xs font-semibold text-navy-950">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="flex items-start justify-between gap-3 text-lg font-semibold text-ink">
          <span className="transition-colors group-hover:text-cyan-deep">{project.title}</span>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-ink-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-deep" />
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-body">{project.summary}</p>

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

        {/* Footer actions — above the stretched link */}
        <div className="relative z-10 mt-5 flex items-center gap-2 border-t border-ink-line pt-4">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-cyan px-4 py-2 text-xs font-semibold text-navy-950 transition-colors hover:bg-cyan-soft"
            >
              View live <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-4 py-2 text-xs font-medium text-ink-muted">
              Case study
            </span>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Source code"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink-line text-ink-muted transition-colors hover:border-cyan hover:text-cyan-deep"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          <span className="ml-auto text-xs font-medium text-ink-muted transition-colors group-hover:text-cyan-deep">
            Read case study →
          </span>
        </div>
      </div>
    </article>
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
