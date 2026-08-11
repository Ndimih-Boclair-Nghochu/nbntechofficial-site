"use client";

import { useState } from "react";
import { Search, Loader2, Download } from "lucide-react";
import { listAmazonMarketplaces, DEFAULT_AMAZON_MARKETPLACE } from "@/lib/amazon/marketplaces";
import type { AmazonProduct } from "@/lib/amazon/types";

/**
 * Admin tool: search Amazon (Creators API) and import a result into the product
 * form. Uses the server route so credentials never touch the browser.
 */
export function AmazonImport({ onPick }: { onPick: (product: AmazonProduct, country: string) => void }) {
  const markets = listAmazonMarketplaces();
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState(DEFAULT_AMAZON_MARKETPLACE);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="mb-5 rounded-lg border border-cyan/30 bg-cyan/5 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold text-cyan-deep"
      >
        <span className="inline-flex items-center gap-2"><Download className="h-4 w-4" /> Import from Amazon</span>
        <span className="text-xs text-ink-muted">{open ? "Hide" : "Show"}</span>
      </button>

      {open && (
        <div className="mt-3">
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
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Amazon…"
                className="nbn-input !rounded-r-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-r-lg bg-navy px-4 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-60"
              >
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
                    <p className="text-xs text-ink-muted">
                      {p.priceDisplay || (p.price != null ? p.price : "—")} · {p.asin}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPick(p, country)}
                    className="shrink-0 rounded-md bg-cyan px-2.5 py-1.5 text-xs font-semibold text-navy-950 hover:bg-cyan-soft"
                  >
                    Use
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-[11px] text-ink-muted">
            “Use” fills the form below (name, image, price, ASIN and this marketplace’s Amazon link).
            Review, add a category, then save.
          </p>
        </div>
      )}
    </div>
  );
}
