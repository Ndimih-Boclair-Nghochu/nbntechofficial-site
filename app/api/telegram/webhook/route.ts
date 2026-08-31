import { NextRequest, NextResponse } from "next/server";
import { getWebhookSecret } from "@/lib/telegram/config";
import { handleUpdate, type TgUpdate } from "@/lib/telegram/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// A /start reply sends several cards; give it headroom (capped by the Vercel plan).
export const maxDuration = 60;

/**
 * Telegram webhook. Telegram POSTs one update here per event. We verify the
 * secret header Telegram sends (set when the webhook was registered), process
 * the update, and always return 200 quickly so Telegram doesn't retry-storm.
 */
export async function POST(req: NextRequest) {
  const secret = getWebhookSecret();
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: TgUpdate;
  try {
    update = (await req.json()) as TgUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  await handleUpdate(update);
  return NextResponse.json({ ok: true });
}
