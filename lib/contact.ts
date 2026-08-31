/**
 * Direct-contact helpers (WhatsApp). Safe on client + server. When a shopper
 * can't find a product, we route them to a human on WhatsApp to be connected
 * with a trusted, verified seller — rather than risk an unknown listing.
 */

/** Digits-only WhatsApp number (with country code). Override via env. */
export function whatsappNumber(): string {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "237652859412").replace(/[^0-9]/g, "");
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(text)}`;
}

/** Pre-filled message a shopper sends when a product isn't listed. */
export function whatsappHelpText(query: string): string {
  const q = (query || "").trim();
  return q
    ? `Hi NBN MARKET 👋 I'm looking for "${q}" but couldn't find it on your site. Can you connect me with a trusted, verified seller?`
    : `Hi NBN MARKET 👋 I'm looking for a product I couldn't find on your site. Can you connect me with a trusted, verified seller?`;
}
