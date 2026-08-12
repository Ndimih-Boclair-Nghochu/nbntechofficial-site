"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Continuous typewriter: types the text out, pauses, deletes, and retypes — with
 * a blinking caret. The full text is always present (visually-hidden) so it stays
 * SEO- and screen-reader friendly. Honors prefers-reduced-motion.
 */
export function Typewriter({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    if (!text || reduce) return;
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (count < text.length) t = setTimeout(() => setCount((c) => c + 1), 80);
      else t = setTimeout(() => setPhase("pausing"), 1900);
    } else if (phase === "pausing") {
      t = setTimeout(() => setPhase("deleting"), 250);
    } else {
      if (count > 0) t = setTimeout(() => setCount((c) => c - 1), 42);
      else t = setTimeout(() => setPhase("typing"), 500);
    }
    return () => clearTimeout(t);
  }, [count, phase, text, reduce]);

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.slice(0, count)}
        <span className="nbn-caret text-cyan">|</span>
      </span>
    </span>
  );
}
