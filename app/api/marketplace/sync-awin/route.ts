import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { isProviderEnabled } from "@/lib/affiliate/config";
import { runAwinSync, getAwinConfigStatus, AwinConfigError } from "@/lib/awin/sync";

export const runtime = "nodejs";
export const maxDuration = 300;

function cronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const a = Buffer.from(req.headers.get("authorization") || "");
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function handle(req: NextRequest, allowAdmin: boolean) {
  if (!cronAuthorized(req)) {
    if (!allowAdmin) return jsonError("Unauthorized.", 401);
    const { deny } = await requireAdminApi();
    if (deny) return deny;
  }

  if (!isProviderEnabled("awin")) {
    return jsonError("Awin is disabled. Set AWIN_ENABLED=true to activate the feed sync.", 400);
  }
  const status = getAwinConfigStatus();
  if (!status.feedUrl) {
    return jsonError("Awin sync is not configured. Set AWIN_FEED_URL (Create-a-Feed download URL).", 400, {
      configured: status,
    });
  }

  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
  try {
    return jsonOk(await runAwinSync({ dryRun }));
  } catch (err) {
    if (err instanceof AwinConfigError) return jsonError(err.message, 400);
    return jsonError("Awin sync failed.", 500, { message: String(err) });
  }
}

/** Vercel Cron (GET) with Authorization: Bearer <CRON_SECRET>. */
export async function GET(req: NextRequest) {
  return handle(req, false);
}

/** Manual admin trigger (session) or cron secret. */
export async function POST(req: NextRequest) {
  return handle(req, true);
}
