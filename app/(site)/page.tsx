import Link from "next/link";
import { ArrowRight, Star, PenLine } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/site/Hero";
import { Pillars } from "@/components/site/Pillars";
import { SectionHeading } from "@/components/site/SectionHeading";
import { FeaturedProjects } from "@/components/site/FeaturedProjects";
import { SkillGrid } from "@/components/site/SkillGrid";
import { ReviewsMarquee } from "@/components/site/ReviewsMarquee";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionDecor } from "@/components/site/SectionDecor";
import { Reveal } from "@/components/site/Reveal";
import { getSiteContent, getProjects, getSkills, getTestimonials } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [content, projects, skills, reviews] = await Promise.all([
    getSiteContent(),
    getProjects(),
    getSkills(),
    getTestimonials({ approvedOnly: true }),
  ]);

  return (
    <>
      <Hero
        headline={content.heroHeadline}
        subheadline={content.heroSubheadline}
        positioning={content.positioningStatement}
        photoUrl={content.heroPhotoUrl || "/photos/hero.jpg"}
        photoAlt={content.heroPhotoAlt}
      />

      {/* About preview — blends out of the hero into the light body */}
      <section className="relative bg-gradient-to-b from-canvas to-white py-section">
        <SectionDecor grid glow="right" />
        <Container className="relative">
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
      <section className="relative bg-gradient-to-br from-white via-navy-50/50 to-white py-section">
        <SectionDecor glow="left" />
        <Container className="relative">
          <SectionHeading
            eyebrow="What I do"
            title="Four disciplines, one engineer."
            intro="Most projects die in the gaps between specialists. I cover the whole path — interface, API, data, and the pipeline that ships it — so nothing falls through the seams."
          />
          <div className="mt-12">
            <Pillars />
          </div>
        </Container>
      </section>

      {/* Selected work — filterable */}
      {projects.length > 0 && (
        <section className="relative bg-gradient-to-b from-white to-navy-50/60 py-section">
          <SectionDecor grid glow="both" />
          <Container className="relative">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Selected work"
                title="Work that held up."
                intro="A cross-section of what I've shipped — filter by the kind of problem you're solving."
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
            <div className="mt-12">
              <FeaturedProjects projects={projects} />
            </div>
          </Container>
        </section>
      )}

      {/* Tech stack — continues the navy-tint so it blends from the projects */}
      {skills.length > 0 && (
        <section className="relative bg-gradient-to-b from-navy-50/60 to-white py-section">
          <SectionDecor grid glow="right" />
          <Container className="relative">
            <SectionHeading
              eyebrow="Tech stack"
              title="A toolkit chosen for the long run."
              intro="Nothing here is trendy for its own sake. Every tool earns its place by being dependable at 2 a.m."
            />
            <div className="mt-12">
              <SkillGrid skills={skills} />
            </div>
          </Container>
        </section>
      )}

      {/* Reviews — rotating marquee on navy */}
      {reviews.length > 0 && (
        <section className="relative overflow-hidden bg-navy-950 py-section text-white">
          {/* top fade blends from the light section above */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />
          <Container className="relative">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Reviews"
                title="Words from the people I've built for."
                variant="light"
              />
              <Reveal delay={0.1}>
                <Link
                  href="/reviews"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-cyan hover:text-cyan"
                >
                  <PenLine className="h-4 w-4" /> Read all & add yours
                </Link>
              </Reveal>
            </div>
          </Container>
          <div className="relative mt-12">
            <ReviewsMarquee items={reviews} />
          </div>
          <Container className="relative mt-10 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <Star className="h-4 w-4 fill-cyan text-cyan" /> Trusted by founders & product teams
            </span>
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
