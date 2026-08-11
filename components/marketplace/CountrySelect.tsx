"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { countriesByRegion } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useCountry } from "./CountryProvider";
import { track } from "./track";

/**
 * Prominent "Deliver to" country selector — always visible on every device.
 * A styled pill sits over a real (transparent) <select>, so it looks premium
 * but stays fully accessible and works with the native dropdown on mobile.
 */
export function CountrySelect({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { code, country, setCode } = useCountry();

  const shell =
    variant === "dark"
      ? "border-white/25 bg-white/10 text-white hover:bg-white/15"
      : "border-ink-line bg-white text-ink hover:border-cyan";

  return (
    <div className="relative inline-flex">
      <div
        aria-hidden
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
          shell,
        )}
      >
        <MapPin className={cn("h-4 w-4", variant === "dark" ? "text-cyan-soft" : "text-cyan-deep")} />
        <span className="flex flex-col leading-none">
          <span className={cn("text-[10px] font-medium", variant === "dark" ? "text-white/60" : "text-ink-muted")}>
            Deliver to
          </span>
          <span className="mt-0.5">
            {country.flag} {country.name}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </div>
      <select
        aria-label="Choose your delivery / shopping country"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          track("country_selected", { country: e.target.value, source: "header" });
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
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
    </div>
  );
}
