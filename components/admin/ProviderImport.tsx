"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2, Download } from "lucide-react";
import { listAmazonMarketplaces, DEFAULT_AMAZON_MARKETPLACE } from "@/lib/amazon/marketplaces";
import type { AmazonProduct } from "@/lib/amazon/types";

/**
 * Multi-network product import for the admin. Amazon searches live (Creators
 * API) and imports into the product form. Awin / impact.com / CJ show their real
 * connection status — they activate here once you connect the account. Nothing
 * is faked: a network you have not connected simply reports "not configured".
 */

type Net = "amazon" | "awin" | "impact" | "cj";

const NETWORKS: { id: Net; name: string; mode: string; searchable: boolean }[] = [
  { id: "amazon", name: "Amazon", mode: "Live product search", searchable: true },
  { id: "cj", name: "CJ Affiliate", mode: "Product search (once connected)", searchable: true },
  { id: "awin", name: "Awin", mode: "Feed sync (once connected)", searchable: false },
  { id: "impact", name: "impact.com", mode: "Catalog sync (once connected)", searchable: false },
];

type Status = { id: string; configured: boolean; enabled: boolean };

export function ProviderImport({ onPick }: { onPick: (product: AmazonProduct, country: string) => void }) {
  const [open, setOpen] = useState(false);
  const [net, setNet] = useState<Net>("amazon");
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  // Amazon search state
  const markets = listAmazonMarketplaces();
  const [country, setCountry] = useState(DEFAULT_AMAZON_MARKETPLACE);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/affiliate/status")
      .then((r) => r.json())
      .then((j) => {
        const map: Record<string, Status> = {};
        for (const p of j?.data?.providers || []) map[p.id] = { id: p.id, configured: p.configured, enabled: p.enabled };
        setStatuses(map);
      })
      .catch(() => {});
  }, [open]);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    const keyword = q.trim();
    if (!keyword) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/amazon/search?q=${encodeURIComponent(keyword)}&country=${country}`);
      const json = await res.json();
      if (!res.ok) {
        setItems([]);
        setError(json.error || "Search failed.");
      } else {
        setItems(json.data.items as AmazonProduct[]);
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  const st = statuses[net];
  const meta = NETWORKS.find((n) => n.id === net)!;

  return (
    <div className="mb-5 rounded-lg border border-cyan/30 bg-cyan/5 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold text-cyan-deep"
      >
        <span className="inline-flex items-center gap-2"><Download className="h-4 w-4" /> Import from a network</span>
        <span className="text-xs text-ink-muted">{open ? "Hide" : "Show"}</span>
      </button>

      {open && (
        <div className="mt-3">
          {/* Network selector */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {NETWORKS.map((n) => {
              const active = net === n.id;
              const connected = statuses[n.id]?.configured;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setNet(n.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active ? "border-navy bg-navy text-white" : "border-ink-line bg-white text-ink-body hover:border-cyan"
                  }`}
                >
                  {n.name}
                  <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-ink-line"}`} />
                </button>
              );
            })}
          </div>

          {net === "amazon" ? (
            <>
              <form onSubmit={runSearch} className="flex flex-col gap-2 sm:flex-row">
                <select
                  aria-label="Amazon marketplace"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="nbn-input !py-2 sm:max-w-[160px]"
                >
                  {markets.map((m) => <option key={m.code} value={m.code}>{m.name}</option>)}
                </select>
                <div className="flex flex-1">
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Amazon…" className="nbn-input !rounded-r-none" />
                  <button type="submit" disabled={loading} className="inline-flex items-center gap-1.5 rounded-r-lg bg-navy px-4 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-60">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </button>
                </div>
              </form>
              {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
              {items.length > 0 && (
                <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {items.map((p) => (
                    <li key={p.asin} className="flex items-center gap-3 rounded-lg border border-ink-line bg-white p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image || "/logo-mark.png"} alt="" className="h-12 w-12 shrink-0 rounded object-contain" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-ink">{p.title}</p>
                        <p className="text-xs text-ink-muted">{p.priceDisplay || (p.price != null ? p.price : "—")} · {p.asin}</p>
                      </div>
                      <button type="button" onClick={() => onPick(p, country)} className="shrink-0 rounded-md bg-cyan px-2.5 py-1.5 text-xs font-semibold text-navy-950 hover:bg-cyan-soft">
                        Use
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-[11px] text-ink-muted">
                “Use” fills the form below (name, image, price, ASIN and this marketplace’s Amazon link).
              </p>
            </>
          ) : (
            /* Non-Amazon networks: honest status, no fake search */
            <div className="rounded-lg border border-ink-line bg-white p-4 text-sm">
              <p className="font-medium text-ink">{meta.name} — {meta.mode}</p>
              {st?.configured ? (
                <p className="mt-1 text-ink-body">
                  Connected. {meta.searchable ? "Product search" : "Product sync"} for {meta.name} activates here once
                  the sync is enabled. Until then, you can add {meta.name} products manually below.
                </p>
              ) : (
                <p className="mt-1 text-ink-body">
                  Not connected yet. Add your {meta.name} credentials and enable it on the{" "}
                  <Link href="/admin/affiliate" className="font-medium text-cyan-deep hover:underline">Affiliate networks</Link>{" "}
                  page, then import here. Approval from {meta.name} is required first.
                </p>
              )}
              <p className="mt-2 rounded-md bg-sand-soft px-3 py-2 text-xs text-ink-muted">
                In the meantime you can promote a <strong>{meta.name}</strong> (or any) product right now: fill the form
                below and, under <strong>Availability by country</strong>, set the platform name, product link and price.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
