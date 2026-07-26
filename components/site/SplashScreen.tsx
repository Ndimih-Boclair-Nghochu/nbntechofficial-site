"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const BRAND = "NBN TECH";
const TYPE_SPEED = 130; // ms per character
const HOLD_AFTER = 650; // ms to hold after bar fills

/**
 * First-visit landing screen: logo beside a typed brand wordmark, a loading bar,
 * then it fades out to reveal the site. Shows once per browser session. Same
 * navy background as the hero. No button — it auto-advances.
 */
export function SplashScreen() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [typed, setTyped] = useState("");
  const [progress, setProgress] = useState(0);

  // Decide whether to show (once per session), after mount to avoid hydration flash.
  useEffect(() => {
    const seen = sessionStorage.getItem("nbn_splash_seen");
    if (seen) return;
    setShow(true);
    document.body.style.overflow = "hidden";
  }, []);

  // Typing effect.
  useEffect(() => {
    if (!show) return;
    if (reduce) {
      setTyped(BRAND);
      return;
    }
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(BRAND.slice(0, i));
      if (i >= BRAND.length) clearInterval(t);
    }, TYPE_SPEED);
    return () => clearInterval(t);
  }, [show, reduce]);

  // Loading bar + dismiss.
  useEffect(() => {
    if (!show) return;
    const total = reduce ? 900 : BRAND.length * TYPE_SPEED + 900;
    const start = performance.now();
    let raf = 0;
    let done = false;

    const dismiss = () => {
      if (done) return;
      done = true;
      sessionStorage.setItem("nbn_splash_seen", "1");
      document.body.style.overflow = "";
      setShow(false);
    };

    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / total) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(dismiss, HOLD_AFTER);
    };
    raf = requestAnimationFrame(tick);

    // Safety net: always dismiss even if rAF is throttled (e.g. background tab).
    const hardStop = setTimeout(() => {
      setProgress(100);
      dismiss();
    }, total + HOLD_AFTER + 1500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hardStop);
    };
  }, [show, reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-navy-950 px-6"
        >
          {/* backdrop motifs — matches the hero */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #2FB49A 1px, transparent 1px), linear-gradient(to bottom, #2FB49A 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/15 blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center gap-4 sm:gap-5"
          >
            {/* logo on the same line as the brand name */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="NBN TECH"
              className="h-14 w-auto rounded-lg bg-white/95 p-1.5 shadow-glow sm:h-16"
            />
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              <span>{typed.split(" ")[0]}</span>
              {typed.includes(" ") && <span className="text-cyan"> {typed.split(" ")[1]}</span>}
              <span className="ml-0.5 inline-block w-[2px] animate-pulse-soft bg-cyan align-middle" style={{ height: "0.9em" }} />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative mt-5 text-sm tracking-wide text-white/55"
          >
            Software · Web · Mobile · Cloud · DevOps
          </motion.p>

          {/* loading bar */}
          <div className="relative mt-10 h-[3px] w-56 overflow-hidden rounded-full bg-white/12 sm:w-72">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-deep to-cyan transition-[width] duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
