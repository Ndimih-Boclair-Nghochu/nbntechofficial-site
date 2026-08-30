import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { runUdemySync, getUdemyConfigStatus } from "@/lib/udemy/sync";
import { ImpactConfigError } from "@/lib/udemy/impact-client";

export const runtime = "nodejs";
// Give a live catalogue sync room to paginate.
export const maxDuration = 300;

/** Constant-time bearer check against CRON_SECRET (used by Vercel Cron). */
function cronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function handle(req: NextRequest, allowAdmin: boolean) {
  // Authorize: cron secret OR (for manual triggers) an admin session.
  if (!cronAuthorized(req)) {
    if (!allowAdmin) return jsonError("Unauthorized.", 401);
    const { deny } = await requireAdminApi();
    if (deny) return deny;
  }

  const status = getUdemyConfigStatus();
  if (!status.impactCredentials || !status.catalogId) {
    return jsonError(
      "Udemy sync is not configured. Set IMPACT_ACCOUNT_SID, IMPACT_AUTH_TOKEN and IMPACT_UDEMY_CATALOG_ID.",
      400,
      { configured: status },
    );
  }

  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
  try {
    const summary = await runUdemySync({ dryRun });
    return jsonOk(summary);
  } catch (err) {
    if (err instanceof ImpactConfigError) return jsonError(err.message, 400);
    return jsonError("Udemy sync failed.", 500, { message: String(err) });
  }
}

/** Vercel Cron hits this (GET) with Authorization: Bearer <CRON_SECRET>. */
export async function GET(req: NextRequest) {
  return handle(req, false);
}

/** Manual trigger from the admin panel (admin session) or cron secret. */
export async function POST(req: NextRequest) {
  return handle(req, true);
}
