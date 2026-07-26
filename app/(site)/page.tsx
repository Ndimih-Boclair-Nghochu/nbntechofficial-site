import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/site/Hero";
import { Pillars } from "@/components/site/Pillars";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SkillGrid } from "@/components/site/SkillGrid";
import { Testimonials } from "@/components/site/Testimonials";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/Reveal";
import {
  getSiteContent,
  getFeaturedProjects,
  getSkills,
  getTestimonials,
} from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [content, featured, skills, testimonials] = await Promise.all([
    getSiteContent(),
    getFeaturedProjects(),
    getSkills(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero
        headline={content.heroHeadline}
        subheadline={content.heroSubheadline}
        positioning={content.positioningStatement}
        photoUrl={content.heroPhotoUrl}
        photoAlt={content.heroPhotoAlt}
      />

      {/* About preview */}
      <section className="bg-canvas py-section">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <span className="eyebrow">
                <span className="h-px w-6 bg-current opacity-60" />
                About
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {content.aboutTitle}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-ink-body">
                {content.aboutText.split("\n\n")[0]}
              </p>
              <Link
                href="/about"
                className="group mt-6 inline-flex items-center gap-2 font-medium text-cyan-deep"
              >
                Read the full story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Expertise pillars */}
      <section className="border-y border-ink-line bg-white py-section">
        <Container>
          <SectionHeading
            eyebrow="What I do"
            title="Four disciplines, one engineer."
            intro="End-to-end capability means fewer handoffs, fewer seams, and a product that holds together from the database to the pixel."
          />
          <div className="mt-12">
            <Pillars />
          </div>
        </Container>
      </section>

      {/* Featured projects */}
      {featured.length > 0 && (
        <section className="bg-canvas py-section">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Selected work"
                title="Projects built to last."
                intro="A few engagements where the second release mattered as much as the first."
              />
              <Reveal delay={0.1}>
                <Link
                  href="/work"
                  className="group inline-flex items-center gap-2 font-medium text-cyan-deep"
                >
                  View all work
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <ProjectCard key={p.id} project={p} priority={i === 0} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Tech stack */}
      {skills.length > 0 && (
        <section className="border-y border-ink-line bg-white py-section">
          <Container>
            <SectionHeading
              eyebrow="Tech stack"
              title="Tools I reach for."
              intro="A pragmatic, boring-in-the-best-way toolkit — chosen for reliability, not novelty."
            />
            <div className="mt-12">
              <SkillGrid skills={skills} />
            </div>
          </Container>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-navy-950 py-section text-white">
          <Container>
            <SectionHeading
              eyebrow="In their words"
              title="What clients say."
              variant="light"
            />
            <div className="mt-12">
              <Testimonials items={testimonials} />
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
