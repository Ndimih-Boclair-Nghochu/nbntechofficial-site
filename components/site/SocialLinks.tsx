import { Github, Linkedin, Twitter, Globe } from "lucide-react";
import type { SocialLinks as SocialLinksType } from "@/lib/content-defaults";
import { cn } from "@/lib/utils";

const config: Array<{
  key: keyof SocialLinksType;
  label: string;
  Icon: typeof Github;
}> = [
  { key: "github", label: "GitHub", Icon: Github },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "x", label: "X (Twitter)", Icon: Twitter },
  { key: "website", label: "Website", Icon: Globe },
];

export function SocialLinks({
  links,
  variant = "dark",
  className,
}: {
  links: SocialLinksType;
  variant?: "dark" | "light";
  className?: string;
}) {
  const items = config.filter((c) => links[c.key]);
  if (!items.length) return null;

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {items.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
              variant === "light"
                ? "border-white/15 text-white/70 hover:border-cyan hover:text-cyan"
                : "border-navy/10 text-ink-muted hover:border-cyan hover:text-cyan-deep",
            )}
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
