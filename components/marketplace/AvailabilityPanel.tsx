"use client";

import { AVAILABILITY_LABEL, type AvailabilityStatus, COUNTRIES } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useCountry } from "./CountryProvider";
import { AmazonLink } from "./AmazonLink";
import { track } from "./track";

/** Serializable availability entry (from availabilityByCountry). */
export type AvailabilityEntry = {
  status: AvailabilityStatus;
  url: string;
  hasDirectUrl: boolean;
  priceLabel: string;
  countryName: string;
  flag: string;
};

const badgeClasses: Record<AvailabilityStatus, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  UNAVAILABLE: "bg-rose-50 text-rose-700 ring-rose-600/20",
  AVAILABILITY_UNKNOWN: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

export function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        badgeClasses[status],
      )}
    >
      {AVAILABILITY_LABEL[status]}
    </span>
  );
}

/**
 * Interactive "Check availability in your country" panel. All countries are
 * rendered server-side in the availability table (crawlable); this panel simply
 * reflects the currently-selected country and gives a clear Amazon CTA.
 */
export function AvailabilityPanel({
  productSlug,
  productName,
  data,
}: {
  productSlug: string;
  productName: string;
  data: Record<string, AvailabilityEntry>;
}) {
  const { code, setCode } = useCountry();
  const info = data[code] || data.DE;
  if (!info) return null;

  const ctaLabel =
    info.status === "AVAILABLE"
      ? "View on Amazon"
      : info.status === "UNAVAILABLE"
        ? `Search alternatives on Amazon ${info.countryName}`
        : `Check price on Amazon ${info.countryName}`;

  const note =
    info.status === "UNAVAILABLE"
      ? "This product is not currently listed for this Amazon marketplace. The related products below may be available where you shop."
      : info.status === "AVAILABILITY_UNKNOWN"
        ? `We do not currently hold verified availability data for this marketplace. The link opens Amazon ${info.countryName} so you can check the latest price and stock yourself.`
        : "";

  return (
    <div className="rounded-xl2 border border-ink-line bg-sand-soft p-5">
      <p className="mb-2 text-sm font-semibold text-ink">Where are you shopping from?</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {COUNTRIES.map((c) => {
          const active = c.code === code;
          return (
            <button
              key={c.code}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setCode(c.code);
                track("country_selected", { country: c.code, product: productSlug });
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                active
                  ? "border-navy bg-navy text-white"
                  : "border-ink-line bg-white text-ink hover:border-cyan",
              )}
            >
              {c.flag} {c.name}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="rounded-xl border border-ink-line bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-medium text-ink">
          <AvailabilityBadge status={info.status} />
          {info.status === "AVAILABLE" ? (
            <>
              <span>
                on Amazon {info.flag} {info.countryName}
              </span>
              {info.priceLabel && (
                <span className="text-base font-bold text-ink">{info.priceLabel}</span>
              )}
            </>
          ) : (
            <span>
              {info.flag} {info.countryName}
            </span>
          )}
        </div>

        <AmazonLink
          href={info.url}
          productSlug={productSlug}
          country={code}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff9900] px-5 py-3 text-sm font-bold text-[#231a00] transition-[filter,transform] hover:brightness-105"
        >
          {ctaLabel}
        </AmazonLink>

        {note && <p className="mt-3 text-xs leading-relaxed text-ink-muted">{note}</p>}
        <p className="mt-3 text-center text-[11px] text-ink-muted">
          Affiliate link — we may earn a commission at no extra cost to you.
        </p>
        <span className="sr-only">Recommended product: {productName}</span>
      </div>
    </div>
  );
}
