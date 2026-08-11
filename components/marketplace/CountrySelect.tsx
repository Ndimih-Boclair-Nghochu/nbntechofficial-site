"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { countriesByRegion } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useCountry } from "./CountryProvider";
import { track } from "./track";

/**
 * Prominent "Deliver to" country selector — always visible on every device.
 * A real, visible <select> (so the option list renders normally and is
 * readable); the `.mkt-country-select` class in globals.css forces dark option
 * text on a white background even when the closed control is white-on-dark.
 */
export function CountrySelect({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { code, setCode } = useCountry();
  const dark = variant === "dark";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-1.5",
        dark ? "border-white/25 bg-white/10" : "border-ink-line bg-white",
      )}
    >
      <MapPin className={cn("h-4 w-4 shrink-0", dark ? "text-cyan-soft" : "text-cyan-deep")} />
      <span className="flex min-w-0 flex-col leading-none">
        <span className={cn("text-[10px] font-medium", dark ? "text-white/60" : "text-ink-muted")}>
          Deliver to
        </span>
        <span className="relative mt-0.5 flex items-center">
          <select
            aria-label="Choose your delivery / shopping country"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              track("country_selected", { country: e.target.value, source: "header" });
            }}
            className={cn(
              "mkt-country-select cursor-pointer appearance-none bg-transparent pr-5 text-sm font-semibold focus:outline-none",
              dark ? "text-white" : "text-ink",
            )}
          >
            {countriesByRegion().map((group) => (
              <optgroup key={group.region} label={group.region}>
                {group.countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown
            className={cn("pointer-events-none absolute right-0 h-4 w-4", dark ? "text-white/70" : "text-ink-muted")}
          />
        </span>
      </span>
    </div>
  );
}
