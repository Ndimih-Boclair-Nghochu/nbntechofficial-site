import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import type { Project } from "@prisma/client";
import { categoryLabel } from "@/lib/utils";

/**
 * Project card. The whole card is a single link — to the live site when a Live
 * URL is set, otherwise to the project page. One clear "View live" action, no
 * tech-stack tags.
 */
export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const hasLive = Boolean(project.liveUrl);
  const href = hasLive ? project.liveUrl! : `/work/${project.slug}`;

  const inner = (
    <>
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
            className="object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <CoverFallback title={project.title} />
        )}
        {/* depth + legibility overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90"
        />
        <span className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy backdrop-blur-sm">
          {categoryLabel(project.category)}
        </span>
        {project.featured && (
          <span className="absolute right-3.5 top-3.5 rounded-full bg-cyan px-2.5 py-1 text-[11px] font-bold text-navy-950">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-cyan-deep sm:text-xl">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-body">{project.summary}</p>

        <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-cyan-deep">
          {hasLive ? "View live" : "View project"}
          {hasLive ? (
            <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          ) : (
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </div>
      </div>
    </>
  );

  const className =
    "group relative flex flex-col overflow-hidden rounded-xl2 border border-ink-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan/40 hover:shadow-card-hover";

  return hasLive ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${project.title} — view live`}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className} aria-label={`${project.title} — view project`}>
      {inner}
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
            "linear-gradient(to right, #2FB49A 1px, transparent 1px), linear-gradient(to bottom, #2FB49A 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <span className="relative font-serif text-4xl font-semibold text-cyan/80">{initials}</span>
    </div>
  );
}
