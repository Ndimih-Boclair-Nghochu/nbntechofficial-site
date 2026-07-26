import { cn } from "@/lib/utils";

/**
 * NBN TECH logo.
 *
 * The artwork (navy shield, cyan border, person-at-laptop, data blocks and the
 * "NBN TECH" wordmark) already contains the wordmark, so it renders on its own.
 *
 * Currently points at /public/logo.svg (a crisp vector of the mark). To use the
 * exact supplied raster instead, drop it at /public/logo.png and change the
 * `src` below to "/logo.png" — nothing else needs to change.
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
      src="/logo.svg"
      alt="NBN TECH"
      height={height}
      style={{ height }}
      loading={priority ? "eager" : "lazy"}
      className={cn("w-auto select-none", className)}
    />
  );
}
