"use client";

import { AVAILABILITY_LABEL, type AvailabilityStatus } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useCountry } from "./CountryProvider";
import { AmazonLink } from "./AmazonLink";

/** Serializable availability entry (built server-side per country). */
export type AvailabilityEntry = {
  status: AvailabilityStatus;
  platform: string;
  url: string;
  hasLink: boolean;
  hasDirectUrl: boolean;
  priceLabel: string;
  countryName: string;
  flag: string;
  cta: string;
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
 * "Availability in your country" buy box. Reflects the country chosen in the
 * header ("Deliver to"). All countries are also rendered in the availability
 * table below, so everything stays crawlable.
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
  const { code } = useCountry();
  const info = data[code] || data.DE || Object.values(data)[0];
  if (!info) return null;

  const note =
    info.status === "UNAVAILABLE"
      ? "Not currently listed for this market. The related products below may be available where you shop."
      : info.status === "AVAILABILITY_UNKNOWN"
        ? info.hasLink
          ? `We don't hold verified stock data for this market yet — the button opens ${info.platform} so you can check the latest price.`
          : "We don't have a verified listing for this country yet. Try changing your country, or check the related products below."
        : "";

  return (
    <div className="rounded-xl2 border border-ink-line bg-sand-soft p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Availability in {info.flag} {info.countryName}
      </p>

      <div aria-live="polite" className="mt-2 rounded-xl border border-ink-line bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-medium text-ink">
          <AvailabilityBadge status={info.status} />
          {info.platform && <span className="text-ink-muted">on {info.platform}</span>}
          {info.priceLabel && <span className="text-base font-bold text-ink">{info.priceLabel}</span>}
        </div>

        {info.hasLink ? (
          <AmazonLink
            href={info.url}
            productSlug={productSlug}
            country={code}
            platform={info.platform}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff9900] px-5 py-3 text-sm font-bold text-[#231a00] transition-[filter] hover:brightness-105"
          >
            {info.cta || "Buy now"}
          </AmazonLink>
        ) : (
          <p className="rounded-lg bg-sand px-4 py-3 text-center text-sm font-medium text-ink-muted">
            No verified link for this country yet
          </p>
        )}

        {note && <p className="mt-3 text-xs leading-relaxed text-ink-muted">{note}</p>}
        <p className="mt-3 text-center text-[11px] text-ink-muted">
          Affiliate link — we may earn a commission at no extra cost to you.
        </p>
        <span className="sr-only">Recommended product: {productName}</span>
      </div>
    </div>
  );
}
