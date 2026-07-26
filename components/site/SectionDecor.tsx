import { cn } from "@/lib/utils";

/**
 * Subtle decorative background layer for light sections — soft cyan glows and an
 * optional faint blueprint grid — so the page reads as designed, not blank white.
 * Purely decorative; sits behind content.
 */
export function SectionDecor({
  grid = false,
  glow = "right",
  className,
}: {
  grid?: boolean;
  glow?: "left" | "right" | "both" | "none";
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {grid && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0B1E3C 1px, transparent 1px), linear-gradient(to bottom, #0B1E3C 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 70% 60% at 80% 30%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 80% 30%, black, transparent)",
          }}
        />
      )}
      {(glow === "right" || glow === "both") && (
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" />
      )}
      {(glow === "left" || glow === "both") && (
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-deep/10 blur-3xl" />
      )}
    </div>
  );
}
