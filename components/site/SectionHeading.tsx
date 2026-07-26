import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  variant = "dark",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
  /** dark = for light backgrounds; light = for navy backgrounds */
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow", variant === "light" && "text-cyan")}>
          <span className="h-px w-6 bg-current opacity-60" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-4 text-3xl font-semibold tracking-tight sm:text-4xl",
          variant === "light" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            variant === "light" ? "text-white/70" : "text-ink-body",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
