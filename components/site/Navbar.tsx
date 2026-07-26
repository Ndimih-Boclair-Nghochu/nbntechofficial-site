"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Home page has a dark full-bleed hero → navbar starts transparent/light.
  const transparentOnTop = pathname === "/";
  const solid = scrolled || !transparentOnTop;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close menu on route change.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-ink-line/70 bg-canvas/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" aria-label="NBN TECH — home" className="relative z-10">
          {/* On the transparent hero the dark logo sits in a soft chip for contrast */}
          <span
            className={cn(
              "inline-flex items-center rounded-lg transition-colors",
              !solid && "bg-white/90 px-2 py-1 shadow-sm",
            )}
          >
            <Logo priority height={36} />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "link-underline text-sm font-medium transition-colors",
                solid
                  ? isActive(l.href)
                    ? "text-cyan-deep"
                    : "text-ink hover:text-cyan-deep"
                  : "text-white/85 hover:text-white",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
              solid
                ? "bg-navy text-white hover:bg-navy-700"
                : "bg-cyan text-navy-950 font-semibold hover:bg-cyan-soft",
            )}
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={cn(
            "relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg md:hidden",
            open || solid ? "text-navy" : "text-white",
            !solid && !open && "bg-white/90 shadow-sm",
          )}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-0 flex flex-col bg-navy-950 px-6 pb-10 pt-24 transition-all duration-300 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "border-b border-white/10 py-4 font-serif text-3xl transition-colors",
                isActive(l.href) ? "text-cyan" : "text-white hover:text-cyan-soft",
              )}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-cyan px-6 py-4 text-base font-semibold text-navy-950"
        >
          Get in touch
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
