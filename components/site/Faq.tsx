"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What kind of projects do you take on?",
    a: "Web platforms, mobile and desktop apps, and the cloud infrastructure and DevOps pipelines underneath them. Anything from a greenfield product to rescuing a stalled build.",
  },
  {
    q: "How do you scope and price work?",
    a: "We start with a short discovery call to pin down the real problem, then I propose fixed, milestone-based scope with dates — so you always know what you're paying for and when it lands.",
  },
  {
    q: "Do you work with existing teams and codebases?",
    a: "Yes. I slot into existing repos and teams often — reviewing, refactoring, and shipping alongside your engineers, and leaving clear docs so the work outlives the engagement.",
  },
  {
    q: "How do you handle launch and maintenance?",
    a: "Migrations are rehearsed, monitoring and rollback are in place before launch, and I stay on for the second release. Launch day is deliberately uneventful.",
  },
  {
    q: "Where are you based and how do we work together?",
    a: "Remote, working with clients worldwide. You get continuous delivery to a live environment, not month-long silence — so you can watch the work come together.",
  },
  {
    q: "How do we get started?",
    a: "Send a message from the contact page with what you're building and where it's stuck. I read every message myself and reply within two business days.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto mt-12 max-w-3xl space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className={cn(
              "overflow-hidden rounded-xl2 border bg-white transition-colors",
              isOpen ? "border-cyan/40 shadow-card" : "border-ink-line shadow-sm",
            )}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
            >
              <span className="text-base font-semibold text-ink">{f.q}</span>
              <span
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                  isOpen ? "rotate-45 bg-cyan text-navy-950" : "bg-navy/5 text-navy",
                )}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink-body sm:px-6">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
