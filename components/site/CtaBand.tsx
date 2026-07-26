import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/site/Reveal";

export function CtaBand({
  headline,
  body,
  email,
}: {
  headline: string;
  body?: string;
  email?: string;
}) {
  return (
    <section className="bg-canvas py-section">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-navy-950 px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(47,180,154,0.5), transparent 40%), radial-gradient(circle at 80% 80%, rgba(47,180,154,0.35), transparent 40%)",
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{headline}</h2>
            {body && <p className="mt-4 text-lg leading-relaxed text-white/70">{body}</p>}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-cyan px-7 py-3.5 text-base font-semibold text-navy-950 transition-colors hover:bg-cyan-soft"
              >
                Start a conversation
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-medium text-white transition-colors hover:border-cyan hover:text-cyan"
                >
                  {email}
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
