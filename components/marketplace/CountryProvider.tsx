"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { COUNTRY_MAP, DEFAULT_COUNTRY, resolveCountry, type Country } from "@/lib/marketplace";

/**
 * Country preference for the marketplace subtree.
 *
 * Precedence:
 *   1. The user's explicit choice (cookie / localStorage) — always wins.
 *   2. The server's edge geo-location (Vercel `x-vercel-ip-country`) used for the
 *      initial render, confirmed on the client by a real geo-IP lookup so it
 *      identifies the visitor's actual country (also works in local dev).
 *   3. Browser locale / timezone as a last resort.
 *   4. The default country.
 */

type Ctx = {
  code: string;
  country: Country;
  setCode: (code: string) => void;
};

const CountryContext = createContext<Ctx | null>(null);

const STORE_KEY = "nbm_country";

const TZ_TO_COUNTRY: Record<string, string> = {
  "Europe/Berlin": "DE",
  "Europe/Busingen": "DE",
  "Europe/Vienna": "AT",
  "Europe/London": "GB",
  "Europe/Dublin": "IE",
  "Europe/Paris": "FR",
  "Europe/Rome": "IT",
  "Europe/Madrid": "ES",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Warsaw": "PL",
  "Europe/Stockholm": "SE",
  "Africa/Lagos": "NG",
  "Africa/Accra": "GH",
  "Africa/Nairobi": "KE",
  "Africa/Douala": "CM",
  "Africa/Abidjan": "CI",
  "Africa/Johannesburg": "ZA",
  "Africa/Cairo": "EG",
};

/** Real country from a privacy-light geo-IP lookup (country code only). */
async function detectByIp(): Promise<string | null> {
  const tries: Array<{ url: string; get: (r: Response) => Promise<string> }> = [
    { url: "https://ipapi.co/country/", get: async (r) => (await r.text()).trim().toUpperCase() },
    { url: "https://ipwho.is/?fields=country_code", get: async (r) => String(((await r.json()) as { country_code?: string }).country_code || "").toUpperCase() },
  ];
  for (const t of tries) {
    try {
      const r = await fetch(t.url, { signal: AbortSignal.timeout(3500) });
      if (!r.ok) continue;
      const cc = await t.get(r);
      if (/^[A-Z]{2}$/.test(cc)) return COUNTRY_MAP[cc] ? cc : null;
    } catch {
      /* try next / fall through */
    }
  }
  return null;
}

/** Fallback guess from the browser locale, then timezone. */
function detectByLocale(): string | null {
  try {
    const langs = (typeof navigator !== "undefined" && (navigator.languages || [navigator.language])) || [];
    for (const l of langs) {
      const m = /[-_]([A-Za-z]{2})\b/.exec(l || "");
      if (m && COUNTRY_MAP[m[1].toUpperCase()]) return m[1].toUpperCase();
    }
  } catch {
    /* ignore */
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TZ_TO_COUNTRY[tz] && COUNTRY_MAP[TZ_TO_COUNTRY[tz]]) return TZ_TO_COUNTRY[tz];
  } catch {
    /* ignore */
  }
  return null;
}

function persist(code: string) {
  try { localStorage.setItem(STORE_KEY, code); } catch { /* ignore */ }
  try { document.cookie = `${STORE_KEY}=${code};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`; } catch { /* ignore */ }
}

export function CountryProvider({ initial, children }: { initial?: string; children: React.ReactNode }) {
  const [code, setCodeState] = useState(() =>
    initial && COUNTRY_MAP[initial.toUpperCase()] ? initial.toUpperCase() : DEFAULT_COUNTRY,
  );

  useEffect(() => {
    // 1. An explicit stored choice always wins.
    let stored: string | null = null;
    try { stored = localStorage.getItem(STORE_KEY); } catch { /* ignore */ }
    if (stored && COUNTRY_MAP[stored.toUpperCase()]) {
      const c = stored.toUpperCase();
      if (c !== code) setCodeState(c);
      return;
    }
    // 2. Otherwise detect the real country (IP first, then locale/timezone).
    let cancelled = false;
    (async () => {
      const detected = (await detectByIp()) || detectByLocale();
      if (cancelled || !detected || !COUNTRY_MAP[detected]) return;
      setCodeState(detected);
      persist(detected);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCode = useCallback((next: string) => {
    const c = COUNTRY_MAP[next?.toUpperCase()] ? next.toUpperCase() : DEFAULT_COUNTRY;
    setCodeState(c);
    persist(c);
  }, []);

  return (
    <CountryContext.Provider value={{ code, country: resolveCountry(code), setCode }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry(): Ctx {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    return { code: DEFAULT_COUNTRY, country: resolveCountry(DEFAULT_COUNTRY), setCode: () => {} };
  }
  return ctx;
}
