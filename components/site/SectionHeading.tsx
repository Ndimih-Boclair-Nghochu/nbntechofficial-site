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
  // Headings/eyebrows center on mobile, left-align from lg up (unless forced center).
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        centered ? "mx-auto text-center" : "mx-auto text-center lg:mx-0 lg:text-left",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "eyebrow justify-center lg:justify-start",
            centered && "justify-center",
            variant === "light" && "text-cyan",
          )}
        >
          <span className="h-px w-6 bg-current opacity-60" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-4 text-[1.7rem] font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl",
          variant === "light" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            variant === "light" ? "text-white/70" : "text-ink-body",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
