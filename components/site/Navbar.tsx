"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-sand-deep/70 bg-canvas/85 backdrop-blur-md shadow-[0_1px_18px_rgba(11,30,60,0.06)]">
      <Container className="flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" aria-label="NBN TECH — home" className="relative z-10 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="NBN TECH" className="h-11 w-auto select-none md:h-12" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-semibold transition-colors",
                isActive(l.href)
                  ? "text-cyan-deep underline decoration-cyan decoration-2 underline-offset-[6px]"
                  : "text-ink/75 hover:text-cyan-deep",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-navy-800"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-950 transition-colors hover:bg-navy-950/10 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </Container>

      {/* Mobile side drawer */}
      <div className="md:hidden">
        {/* overlay */}
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden
        />
        {/* panel — slides in from the right */}
        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col overflow-y-auto bg-navy-950 shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #4FC3F7 1px, transparent 1px), linear-gradient(to bottom, #4FC3F7 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Menu</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="relative flex flex-col px-5 pt-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "group flex items-center justify-between border-b border-white/10 py-4 font-serif text-2xl transition-all",
                  isActive(l.href) ? "text-cyan" : "text-white hover:pl-1.5 hover:text-cyan-soft",
                )}
              >
                {l.label}
                <ArrowUpRight
                  className={cn(
                    "h-5 w-5 transition-opacity",
                    isActive(l.href) ? "text-cyan opacity-100" : "text-white/30 opacity-0 group-hover:opacity-100",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="relative mt-auto px-5 pb-8 pt-6">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan px-6 py-4 text-base font-semibold text-navy-950 shadow-[0_8px_30px_rgba(79,195,247,0.35)]"
            >
              Get in touch
              <ArrowUpRight className="h-5 w-5" />
            </Link>
            <p className="mt-6 text-xs text-white/40">
              © {new Date().getFullYear()} NBN TECH · Web · Mobile · Cloud · DevOps
            </p>
          </div>
        </aside>
      </div>
    </header>
  );
}
