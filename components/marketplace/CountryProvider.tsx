"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { COUNTRY_MAP, DEFAULT_COUNTRY, resolveCountry, type Country } from "@/lib/marketplace";

/**
 * Privacy-conscious country preference, shared across the marketplace subtree.
 *
 * The server renders with an initial country (read from the `nbm_country`
 * cookie, so the first paint is crawlable and stable). After mount we sync from
 * localStorage and keep the cookie updated so the next server render matches.
 * We never force a country from uncertain detection — the user is always in
 * control via the selector.
 */

type Ctx = {
  code: string;
  country: Country;
  setCode: (code: string) => void;
};

const CountryContext = createContext<Ctx | null>(null);

const STORE_KEY = "nbm_country";

export function CountryProvider({
  initial,
  children,
}: {
  initial?: string;
  children: React.ReactNode;
}) {
  const [code, setCodeState] = useState(() => {
    const c = initial && COUNTRY_MAP[initial.toUpperCase()] ? initial.toUpperCase() : DEFAULT_COUNTRY;
    return c;
  });

  // Hydrate from localStorage once on mount (may differ from the cookie).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored && COUNTRY_MAP[stored.toUpperCase()] && stored.toUpperCase() !== code) {
        setCodeState(stored.toUpperCase());
      }
    } catch {
      /* localStorage unavailable — ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCode = useCallback((next: string) => {
    const c = COUNTRY_MAP[next?.toUpperCase()] ? next.toUpperCase() : DEFAULT_COUNTRY;
    setCodeState(c);
    try {
      localStorage.setItem(STORE_KEY, c);
    } catch {
      /* ignore */
    }
    try {
      document.cookie = `${STORE_KEY}=${c};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    } catch {
      /* ignore */
    }
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
    // Safe fallback so a stray usage never throws at runtime.
    return { code: DEFAULT_COUNTRY, country: resolveCountry(DEFAULT_COUNTRY), setCode: () => {} };
  }
  return ctx;
}
