"use client";

import { cn } from "@/lib/utils";
import { track } from "./track";

/**
 * Outbound purchase link to a selling platform (Amazon, Selar, Jumia, …).
 * Always rel="nofollow sponsored" (affiliate best practice) and fires the
 * `buy_click` conversion event (the most important marketplace event).
 */
export function AmazonLink({
  href,
  productSlug,
  country,
  platform,
  className,
  children,
}: {
  href: string;
  productSlug?: string;
  country?: string;
  platform?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={cn(className)}
      onClick={() => track("buy_click", { product: productSlug, country, platform, url: href })}
    >
      {children}
    </a>
  );
}
