"use client";

import { COUNTRIES } from "@/lib/marketplace";
import { useCountry } from "./CountryProvider";
import { track } from "./track";

/** Compact country dropdown for the marketplace header. */
export function CountrySelect() {
  const { code, setCode } = useCountry();
  return (
    <label className="flex items-center gap-2 whitespace-nowrap text-sm text-ink-muted">
      <span className="hidden sm:inline">Shopping from:</span>
      <select
        aria-label="Choose your shopping country"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          track("country_selected", { country: e.target.value });
        }}
        className="rounded-lg border border-ink-line bg-white px-2.5 py-1.5 text-sm text-ink focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/30"
      >
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
