"use client";

import { useState } from "react";
import { Search, Loader2, Star } from "lucide-react";
import { listAmazonMarketplaces, DEFAULT_AMAZON_MARKETPLACE } from "@/lib/amazon/marketplaces";
import type { AmazonProduct } from "@/lib/amazon/types";
import { useCountry } from "./CountryProvider";
import { AmazonLink } from "./AmazonLink";

/** Public Amazon product search — live results via the server API route. */
export function AmazonSearch() {
  const { code } = useCountry();
  const markets = listAmazonMarketplaces();
  const initial = markets.some((m) => m.code === code) ? code : DEFAULT_AMAZON_MARKETPLACE;

  const [country, setCountry] = useState(initial);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

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
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  return (
    <div>
      <form onSubmit={runSearch} className="flex flex-col gap-2 sm:flex-row">
        <select
          aria-label="Amazon marketplace"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="mkt-country-select rounded-lg border border-ink-line bg-white px-3 py-2.5 text-sm text-ink focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/30"
        >
          {markets.map((m) => (
            <option key={m.code} value={m.code}>{m.name}</option>
          ))}
        </select>
        <div className="flex flex-1">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Amazon products…"
            aria-label="Search Amazon products"
            className="w-full rounded-l-lg border border-r-0 border-ink-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-r-lg bg-[#ff9900] px-5 text-sm font-bold text-[#231a00] hover:brightness-105 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      {searched && !error && !loading && items.length === 0 && (
        <p className="mt-6 text-sm text-ink-muted">No products found. Try a different search term.</p>
      )}

      {items.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => (
            <article key={p.asin} className="flex flex-col rounded-lg border border-ink-line bg-surface p-3">
              <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-md bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image || "/logo-mark.png"} alt={p.title} loading="lazy" className="h-full w-full object-contain p-1" />
              </div>
              <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-ink">{p.title}</h3>
              {p.rating != null && (
                <span className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-current" /> {p.rating.toFixed(1)}
                  {p.reviewCount != null && <span className="text-ink-muted">({p.reviewCount})</span>}
                </span>
              )}
              {(p.priceDisplay || p.price != null) && (
                <span className="mt-1.5 text-lg font-bold text-ink">
                  {p.priceDisplay || p.price}
                </span>
              )}
              {p.availability && <span className="mt-0.5 text-xs text-emerald-600">{p.availability}</span>}
              {p.detailPageUrl && (
                <AmazonLink
                  href={p.detailPageUrl}
                  productSlug={p.asin}
                  country={country}
                  platform="Amazon"
                  className="mt-3 flex w-full items-center justify-center rounded-lg bg-[#ff9900] px-3 py-2 text-sm font-bold text-[#231a00] hover:brightness-105"
                >
                  View on Amazon
                </AmazonLink>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
