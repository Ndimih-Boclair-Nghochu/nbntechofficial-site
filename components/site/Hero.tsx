"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Typewriter } from "@/components/site/Typewriter";

const pillars = ["Web", "Mobile", "Cloud", "DevOps"];

export function Hero({
  headline,
  subheadline,
  positioning,
  photoUrl,
  photoAlt,
}: {
  headline: string;
  subheadline: string;
  positioning: string;
  photoUrl?: string | null;
  photoAlt?: string;
}) {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative flex min-h-[88svh] items-center overflow-hidden bg-navy-950 pt-16 text-white sm:min-h-[92vh] sm:pt-0">
      {/* Full-bleed background image */}
      {photoUrl ? (
        <>
          <Image
            src={photoUrl}
            alt={photoAlt || ""}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* indigo scrim — darker at the bottom/left for text, image still visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/92 via-navy-950/70 to-navy-950/40 lg:to-navy-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-navy-950/50" />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 82% 15%, rgba(47,180,154,0.22), transparent 34%), linear-gradient(135deg, #04045E 0%, #050572 55%, #062F6F 100%)",
          }}
        />
      )}

      {/* soft teal glows */}
      <div aria-hidden className="pointer-events-none absolute right-[-6%] top-[12%] h-80 w-80 rounded-full bg-cyan/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute left-[-8%] bottom-[-6%] h-72 w-72 rounded-full bg-iris/20 blur-3xl" />

      <Container className="relative z-10 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-3xl lg:text-left">
          <motion.span
            {...fade(0)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-soft backdrop-blur-sm sm:text-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Available for new engagements
          </motion.span>

          <motion.h1
            {...fade(0.08)}
            className="mt-5 whitespace-nowrap text-[clamp(1.35rem,5.2vw,4rem)] font-bold leading-[1.1] tracking-tight text-white sm:mt-6"
          >
            <Typewriter text={headline} />
          </motion.h1>

          <motion.p
            {...fade(0.16)}
            className="mx-auto mt-5 max-w-xl text-pretty text-[1.02rem] leading-relaxed text-white/80 sm:text-lg lg:mx-0"
          >
            {subheadline}
          </motion.p>

          <motion.div
            {...fade(0.24)}
            className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start"
          >
            <Link
              href="/work"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-7 py-3.5 text-base font-semibold text-navy-950 shadow-glow transition-colors hover:bg-cyan-soft"
            >
              View my work
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 text-base font-medium text-white transition-colors hover:border-cyan hover:text-cyan"
            >
              Get in touch
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          <motion.p {...fade(0.4)} className="mt-10 text-sm text-white/55 sm:mt-12">
            {positioning}
          </motion.p>

          <motion.ul
            {...fade(0.5)}
            className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 lg:justify-start"
          >
            {pillars.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                {p}
              </li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}
