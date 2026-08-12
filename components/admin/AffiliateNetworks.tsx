import type { ProviderStatus } from "@/lib/affiliate/types";

/**
 * Read-only affiliate network status board for the admin. Shows configured /
 * not-configured / disabled + capabilities + the names of any missing env vars.
 * Never renders secret values.
 */

function StateBadge({ s }: { s: ProviderStatus }) {
  const label = !s.enabled
    ? "Disabled"
    : s.configured
      ? s.connection === "connected"
        ? "Connected"
        : s.connection === "error"
          ? "Error"
          : "Credentials configured"
      : "Not configured";
  const cls = !s.enabled
    ? "bg-ink-line/40 text-ink-muted"
    : s.configured
      ? s.connection === "error"
        ? "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20"
        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
      : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{label}</span>;
}

const CAP_LABELS: Record<string, string> = {
  productSearch: "Search",
  productDetail: "Detail",
  productFeed: "Feed",
  deepLinks: "Deep links",
  priceData: "Price",
  availability: "Availability",
  variations: "Variations",
  requiresProgramApproval: "Needs program approval",
};

export function AffiliateNetworks({ statuses }: { statuses: ProviderStatus[] }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-body">
        Providers activate through configuration — set the credentials in your environment and flip the
        feature flag. Amazon is live once its credentials are set; the others are prepared and will report
        “Not configured” until you add credentials and are approved. Provider failures are isolated: the
        marketplace keeps working regardless.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {statuses.map((s) => (
          <div key={s.id} className="rounded-xl2 border border-ink-line bg-white p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-bold text-ink">{s.name}</h3>
              <StateBadge s={s} />
            </div>
            {s.note && <p className="mt-2 text-xs text-ink-muted">{s.note}</p>}

            <div className="mt-4 flex flex-wrap gap-1.5">
              {Object.entries(s.capabilities)
                .filter(([, v]) => v)
                .map(([k]) => (
                  <span
                    key={k}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      k === "requiresProgramApproval"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-cyan/10 text-cyan-deep"
                    }`}
                  >
                    {CAP_LABELS[k] || k}
                  </span>
                ))}
            </div>

            {s.missing.length > 0 && (
              <div className="mt-4 rounded-lg bg-sand-soft p-3">
                <p className="text-xs font-semibold text-ink">Missing environment variables</p>
                <ul className="mt-1 space-y-0.5">
                  {s.missing.map((m) => (
                    <li key={m} className="font-mono text-[11px] text-ink-muted">{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
