"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, MousePointerClick, Percent, Search, TrendingUp, TrendingDown, Loader2, RefreshCw } from "lucide-react";
import { COUNTRY_MAP } from "@/lib/marketplace";
import { PROVIDER_NAMES } from "@/lib/affiliate/config";
import { AreaLineChart, BarList, Sparkline, fmt } from "./charts";

type Summary = {
  days: number;
  available: boolean;
  empty: boolean;
  totals: { views: number; clicks: number; searches: number; categoryViews: number; ctr: number };
  deltas: { views: number; clicks: number; searches: number };
  series: { day: string; views: number; clicks: number }[];
  byProvider: { provider: string; clicks: number }[];
  byCountry: { country: string; clicks: number; views: number }[];
  topProducts: { slug: string; clicks: number; views: number }[];
};

const RANGES = [
  { d: 7, label: "7d" },
  { d: 30, label: "30d" },
  { d: 90, label: "90d" },
];

function Delta({ v }: { v: number }) {
  if (!v) return <span className="text-xs font-medium text-ink-muted">— 0%</span>;
  const up = v > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
      {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
      {up ? "+" : ""}{v}%
    </span>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  spark,
  sparkColor,
  suffix,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delta?: number;
  spark?: number[];
  sparkColor?: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl2 border border-ink-line bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan-deep">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        {delta !== undefined && <Delta v={delta} />}
      </div>
      <p className="mt-3 font-serif text-3xl font-semibold text-ink">
        {value}
        {suffix && <span className="ml-1 text-base font-normal text-ink-muted">{suffix}</span>}
      </p>
      <p className="text-sm text-ink-muted">{label}</p>
      {spark && spark.some((n) => n > 0) && (
        <div className="mt-2"><Sparkline values={spark} color={sparkColor} /></div>
      )}
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-ink-line bg-surface p-5 shadow-card">
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      {subtitle && <p className="mb-3 mt-0.5 text-xs text-ink-muted">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-3"}>{children}</div>
    </div>
  );
}

export function AnalyticsOverview() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (d: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/summary?days=${d}`);
      const json = await res.json();
      if (res.ok) setData(json.data as Summary);
    } catch {
      /* ignore — keep last */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  const provider = (id: string) => (PROVIDER_NAMES as Record<string, string>)[id] || id;
  const countryLabel = (code: string) => {
    const c = COUNTRY_MAP[code];
    return c ? `${c.flag} ${c.name}` : code;
  };
  const prettySlug = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  return (
    <section className="mt-2">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Marketplace performance</h2>
          <p className="text-sm text-ink-body">
            First-party stats — engagement and outbound affiliate clicks by product, country and network.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-ink-muted" />}
          <div className="inline-flex rounded-lg border border-ink-line bg-white p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.d}
                onClick={() => setDays(r.d)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  days === r.d ? "bg-navy text-white" : "text-ink-body hover:text-ink"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => load(days)}
            aria-label="Refresh"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-line bg-white text-ink-muted hover:text-cyan-deep"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {data && !data.available && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Analytics table not created yet.</p>
          <p className="mt-0.5">Run the <code className="rounded bg-amber-100 px-1">AnalyticsEvent</code> SQL (or <code className="rounded bg-amber-100 px-1">npm run db:push</code>). Charts populate as visitors browse the marketplace.</p>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Eye} label="Product views" value={fmt(data?.totals.views ?? 0)} delta={data?.deltas.views} spark={data?.series.map((s) => s.views)} sparkColor="#2FB49A" />
        <KpiCard icon={MousePointerClick} label="Affiliate clicks" value={fmt(data?.totals.clicks ?? 0)} delta={data?.deltas.clicks} spark={data?.series.map((s) => s.clicks)} sparkColor="#04045E" />
        <KpiCard icon={Percent} label="Click-through rate" value={String(data?.totals.ctr ?? 0)} suffix="%" />
        <KpiCard icon={Search} label="Searches" value={fmt(data?.totals.searches ?? 0)} delta={data?.deltas.searches} />
      </div>

      {/* Trend chart */}
      <div className="mt-4">
        <Panel title="Views vs. affiliate clicks" subtitle={`Daily, last ${data?.days ?? days} days`}>
          <div className="mb-2 flex items-center gap-4 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-4 rounded-full" style={{ background: "#2FB49A" }} /> Views</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-4 rounded-full" style={{ background: "#04045E" }} /> Clicks</span>
          </div>
          <AreaLineChart series={data?.series ?? []} />
        </Panel>
      </div>

      {/* Breakdown grid */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Clicks by network" subtitle="Outbound affiliate clicks">
          <BarList
            color="#04045E"
            empty="No clicks yet"
            items={(data?.byProvider ?? []).map((p) => ({ label: provider(p.provider), value: p.clicks }))}
          />
        </Panel>
        <Panel title="Top countries" subtitle="By affiliate clicks">
          <BarList
            empty="No country data yet"
            items={(data?.byCountry ?? []).map((c) => ({
              label: countryLabel(c.country),
              value: c.clicks,
              sub: `${fmt(c.views)} views`,
            }))}
          />
        </Panel>
        <Panel title="Top products" subtitle="By affiliate clicks">
          <BarList
            color="#4F46E5"
            empty="No product clicks yet"
            items={(data?.topProducts ?? []).map((p) => ({
              label: prettySlug(p.slug),
              value: p.clicks,
              sub: `${fmt(p.views)} views`,
            }))}
          />
        </Panel>
      </div>

      <p className="mt-3 text-xs text-ink-muted">
        Commissions and confirmed sales appear in each affiliate network&apos;s own reporting once connected — these
        first-party figures are the leading indicators we can measure directly.
      </p>
    </section>
  );
}
