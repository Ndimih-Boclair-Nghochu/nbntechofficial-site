import Link from "next/link";
import type { MarketProduct } from "@prisma/client";
import { availabilityFor, money } from "@/lib/marketplace";

/** Compact star rating (Amazon-style). */
function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-sm leading-none text-amber-500" aria-hidden>
      {"★★★★★".slice(0, full)}
      <span className="text-ink-line">{"★★★★★".slice(full)}</span>
    </span>
  );
}

/**
 * Product card — a single crawlable <Link> (Google discovers product URLs
 * through it). Clean, product-first, no marketing clutter.
 */
export function ProductCard({ product, country }: { product: MarketProduct; country: string }) {
  const av = availabilityFor(product, country);
  const showRating = product.rating != null && product.reviewCount;

  return (
    <Link
      href={`/marketplace/product/${product.slug}`}
      className="group flex flex-col rounded-lg border border-ink-line bg-surface p-3 transition-shadow hover:shadow-card-hover"
    >
      <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-md bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || "/logo-mark.png"}
          alt={product.imageAlt || product.name}
          loading="lazy"
          width={280}
          height={280}
          className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-ink group-hover:text-cyan-deep">
        {product.name}
      </h3>
      {showRating && (
        <span className="mt-1 flex items-center gap-1.5">
          <Stars rating={Number(product.rating)} />
          <span className="text-xs text-ink-muted">{product.reviewCount}</span>
        </span>
      )}
      {product.price != null && (
        <span className="mt-1.5 text-lg font-bold text-ink">{money(product.price, product.currency)}</span>
      )}
      <span
        className={`mt-1 text-xs font-medium ${
          av.status === "AVAILABLE"
            ? "text-emerald-600"
            : av.status === "UNAVAILABLE"
              ? "text-rose-600"
              : "text-ink-muted"
        }`}
      >
        {av.status === "AVAILABLE"
          ? `In stock · Amazon ${av.country.name}`
          : av.status === "UNAVAILABLE"
            ? "Currently unavailable"
            : "Check availability"}
      </span>
    </Link>
  );
}

export function ProductGrid({
  products,
  country,
  empty,
}: {
  products: MarketProduct[];
  country: string;
  empty?: string;
}) {
  if (!products.length) {
    return (
      <div className="rounded-lg border border-dashed border-ink-line bg-surface p-10 text-center text-ink-muted">
        {empty || "No products here yet — check back soon."}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} country={country} />
      ))}
    </div>
  );
}
