import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { getWebhookSecret, isBotConfigured } from "@/lib/telegram/config";
import { setWebhook, getWebhookInfo, getMe } from "@/lib/telegram/api";
import { siteUrl } from "@/lib/utils";

export const runtime = "nodejs";

function cronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const a = Buffer.from(req.headers.get("authorization") || "");
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function authorize(req: NextRequest) {
  if (cronAuthorized(req)) return null;
  const { deny } = await requireAdminApi();
  return deny ?? null;
}

/** Register the webhook with Telegram (admin only). */
export async function POST(req: NextRequest) {
  const deny = await authorize(req);
  if (deny) return deny;

  if (!isBotConfigured()) return jsonError("TELEGRAM_BOT_TOKEN is not set.", 400);
  const secret = getWebhookSecret();
  if (!secret) return jsonError("Set TELEGRAM_WEBHOOK_SECRET first (any long random string).", 400);

  const url = `${siteUrl()}/api/telegram/webhook`;
  const res = await setWebhook(url, secret);
  if (!res.ok) return jsonError(`Telegram setWebhook failed: ${res.description || "unknown"}`, 502);
  return jsonOk({ webhook: url, telegram: res });
}

/** Inspect the current webhook + bot identity (admin only). */
export async function GET(req: NextRequest) {
  const deny = await authorize(req);
  if (deny) return deny;
  if (!isBotConfigured()) return jsonError("TELEGRAM_BOT_TOKEN is not set.", 400);
  const [me, info] = await Promise.all([getMe(), getWebhookInfo()]);
  return jsonOk({ me, webhook: info });
}
