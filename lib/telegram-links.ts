/**
 * Public Telegram bot link (safe for client + server). The per-placement `start`
 * param becomes the bot's /start payload, so we can see which website spot drove
 * each join. Override the base with NEXT_PUBLIC_TELEGRAM_BOT_URL if the bot is
 * renamed.
 */
export function telegramBotUrl(start?: string): string {
  const base = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || "https://t.me/NbnMarketBot";
  if (!start) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}start=${encodeURIComponent(start)}`;
}
