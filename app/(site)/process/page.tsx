import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { getSiteContent } from "@/lib/data";
import { processSteps } from "@/lib/content-defaults";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How engagements with NBN TECH run: Discover, Design & Plan, Build, Launch, Support — a predictable path with no black boxes.",
};

export const revalidate = 60;

const deliverables = [
  "A clear statement of the problem and success criteria",
  "Architecture & data model you can actually see",
  "A milestone plan with dates, not vibes",
  "Continuous delivery to a live staging environment",
  "Rehearsed migrations and a tested rollback",
  "Monitoring, docs and a handover your team can own",
];

export default async function ProcessPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHeader
        eyebrow="Process"
        title="Launch day should be boring."
        intro="Good engineering is mostly the removal of surprises. Here's the path every engagement follows — visible, incremental, and calm by design."
        background="/hero/process.png"
      />

      {/* Timeline */}
      <section className="bg-canvas py-section">
        <Container>
          <div className="relative">
            {/* connecting line */}
            <div
              aria-hidden
              className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-cyan via-ink-line to-transparent sm:block"
            />
            <RevealGroup className="space-y-6">
              {processSteps.map((s, i) => (
                <RevealItem key={s.step} className="relative flex gap-5 sm:gap-8">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan/30 bg-white font-serif text-lg font-semibold text-navy shadow-card">
                    {s.step}
                  </div>
                  <div className="flex-1 rounded-xl2 border border-ink-line bg-surface p-6 shadow-card sm:p-7">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-xl font-semibold text-ink">{s.title}</h2>
                      <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
                        Step {i + 1} of {processSteps.length}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl leading-relaxed text-ink-body">{s.body}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </section>

      {/* What you get */}
      <section className="border-y border-ink-line bg-white py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <span className="eyebrow">
                <span className="h-px w-6 bg-current opacity-60" />
                What you get
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Tangible artifacts, not status updates.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-body">
                Every engagement produces the same set of concrete deliverables,
                whatever the project.
              </p>
            </Reveal>
            <RevealGroup className="grid gap-3 sm:grid-cols-2">
              {deliverables.map((d) => (
                <RevealItem
                  key={d}
                  className="flex items-start gap-3 rounded-xl border border-ink-line bg-canvas p-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan/10 text-xs font-bold text-cyan-deep">
                    ✓
                  </span>
                  <span className="text-sm leading-relaxed text-ink-body">{d}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
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
