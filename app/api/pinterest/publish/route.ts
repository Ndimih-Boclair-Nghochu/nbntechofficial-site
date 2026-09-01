import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { pinterestEnabled, pinterestConfigStatus } from "@/lib/pinterest/config";
import { runPinPublish, getPinReport } from "@/lib/pinterest/publish";
import { PinterestConfigError } from "@/lib/pinterest/api";

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
  if (!pinterestEnabled()) {
    return jsonError("Pinterest is disabled. Set PINTEREST_ENABLED=true to activate.", 400, { configured: pinterestConfigStatus() });
  }
  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
  const limitParam = Number(req.nextUrl.searchParams.get("limit"));
  try {
    return jsonOk(await runPinPublish({ dryRun, limit: Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined }));
  } catch (err) {
    if (err instanceof PinterestConfigError) return jsonError(err.message, 400, { configured: pinterestConfigStatus() });
    return jsonError("Pinterest publish failed.", 500, { message: String(err) });
  }
}

/** Vercel Cron (GET) with Authorization: Bearer <CRON_SECRET>. */
export async function GET(req: NextRequest) {
  // Cron with no query = publish; admins can pass ?report=1 for a status read.
  if (req.nextUrl.searchParams.get("report") === "1") {
    const { deny } = await requireAdminApi();
    if (deny) return deny;
    return jsonOk(await getPinReport());
  }
  return handle(req, false);
}

/** Manual admin trigger (session) or cron secret. */
export async function POST(req: NextRequest) {
  return handle(req, true);
}
