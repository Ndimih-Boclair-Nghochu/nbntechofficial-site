import { telegramBotUrl } from "@/lib/telegram-links";

/** Telegram paper-plane glyph. */
function TgIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.06-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

/**
 * Compact Telegram join button (header/footer). Secondary emphasis so it never
 * competes with the affiliate "Buy" CTA. Uses the site's cyan accent — no new
 * brand colour. `start` tags the placement for join-source tracking.
 */
export function TelegramJoinButton({
  start,
  label = "Get Deals",
  className = "",
}: {
  start: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={telegramBotUrl(start)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get deal alerts on Telegram"
      className={`inline-flex shrink-0 items-center gap-2 rounded-full bg-cyan px-3 py-2 text-sm font-semibold text-navy-950 transition hover:brightness-105 ${className}`}
    >
      <TgIcon />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

/**
 * Slim hero banner — "prices drop daily, we tell you the second it happens".
 * Full-width, low visual weight, dismissable-free (it's just a strip).
 */
export function TelegramJoinBanner({ start = "home" }: { start?: string }) {
  return (
    <a
      href={telegramBotUrl(start)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 rounded-2xl border border-cyan/30 bg-navy-950 px-4 py-3 text-white transition hover:border-cyan/60 sm:px-5"
    >
      <span className="flex items-center gap-3">
        <TgIcon className="h-5 w-5 shrink-0 text-cyan" />
        <span className="text-sm sm:text-base">
          <b>Prices drop daily.</b> We tell you the second it happens — free on Telegram.
        </span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cyan px-3 py-1.5 text-xs font-bold text-navy-950 sm:text-sm">
        Join free →
      </span>
    </a>
  );
}
