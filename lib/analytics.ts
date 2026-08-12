import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Analytics aggregation for the admin dashboard. All figures are first-party,
 * privacy-light (no PII). Resilient: if the AnalyticsEvent table doesn't exist
 * yet (SQL not run), returns an empty summary rather than throwing.
 *
 * What we can measure ourselves: on-site engagement (views, searches) and
 * outbound affiliate *clicks* by provider/country/product — the leading
 * indicators of performance. Actual commissions/sales live in each affiliate
 * network's own reporting once connected.
 */

export type AnalyticsSummary = {
  days: number;
  available: boolean; // false when the table doesn't exist yet
  empty: boolean; // true when there is simply no data yet
  totals: { views: number; clicks: number; searches: number; categoryViews: number; ctr: number };
  deltas: { views: number; clicks: number; searches: number }; // % vs previous window
  series: { day: string; views: number; clicks: number }[];
  byProvider: { provider: string; clicks: number }[];
  byCountry: { country: string; clicks: number; views: number }[];
  topProducts: { slug: string; clicks: number; views: number }[];
  generatedAt: string;
};

function pctDelta(cur: number, prev: number): number {
  if (prev === 0) return cur > 0 ? 100 : 0;
  return Math.round(((cur - prev) / prev) * 1000) / 10;
}

function fillSeries(rows: { day: string; views: number; clicks: number }[], days: number) {
  const map = new Map(rows.map((r) => [r.day, r]));
  const out: { day: string; views: number; clicks: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const hit = map.get(key);
    out.push({ day: key, views: hit?.views ?? 0, clicks: hit?.clicks ?? 0 });
  }
  return out;
}

function emptySummary(days: number, available: boolean): AnalyticsSummary {
  return {
    days,
    available,
    empty: true,
    totals: { views: 0, clicks: 0, searches: 0, categoryViews: 0, ctr: 0 },
    deltas: { views: 0, clicks: 0, searches: 0 },
    series: fillSeries([], days),
    byProvider: [],
    byCountry: [],
    topProducts: [],
    generatedAt: new Date().toISOString(),
  };
}

export async function getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const d = Math.min(Math.max(days, 1), 365);
  const from = new Date(Date.now() - d * 86_400_000);
  const prevFrom = new Date(Date.now() - 2 * d * 86_400_000);

  try {
    const [totalsRows, prevRows, seriesRows, providerRows, countryRows, productRows] = await Promise.all([
      prisma.$queryRaw<{ views: number; clicks: number; searches: number; categoryviews: number }[]>(Prisma.sql`
        SELECT
          count(*) FILTER (WHERE type='product_view')::int AS views,
          count(*) FILTER (WHERE type='buy_click')::int AS clicks,
          count(*) FILTER (WHERE type='marketplace_search')::int AS searches,
          count(*) FILTER (WHERE type='category_view')::int AS categoryviews
        FROM "AnalyticsEvent" WHERE "createdAt" >= ${from}`),
      prisma.$queryRaw<{ views: number; clicks: number; searches: number }[]>(Prisma.sql`
        SELECT
          count(*) FILTER (WHERE type='product_view')::int AS views,
          count(*) FILTER (WHERE type='buy_click')::int AS clicks,
          count(*) FILTER (WHERE type='marketplace_search')::int AS searches
        FROM "AnalyticsEvent" WHERE "createdAt" >= ${prevFrom} AND "createdAt" < ${from}`),
      prisma.$queryRaw<{ day: string; views: number; clicks: number }[]>(Prisma.sql`
        SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day,
          count(*) FILTER (WHERE type='product_view')::int AS views,
          count(*) FILTER (WHERE type='buy_click')::int AS clicks
        FROM "AnalyticsEvent" WHERE "createdAt" >= ${from} GROUP BY 1 ORDER BY 1`),
      prisma.$queryRaw<{ provider: string; clicks: number }[]>(Prisma.sql`
        SELECT provider, count(*)::int AS clicks FROM "AnalyticsEvent"
        WHERE "createdAt" >= ${from} AND type='buy_click' AND provider IS NOT NULL
        GROUP BY provider ORDER BY clicks DESC`),
      prisma.$queryRaw<{ country: string; clicks: number; views: number }[]>(Prisma.sql`
        SELECT country,
          count(*) FILTER (WHERE type='buy_click')::int AS clicks,
          count(*) FILTER (WHERE type IN ('product_view','category_view'))::int AS views
        FROM "AnalyticsEvent" WHERE "createdAt" >= ${from} AND country IS NOT NULL
        GROUP BY country ORDER BY clicks DESC, views DESC LIMIT 8`),
      prisma.$queryRaw<{ slug: string; clicks: number; views: number }[]>(Prisma.sql`
        SELECT "productSlug" AS slug,
          count(*) FILTER (WHERE type='buy_click')::int AS clicks,
          count(*) FILTER (WHERE type='product_view')::int AS views
        FROM "AnalyticsEvent" WHERE "createdAt" >= ${from} AND "productSlug" IS NOT NULL
        GROUP BY "productSlug" ORDER BY clicks DESC, views DESC LIMIT 8`),
    ]);

    const t = totalsRows[0] || { views: 0, clicks: 0, searches: 0, categoryviews: 0 };
    const p = prevRows[0] || { views: 0, clicks: 0, searches: 0 };
    const views = t.views || 0;
    const clicks = t.clicks || 0;

    return {
      days: d,
      available: true,
      empty: views + clicks + (t.searches || 0) + (t.categoryviews || 0) === 0,
      totals: {
        views,
        clicks,
        searches: t.searches || 0,
        categoryViews: t.categoryviews || 0,
        ctr: views > 0 ? Math.round((clicks / views) * 1000) / 10 : 0,
      },
      deltas: {
        views: pctDelta(views, p.views || 0),
        clicks: pctDelta(clicks, p.clicks || 0),
        searches: pctDelta(t.searches || 0, p.searches || 0),
      },
      series: fillSeries(seriesRows, d),
      byProvider: providerRows,
      byCountry: countryRows,
      topProducts: productRows,
      generatedAt: new Date().toISOString(),
    };
  } catch {
    // Table missing / DB unreachable — dashboard renders an empty state.
    return emptySummary(d, false);
  }
}
