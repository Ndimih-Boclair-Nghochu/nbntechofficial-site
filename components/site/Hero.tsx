"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";

const pillars = ["Web", "Mobile", "Cloud", "DevOps"];
const floatChips = [
  { label: "React · Next.js", cls: "left-2 top-10" },
  { label: "AWS · DevOps", cls: "right-0 top-1/3" },
  { label: "React Native", cls: "left-0 bottom-16" },
];

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
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      {/* hooyia-style indigo gradient + radial glows */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.06), transparent 30%), radial-gradient(circle at 82% 15%, rgba(47,180,154,0.20), transparent 32%), linear-gradient(135deg, #04045E 0%, #050572 55%, #062F6F 100%)",
        }}
      />
      <div aria-hidden className="absolute right-[-6%] bottom-[-10%] h-96 w-96 rounded-full bg-cyan/15 blur-3xl" />

      <Container className="relative z-10 grid items-center gap-12 pb-20 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-40">
        {/* Left: copy */}
        <div className="max-w-xl">
          <motion.span
            {...fade(0)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-soft backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Available for new engagements
          </motion.span>

          <motion.h1 {...fade(0.08)} className="mt-6 text-hero font-bold text-white">
            {headline}
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 text-lg leading-relaxed text-white/70">
            {subheadline}
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 rounded-lg bg-cyan px-7 py-3.5 text-base font-semibold text-navy-950 shadow-glow transition-colors hover:bg-cyan-soft"
            >
              View my work
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-lg border border-white/25 px-7 py-3.5 text-base font-medium text-white transition-colors hover:border-cyan hover:text-cyan"
            >
              Get in touch
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          <motion.ul {...fade(0.36)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {pillars.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                {p}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right: framed portrait so the face is always fully visible */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          {/* glow ring */}
          <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-cyan/25 to-iris/25 blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 shadow-2xl">
            <Image
              src={photoUrl || "/photos/hero.jpg"}
              alt={photoAlt || "Portrait of the founder of NBN TECH"}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
          </div>

          {/* floating tech chips (hooyia-style dynamism) */}
          {!reduce &&
            floatChips.map((c, i) => (
              <motion.span
                key={c.label}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                className={`absolute ${c.cls} hidden rounded-lg border border-white/15 bg-navy-900/80 px-3 py-1.5 text-xs font-medium text-cyan-soft shadow-lg backdrop-blur-sm sm:inline-flex`}
              >
                {c.label}
              </motion.span>
            ))}

          {/* positioning statement card */}
          <div className="absolute -bottom-5 left-1/2 w-[86%] -translate-x-1/2 rounded-xl border border-white/10 bg-navy-900/90 px-5 py-3 text-center text-sm text-white/75 shadow-xl backdrop-blur-sm">
            {positioning}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
