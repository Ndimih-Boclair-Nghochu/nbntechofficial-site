"use client";

import { cn } from "@/lib/utils";
import { track } from "./track";

/**
 * Outbound Amazon link. Always rel="nofollow sponsored" (affiliate best
 * practice) and fires the `amazon_click` conversion event.
 */
export function AmazonLink({
  href,
  productSlug,
  country,
  className,
  children,
}: {
  href: string;
  productSlug?: string;
  country?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={cn(className)}
      onClick={() => track("amazon_click", { product: productSlug, country, url: href })}
    >
      {children}
    </a>
  );
}
