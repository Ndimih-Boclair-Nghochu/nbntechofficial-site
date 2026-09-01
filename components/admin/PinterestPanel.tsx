"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, Play, FlaskConical } from "lucide-react";
import { Card, useToast } from "@/components/admin/AdminUI";

type Report = {
  configured: { enabled: boolean; app: boolean; refreshToken: boolean; dailyLimit: number };
  totalPinned: number;
  totalSuccess: number;
  publishedThisWeek: number;
  recentFailures: { itemSlug: string; error: string | null }[];
};

function Dot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-ink-line"}`} />
      <span className={ok ? "text-ink" : "text-ink-muted"}>{label}</span>
    </span>
  );
}

/**
 * Admin panel to run the Pinterest auto-pin pipeline and see its status —
 * without touching the terminal. Reads/writes only the admin-guarded API.
 */
export function PinterestPanel() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"" | "dry" | "run">("");
  const { show, toastNode } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pinterest/publish?report=1");
      const json = await res.json();
      if (res.ok) setReport(json.data as Report);
    } catch {
      /* ignore — panel just shows unknown state */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function publish(dryRun: boolean) {
    setBusy(dryRun ? "dry" : "run");
    try {
      const res = await fetch(`/api/pinterest/publish${dryRun ? "?dryRun=1" : ""}`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        show(json.error || "Pinterest run failed.", "error");
        return;
      }
      const d = json.data as { published: number; failed: number; skipped: number; dryRun: boolean };
      show(
        d.dryRun
          ? `Dry run: ${d.skipped} pin${d.skipped === 1 ? "" : "s"} would be published.`
          : `Published ${d.published} pin${d.published === 1 ? "" : "s"}${d.failed ? ` · ${d.failed} failed` : ""}.`,
      );
      load();
    } catch {
      show("Network error.", "error");
    } finally {
      setBusy("");
    }
  }

  const cfg = report?.configured;
  const ready = !!cfg?.enabled && !!cfg?.app && !!cfg?.refreshToken;

  return (
    <Card>
      {toastNode}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">📌 Pinterest auto-pin</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Publishes your products as branded pins on a daily schedule. Trigger a run manually here.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink-line px-3 py-1.5 text-xs font-medium text-ink-body hover:bg-canvas disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Refresh
        </button>
      </div>

      {/* Config status */}
      <div className="mt-4 flex flex-wrap gap-4 rounded-lg bg-sand-soft p-3">
        <Dot ok={!!cfg?.app} label="App keys set" />
        <Dot ok={!!cfg?.refreshToken} label="Connected (refresh token)" />
        <Dot ok={!!cfg?.enabled} label="Enabled" />
        <span className="text-xs text-ink-muted">Daily limit: {cfg?.dailyLimit ?? "—"}</span>
      </div>

      {!ready && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
          Not fully connected yet. Set <code>PINTEREST_APP_ID</code>/<code>PINTEREST_APP_SECRET</code>, connect via
          <code> /api/pinterest/oauth?start=1</code>, set <code>PINTEREST_REFRESH_TOKEN</code> and{" "}
          <code>PINTEREST_ENABLED=true</code>, then redeploy.
        </p>
      )}

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Pinned (total)", value: report?.totalSuccess ?? 0 },
          { label: "This week", value: report?.publishedThisWeek ?? 0 },
          { label: "Records", value: report?.totalPinned ?? 0 },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-ink-line bg-white p-3 text-center">
            <div className="text-2xl font-bold text-ink">{s.value}</div>
            <div className="text-xs text-ink-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => publish(true)}
          disabled={!!busy}
          className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-canvas disabled:opacity-60"
        >
          {busy === "dry" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
          Dry run
        </button>
        <button
          type="button"
          onClick={() => publish(false)}
          disabled={!!busy || !ready}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
          title={ready ? "" : "Connect Pinterest first"}
        >
          {busy === "run" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Publish now
        </button>
      </div>

      {report?.recentFailures && report.recentFailures.length > 0 && (
        <div className="mt-4 rounded-lg bg-rose-50 p-3">
          <p className="text-xs font-semibold text-rose-700">Recent failures</p>
          <ul className="mt-1 space-y-0.5">
            {report.recentFailures.map((f, i) => (
              <li key={i} className="truncate font-mono text-[11px] text-rose-700/80">
                {f.itemSlug}: {f.error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
