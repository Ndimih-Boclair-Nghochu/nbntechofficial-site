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
  { href: "/reviews", label: "Reviews" },
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
          ? "border-b border-cyan/20 bg-canvas/90 shadow-[0_1px_20px_rgba(11,30,60,0.06)] backdrop-blur-md"
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
            className="group inline-flex items-center gap-1.5 rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-[0_6px_20px_rgba(79,195,247,0.35)] transition-all hover:bg-cyan-soft hover:shadow-[0_8px_26px_rgba(79,195,247,0.45)]"
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
          "fixed inset-0 z-0 flex flex-col overflow-y-auto bg-navy-950 px-6 pb-10 pt-24 transition-all duration-300 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #4FC3F7 1px, transparent 1px), linear-gradient(to bottom, #4FC3F7 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-24 h-56 w-56 rounded-full bg-cyan/10 blur-3xl"
        />
        <p className="relative mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan/80">
          Menu
        </p>
        <nav className="relative flex flex-col">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "group flex items-center justify-between border-b border-white/10 py-4 font-serif text-3xl transition-all",
                isActive(l.href) ? "text-cyan" : "text-white hover:text-cyan-soft hover:pl-1.5",
              )}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              {l.label}
              <ArrowUpRight
                className={cn(
                  "h-5 w-5 transition-all",
                  isActive(l.href)
                    ? "text-cyan opacity-100"
                    : "text-white/30 opacity-0 group-hover:opacity-100",
                )}
              />
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="relative mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-cyan px-6 py-4 text-base font-semibold text-navy-950 shadow-[0_8px_30px_rgba(79,195,247,0.35)]"
        >
          Get in touch
          <ArrowUpRight className="h-5 w-5" />
        </Link>
        <p className="relative mt-auto pt-8 text-xs text-white/40">
          © {new Date().getFullYear()} NBN TECH · Web · Mobile · Cloud · DevOps
        </p>
      </div>
    </header>
  );
}
