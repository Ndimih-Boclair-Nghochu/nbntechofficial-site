"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/Logo";
import { SocialLinks } from "@/components/site/SocialLinks";
import type { ResolvedSiteContent } from "@/lib/data";

const nav = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ content }: { content: ResolvedSiteContent }) {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // The marketplace has its own footer — hide the NBN TECH site footer there.
  if (pathname.startsWith("/nbnmarket")) return null;

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      {/* subtle top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl"
      />
      <Container className="relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="inline-flex rounded-lg bg-white/95 px-2.5 py-1.5">
              <Logo height={34} />
            </span>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {content.positioningStatement}
            </p>
            <SocialLinks links={content.socialLinks} variant="light" className="mt-6" />
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
              Contact
            </h3>
            {content.contactEmail && (
              <a
                href={`mailto:${content.contactEmail}`}
                className="mt-4 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" />
                {content.contactEmail}
              </a>
            )}
            <div className="mt-5">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-cyan hover:text-cyan-soft"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>© {year} NBN TECH — Ndimih Boclair Nghochu. All rights reserved.</p>
          <p>Software Engineer · Web · Mobile · Cloud · DevOps</p>
        </div>
      </Container>
    </footer>
  );
}
