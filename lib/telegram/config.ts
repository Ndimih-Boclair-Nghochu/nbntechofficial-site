/**
 * Telegram bot — configuration (env-driven, no secrets in source, no side effects).
 * Safe to import anywhere; the token is only read when a call is actually made.
 */

export function getBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || null;
}

/** Secret compared against Telegram's X-Telegram-Bot-Api-Secret-Token header. */
export function getWebhookSecret(): string | null {
  return process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || null;
}

/** Comma-separated numeric admin chat ids allowed to use /stats etc. */
export function getAdminIds(): string[] {
  return (process.env.TELEGRAM_ADMIN_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isTelegramAdmin(chatId: string | number): boolean {
  return getAdminIds().includes(String(chatId));
}

export function isBotConfigured(): boolean {
  return !!getBotToken();
}

/** Default delivery country for a brand-new bot user (matches the site default). */
export const DEFAULT_BOT_COUNTRY = "DE";
