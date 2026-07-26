"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useEffect, useRef, useState } from "react";

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
  const ref = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setParallax({ x: px, y: py });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [reduce]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-950 text-white"
    >
      {/* Background photo (optional) — kept clearly visible with a directional
          navy scrim that only darkens the text side. */}
      {photoUrl ? (
        <>
          <Image
            src={photoUrl}
            alt={photoAlt || ""}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-[0.72]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-900/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-navy-950/30" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
      )}

      {/* Soft glow accents (no grid / squares) */}
      <HeroDecor parallax={parallax} reduce={!!reduce} />

      <Container className="relative z-10 py-28">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-cyan-soft backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            Available for new engagements
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-6 text-hero font-semibold text-white"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          >
            {subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 rounded-full bg-cyan px-7 py-3.5 text-base font-semibold text-navy-950 transition-colors hover:bg-cyan-soft"
            >
              View my work
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-medium text-white transition-colors hover:border-cyan hover:text-cyan"
            >
              Get in touch
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 text-sm text-white/50"
          >
            {positioning}
          </motion.p>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 flex flex-wrap gap-x-6 gap-y-2"
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

      {/* bottom fade into the light body */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-canvas/0" />
    </section>
  );
}

function HeroDecor({
  parallax,
  reduce,
}: {
  parallax: { x: number; y: number };
  reduce: boolean;
}) {
  const shift = (depth: number) =>
    reduce ? {} : { x: parallax.x * depth, y: parallax.y * depth };

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* soft glow accents only — no grid, no squares */}
      <motion.div
        animate={shift(-30)}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
        className="absolute right-[6%] top-[16%] h-80 w-80 rounded-full bg-cyan/20 blur-3xl"
      />
      <motion.div
        animate={shift(20)}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
        className="absolute right-[26%] bottom-[10%] h-56 w-56 rounded-full bg-cyan-deep/15 blur-3xl"
      />
    </div>
  );
}
