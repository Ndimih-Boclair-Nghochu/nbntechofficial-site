"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Scale, Check, Minus } from "lucide-react";
import { AmazonLink } from "@/components/marketplace/AmazonLink";
import { coursePath, courseCtaLabel } from "@/lib/courses";
import { useCompare } from "./CompareProvider";
import type { CompareCourse } from "./compare-types";

/**
 * Floating compare tray + comparison table. Appears once one or more courses are
 * selected. Opening it shows a side-by-side feature matrix (price, rating,
 * duration, level, lectures, certificate) with a tracked CTA per course.
 */
export function CompareTray() {
  const { items, remove, clear } = useCompare();
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      {/* Bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-line bg-surface/95 shadow-[0_-4px_20px_rgba(3,10,59,0.12)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Scale className="h-4 w-4 text-cyan-deep" />
            Compare <span className="text-ink-muted">({items.length})</span>
          </span>
          <div className="hide-scrollbar flex flex-1 items-center gap-2 overflow-x-auto">
            {items.map((c) => (
              <span
                key={c.slug}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-line bg-white py-1 pl-2.5 pr-1 text-xs text-ink"
              >
                <span className="max-w-[120px] truncate">{c.title}</span>
                <button
                  onClick={() => remove(c.slug)}
                  aria-label={`Remove ${c.title}`}
                  className="rounded-full p-0.5 text-ink-muted hover:bg-sand-soft hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
          >
            Compare
          </button>
          <button
            onClick={clear}
            className="shrink-0 rounded-lg px-2 py-2 text-sm font-medium text-ink-muted hover:text-ink"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Comparison modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Course comparison"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-t-2xl bg-surface p-4 shadow-card-hover sm:rounded-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Compare courses</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-ink-muted hover:bg-sand-soft hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-28 py-2 pr-3 text-left align-bottom text-xs font-medium uppercase tracking-wide text-ink-muted">
                      Feature
                    </th>
                    {items.map((c) => (
                      <th key={c.slug} className="min-w-[150px] p-2 text-left align-top">
                        <Link href={coursePath(c.slug)} className="block font-semibold text-ink hover:text-cyan-deep">
                          {c.title}
                        </Link>
                        <span className="text-xs font-normal text-cyan-deep">{c.provider}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <Row label="Price">
                    {items.map((c) => (
                      <Cell key={c.slug}>
                        <span className="font-bold text-ink">{c.priceLabel || "—"}</span>
                        {c.originalLabel && (
                          <span className="ml-1 text-xs text-ink-muted line-through">{c.originalLabel}</span>
                        )}
                      </Cell>
                    ))}
                  </Row>
                  <Row label="Rating">
                    {items.map((c) => (
                      <Cell key={c.slug}>
                        {c.rating != null ? (
                          <>
                            <span className="text-amber-500">★</span> {c.rating.toFixed(1)}
                            {c.reviewCount != null && (
                              <span className="text-xs text-ink-muted"> ({c.reviewCount.toLocaleString("en-GB")})</span>
                            )}
                          </>
                        ) : (
                          "—"
                        )}
                      </Cell>
                    ))}
                  </Row>
                  <Row label="Level">
                    {items.map((c) => (
                      <Cell key={c.slug}>{c.level || "—"}</Cell>
                    ))}
                  </Row>
                  <Row label="Duration">
                    {items.map((c) => (
                      <Cell key={c.slug}>{c.duration || "—"}</Cell>
                    ))}
                  </Row>
                  <Row label="Lectures">
                    {items.map((c) => (
                      <Cell key={c.slug}>{c.lectureCount != null ? c.lectureCount : "—"}</Cell>
                    ))}
                  </Row>
                  <Row label="Certificate">
                    {items.map((c) => (
                      <Cell key={c.slug}>
                        {c.certificate ? (
                          <Check className="h-4 w-4 text-emerald-600" aria-label="Yes" />
                        ) : (
                          <Minus className="h-4 w-4 text-ink-muted" aria-label="No" />
                        )}
                      </Cell>
                    ))}
                  </Row>
                  <Row label="Category">
                    {items.map((c) => (
                      <Cell key={c.slug}>{c.categoryLabel || "—"}</Cell>
                    ))}
                  </Row>
                  <tr>
                    <td className="py-3 pr-3" />
                    {items.map((c) => (
                      <td key={c.slug} className="p-2 align-top">
                        {c.url ? (
                          <AmazonLink
                            href={c.url}
                            productSlug={c.slug}
                            platform={c.provider}
                            className="flex w-full items-center justify-center rounded-lg bg-[#ff9900] px-3 py-2 text-xs font-bold text-[#231a00] hover:brightness-105"
                          >
                            {courseCtaLabel(c, "card")}
                          </AmazonLink>
                        ) : (
                          <span className="flex w-full items-center justify-center rounded-lg bg-ink-line/60 px-3 py-2 text-xs font-bold text-ink-muted">
                            Coming soon
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-ink-line">
      <th scope="row" className="py-2.5 pr-3 text-left align-top text-xs font-medium text-ink-muted">
        {label}
      </th>
      {children}
    </tr>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="py-2.5 pl-2 align-top text-ink">{children}</td>;
}
