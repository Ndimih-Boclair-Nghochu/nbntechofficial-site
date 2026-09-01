"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { whatsappUrl, whatsappHelpText } from "@/lib/contact";

/** WhatsApp glyph (brand green button icon). */
function WaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function Body({ query, big }: { query: string; big?: boolean }) {
  const wa = whatsappUrl(whatsappHelpText(query));
  return (
    <div className="text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cyan/10 text-cyan-deep">
        <ShieldCheck className="h-6 w-6" />
      </span>
      <h2 className={`mt-4 font-serif font-bold text-ink ${big ? "text-xl" : "text-lg"}`}>
        “{query}” isn&apos;t listed yet
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-body">
        We don&apos;t have this product on NBN MARKET right now. <b>Please don&apos;t risk getting scammed</b> by an
        unknown seller online — message our team on WhatsApp and we&apos;ll connect you with a{" "}
        <b>trusted, verified seller</b> for it.
      </p>
      <ul className="mx-auto mt-4 max-w-xs space-y-1.5 text-left text-sm text-ink-body">
        <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-deep" /> Sellers we personally vet</li>
        <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-deep" /> No upfront payments to strangers</li>
        <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-deep" /> A real person replies, fast</li>
      </ul>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
      >
        <WaIcon /> Message our team on WhatsApp
      </a>
      <p className="mt-2 text-xs text-ink-muted">Free · no obligation · we reply personally</p>
    </div>
  );
}

/**
 * Shown when a marketplace search returns nothing: a trust-first popup (once,
 * dismissible) plus a persistent inline card so the WhatsApp route is always
 * available on the results page.
 */
export function SearchNoResults({ query }: { query: string }) {
  // Auto-open the popup only once per browsing session (the inline card always shows).
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("nbn_noresult_seen")) {
        setOpen(true);
        sessionStorage.setItem("nbn_noresult_seen", "1");
      }
    } catch {
      /* private mode / storage blocked — just skip the popup */
    }
  }, []);

  return (
    <div className="mt-6">
      {/* Persistent inline card */}
      <div className="mx-auto max-w-md rounded-2xl border border-ink-line bg-surface p-6 shadow-card">
        <Body query={query} />
      </div>

      {/* Popup overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-ink-line bg-surface p-6 shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-ink-muted hover:bg-sand-soft hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
            <Body query={query} big />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 w-full text-center text-xs font-medium text-ink-muted hover:text-ink"
            >
              Keep browsing the marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
