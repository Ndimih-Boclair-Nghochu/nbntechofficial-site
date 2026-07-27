import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, PenLine, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/site/Hero";
import { Pillars } from "@/components/site/Pillars";
import { SectionHeading } from "@/components/site/SectionHeading";
import { FeaturedProjects } from "@/components/site/FeaturedProjects";
import { SkillGrid } from "@/components/site/SkillGrid";
import { ReviewsMarquee } from "@/components/site/ReviewsMarquee";
import { ValuesMarquee } from "@/components/site/ValuesMarquee";
import { Faq } from "@/components/site/Faq";
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

      {/* Values ticker — bridges the hero into the body */}
      <ValuesMarquee />

      {/* About preview — framed portrait + narrative + highlights */}
      <section className="relative overflow-hidden bg-canvas py-section">
        <SectionDecor grid glow="right" />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* photo */}
            <Reveal className="order-2 lg:order-1">
              <div className="relative mx-auto max-w-md">
                <div
                  aria-hidden
                  className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-cyan/15 to-iris/15 blur-2xl"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-ink-line shadow-card">
                  <Image
                    src={content.aboutPhotoUrl || "/photos/about.jpg"}
                    alt={content.aboutPhotoAlt || "The engineer behind NBN TECH"}
                    fill
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="absolute -right-3 bottom-8 hidden rounded-xl border border-ink-line bg-white px-5 py-3 shadow-card sm:block">
                  <p className="text-xl font-bold text-navy">Full-stack</p>
                  <p className="text-xs text-ink-muted">web · mobile · cloud · devops</p>
                </div>
              </div>
            </Reveal>

            {/* narrative */}
            <Reveal delay={0.1} className="order-1 lg:order-2">
              <span className="eyebrow">
                <span className="h-px w-6 bg-current opacity-60" />
                About
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {content.aboutTitle}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-body">
                {content.aboutText.split("\n\n")[0]}
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                {["End-to-end ownership", "Production-grade code", "Calm, boring launches"].map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 rounded-xl border border-ink-line bg-white p-3 text-sm font-medium text-ink shadow-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-deep" />
                    {h}
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="group mt-7 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
              >
                Read the full story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* What I do — numbered service cards */}
      <section className="relative bg-sand py-section">
        <SectionDecor grid glow="left" />
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
        <section className="relative bg-surface py-section">
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
        <section className="relative bg-sand py-section">
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

      {/* FAQ — accordion */}
      <section className="relative bg-canvas py-section">
        <SectionDecor glow="left" />
        <Container className="relative">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered."
            intro="The things people usually want to know before we start working together."
            align="center"
          />
          <Faq />
        </Container>
      </section>

      <CtaBand
        headline={content.contactHeadline}
        body={content.contactBody}
        email={content.contactEmail}
      />
    </>
  );
}
