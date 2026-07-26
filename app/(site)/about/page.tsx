import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { CoverFallback } from "@/components/site/ProjectCard";
import { getSiteContent } from "@/lib/data";
import { processSteps } from "@/lib/content-defaults";

export const metadata: Metadata = {
  title: "About",
  description:
    "The engineer behind NBN TECH — full-stack across web, mobile, cloud and DevOps, with a bias for software that outlives the engagement.",
};

export const revalidate = 60;

const values = [
  {
    title: "Own the outcome",
    body: "I don't hand over a codebase and disappear. Success is your product working in production, not a green checkmark on my machine.",
  },
  {
    title: "Boring on purpose",
    body: "Proven tools, tested migrations, monitored releases. The interesting parts of engineering should be your product, not my infrastructure.",
  },
  {
    title: "Write it down",
    body: "Decisions, trade-offs and runbooks live in the repo. Your team should be able to own what I build without a phone call to me.",
  },
  {
    title: "Ship in the open",
    body: "You watch the work land in a live environment continuously — no month-long silence ending in a big reveal.",
  },
];

export default async function AboutPage() {
  const content = await getSiteContent();
  const paragraphs = content.aboutText.split("\n\n");

  return (
    <>
      <PageHeader eyebrow="About" title={content.aboutTitle} background="/photos/about.jpg" />

      {/* Bio + photo */}
      <section className="bg-canvas py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <Reveal className="prose-nbn">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-lg">
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal delay={0.1} className="lg:pt-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 border border-ink-line shadow-card">
                {content.aboutPhotoUrl ? (
                  <Image
                    src={content.aboutPhotoUrl}
                    alt={content.aboutPhotoAlt || "The engineer behind NBN TECH"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <CoverFallback title="NBN TECH" />
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-y border-ink-line bg-white py-section">
        <Container>
          <SectionHeading
            eyebrow="How I work"
            title="An approach to engineering."
            intro="Principles that show up in every engagement — the difference between code that ships and code that lasts."
          />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v, i) => (
              <RevealItem
                key={v.title}
                className="rounded-xl2 border border-ink-line bg-surface p-7 shadow-card"
              >
                <span className="font-serif text-2xl font-semibold text-cyan/70">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-body">{v.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Process teaser */}
      <section className="bg-canvas py-section">
        <Container>
          <SectionHeading
            eyebrow="The engagement"
            title="How projects run."
            intro="A predictable path from first conversation to a product your team can own."
          />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((s) => (
              <RevealItem
                key={s.step}
                className="rounded-xl border border-ink-line bg-surface p-5 shadow-card"
              >
                <span className="text-sm font-semibold text-cyan-deep">{s.step}</span>
                <h3 className="mt-2 font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-body">{s.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
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
