"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** A back arrow for navigating between marketplace pages. */
export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className={`inline-flex items-center gap-1.5 rounded-lg border border-ink-line bg-surface px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-cyan hover:text-cyan-deep ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}
