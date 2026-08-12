import { NextRequest } from "next/server";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { getAnalyticsSummary } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin-only aggregated analytics for the dashboard. */
export async function GET(req: NextRequest) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const days = Number(new URL(req.url).searchParams.get("days") || "30") || 30;
    return jsonOk(await getAnalyticsSummary(days));
  } catch {
    return jsonError("Could not load analytics", 500);
  }
}
