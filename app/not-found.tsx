import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6 text-center text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #2FB49A 1px, transparent 1px), linear-gradient(to bottom, #2FB49A 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <p className="relative font-serif text-7xl font-semibold text-cyan">404</p>
      <h1 className="relative mt-4 text-2xl font-semibold text-white">Page not found</h1>
      <p className="relative mt-2 max-w-sm text-white/60">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-navy-950 hover:bg-cyan-soft"
        >
          <Home className="h-4 w-4" /> Home
        </Link>
        <Link
          href="/work"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:border-cyan hover:text-cyan"
        >
          <ArrowLeft className="h-4 w-4" /> View work
        </Link>
      </div>
    </main>
  );
}
