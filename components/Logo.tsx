import { cn } from "@/lib/utils";

/**
 * NBN TECH logo.
 *
 * The artwork (navy shield, cyan border, person-at-laptop, data blocks and the
 * "NBN TECH" wordmark) already contains the wordmark, so it renders on its own.
 *
 * Uses the supplied artwork at /public/logo.png (whitespace-trimmed). It sits on
 * a white chip everywhere it appears, so its light background blends in.
 */
export function Logo({
  className,
  height = 40,
  priority = false,
}: {
  className?: string;
  height?: number;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="NBN TECH"
      height={height}
      style={{ height }}
      loading={priority ? "eager" : "lazy"}
      className={cn("w-auto select-none", className)}
    />
  );
}
