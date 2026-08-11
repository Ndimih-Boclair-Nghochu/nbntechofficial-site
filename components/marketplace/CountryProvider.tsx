"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { COUNTRY_MAP, DEFAULT_COUNTRY, resolveCountry, type Country } from "@/lib/marketplace";

/**
 * Country preference for the marketplace subtree.
 *
 * Precedence:
 *   1. The user's explicit choice (localStorage / cookie) — always wins.
 *   2. Auto-detection from the browser locale + timezone on first visit
 *      (privacy-friendly: no permission prompt, no network call).
 *   3. The default country.
 *
 * The server renders with the cookie value (stable, crawlable first paint); the
 * client then detects/updates and keeps the cookie in sync for the next render.
 */

type Ctx = {
  code: string;
  country: Country;
  setCode: (code: string, opts?: { manual?: boolean }) => void;
};

const CountryContext = createContext<Ctx | null>(null);

const STORE_KEY = "nbm_country";

const TZ_TO_COUNTRY: Record<string, string> = {
  "Europe/Berlin": "DE",
  "Europe/Busingen": "DE",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Rome": "IT",
  "Europe/Madrid": "ES",
};

/** Best-effort country guess from the browser locale, then timezone. */
function detectCountry(): string | null {
  try {
    const langs =
      (typeof navigator !== "undefined" && (navigator.languages || [navigator.language])) || [];
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
  try {
    localStorage.setItem(STORE_KEY, code);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${STORE_KEY}=${code};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  } catch {
    /* ignore */
  }
}

export function CountryProvider({
  initial,
  children,
}: {
  initial?: string;
  children: React.ReactNode;
}) {
  const [code, setCodeState] = useState(() =>
    initial && COUNTRY_MAP[initial.toUpperCase()] ? initial.toUpperCase() : DEFAULT_COUNTRY,
  );

  // On first mount: honour a stored choice; otherwise auto-detect from location.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORE_KEY);
    } catch {
      /* ignore */
    }
    if (stored && COUNTRY_MAP[stored.toUpperCase()]) {
      const c = stored.toUpperCase();
      if (c !== code) setCodeState(c);
      return;
    }
    const detected = detectCountry();
    if (detected && detected !== code) {
      setCodeState(detected);
      persist(detected);
    } else if (detected) {
      persist(detected);
    }
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
