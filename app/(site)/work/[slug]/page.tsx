import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Markdown } from "@/components/site/Markdown";
import { CoverFallback } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import {
  getProjectBySlug,
  getAllProjectSlugs,
  getAdjacentProjects,
  getSiteContent,
} from "@/lib/data";
import { categoryLabel } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.coverImageUrl ? [{ url: project.coverImageUrl }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const [{ prev, next }, content] = await Promise.all([
    getAdjacentProjects(params.slug),
    getSiteContent(),
  ]);

  return (
    <>
      {/* Header — dark indigo overlay, matching the home hero */}
      <header className="relative overflow-hidden bg-navy-950 pt-28 pb-14 text-white sm:pt-32">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/photos/work.jpg')" }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-950/92 via-navy-950/70 to-navy-950/40" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-navy-950/50" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-canvas" />
        <Container className="relative">
          <Reveal className="max-w-3xl">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-cyan"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              All work
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-cyan/40 bg-cyan/10 px-2.5 py-0.5 text-xs font-medium tracking-wide text-cyan">
                {categoryLabel(project.category)}
              </span>
              {project.featured && (
                <span className="text-xs font-medium uppercase tracking-wider text-cyan">
                  Featured
                </span>
              )}
            </div>
            <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/75">{project.summary}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-cyan-soft"
                >
                  Visit live site
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-cyan hover:text-cyan"
                >
                  <Github className="h-4 w-4" />
                  Source
                </a>
              )}
            </div>
          </Reveal>
        </Container>
      </header>

      {/* Cover */}
      <div className="bg-canvas">
        <Container className="pt-10">
          <Reveal className="relative aspect-[16/9] overflow-hidden rounded-xl2 border border-ink-line shadow-card">
            {project.coverImageUrl ? (
              <Image
                src={project.coverImageUrl}
                alt={project.coverImageAlt || project.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            ) : (
              <CoverFallback title={project.title} />
            )}
          </Reveal>
        </Container>
      </div>

      {/* Body + meta */}
      <section className="bg-canvas py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
            {/* Meta sidebar */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <dl className="space-y-6 rounded-xl2 border border-ink-line bg-surface p-6 shadow-card">
                {project.role && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Role
                    </dt>
                    <dd className="mt-1.5 text-sm text-ink">{project.role}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Discipline
                  </dt>
                  <dd className="mt-1.5 text-sm text-ink">{categoryLabel(project.category)}</dd>
                </div>
                {project.techStack.length > 0 && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Tech stack
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {project.techStack.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </aside>

            {/* Case study */}
            <div>
              <Reveal>
                <Markdown>{project.description}</Markdown>
              </Reveal>

              {/* Gallery */}
              {project.gallery.length > 0 && (
                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((src, i) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-ink-line"
                    >
                      <Image
                        src={src}
                        alt={`${project.title} — screenshot ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Prev / next */}
      {(prev || next) && (
        <section className="border-t border-ink-line bg-white py-12">
          <Container>
            <div className="grid gap-4 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/work/${prev.slug}`}
                  className="group flex flex-col rounded-xl2 border border-ink-line bg-surface p-6 transition-colors hover:border-cyan/40"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ink-muted">
                    <ArrowLeft className="h-3.5 w-3.5" /> Previous
                  </span>
                  <span className="mt-2 font-semibold text-ink group-hover:text-cyan-deep">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next && (
                <Link
                  href={`/work/${next.slug}`}
                  className="group flex flex-col rounded-xl2 border border-ink-line bg-surface p-6 text-right transition-colors hover:border-cyan/40"
                >
                  <span className="inline-flex items-center justify-end gap-1.5 text-xs font-medium uppercase tracking-wider text-ink-muted">
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="mt-2 font-semibold text-ink group-hover:text-cyan-deep">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </Container>
        </section>
      )}

      <CtaBand
        headline={content.contactHeadline}
        body={content.contactBody}
        email={content.contactEmail}
      />
    </>
  );
}
