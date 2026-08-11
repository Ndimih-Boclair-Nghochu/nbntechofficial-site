import Link from "next/link";
import { Info } from "lucide-react";

/** Visible affiliate disclosure used across the marketplace. */
export function AffiliateDisclosure({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      className={`flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 ${className}`}
    >
      <Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden />
      <p>
        <strong className="font-semibold">Affiliate disclosure:</strong> Some links on the Ndimih
        Boclair Marketplace are affiliate links. If you buy through one, we may earn a commission at
        no additional cost to you — it never changes what we recommend.{" "}
        <Link href="/marketplace/disclosure" className="underline underline-offset-2">
          Learn more
        </Link>
        .
      </p>
    </div>
  );
}
