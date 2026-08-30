import "server-only";

import { getBotToken } from "./config";
import type { InlineKeyboard } from "./format";

/**
 * Minimal Telegram Bot API client (server-only, no dependency). Direct HTTPS
 * calls with a timeout; failures are swallowed to a {ok:false} so a single bad
 * send never crashes the webhook (Telegram would otherwise retry-storm).
 */

const API = "https://api.telegram.org";
const TIMEOUT_MS = 10_000;

type TgResult = { ok: boolean; result?: unknown; description?: string };

async function call(method: string, payload: Record<string, unknown>): Promise<TgResult> {
  const token = getBotToken();
  if (!token) return { ok: false, description: "TELEGRAM_BOT_TOKEN not set" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API}/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
    return (await res.json()) as TgResult;
  } catch (err) {
    return { ok: false, description: String(err) };
  } finally {
    clearTimeout(timer);
  }
}

export function sendMessage(
  chatId: string | number,
  text: string,
  extra: { reply_markup?: InlineKeyboard; disable_web_page_preview?: boolean } = {},
) {
  return call("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: extra.disable_web_page_preview ?? true,
    ...(extra.reply_markup ? { reply_markup: extra.reply_markup } : {}),
  });
}

/** Send a photo with caption; falls back to a text message if the image fails. */
export async function sendPhoto(
  chatId: string | number,
  photoUrl: string | null,
  caption: string,
  reply_markup?: InlineKeyboard,
) {
  if (photoUrl) {
    const r = await call("sendPhoto", {
      chat_id: chatId,
      photo: photoUrl,
      caption,
      parse_mode: "HTML",
      ...(reply_markup ? { reply_markup } : {}),
    });
    if (r.ok) return r;
  }
  return sendMessage(chatId, caption, { reply_markup });
}

export function sendChatAction(chatId: string | number, action = "typing") {
  return call("sendChatAction", { chat_id: chatId, action });
}

export function answerCallbackQuery(id: string, text?: string) {
  return call("answerCallbackQuery", { callback_query_id: id, ...(text ? { text } : {}) });
}

export function setWebhook(url: string, secretToken: string) {
  return call("setWebhook", {
    url,
    secret_token: secretToken,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  });
}

export function deleteWebhook() {
  return call("deleteWebhook", { drop_pending_updates: false });
}

export function getWebhookInfo() {
  return call("getWebhookInfo", {});
}

export function getMe() {
  return call("getMe", {});
}
