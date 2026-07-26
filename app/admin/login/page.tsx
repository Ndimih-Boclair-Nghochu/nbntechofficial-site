import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5 py-12">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #2FB49A 1px, transparent 1px), linear-gradient(to bottom, #2FB49A 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <span className="inline-flex rounded-xl bg-white/95 px-4 py-2.5">
            <Logo height={38} />
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          <h1 className="text-center text-2xl font-semibold text-ink">Admin sign in</h1>
          <p className="mt-1.5 text-center text-sm text-ink-muted">
            Manage your projects, skills and site content.
          </p>
          <div className="mt-7">
            <LoginForm />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-white/50">
          <Link href="/" className="hover:text-cyan">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
