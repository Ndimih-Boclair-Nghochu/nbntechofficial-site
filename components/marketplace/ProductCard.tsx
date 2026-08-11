import Link from "next/link";
import type { MarketProduct } from "@prisma/client";
import { availabilityFor, CATEGORY_MAP, money } from "@/lib/marketplace";
import { AvailabilityBadge } from "./AvailabilityPanel";

function truncate(s: string | null | undefined, n: number) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}

/**
 * Product card — a normal crawlable <Link> (Google can discover product URLs
 * through it). The availability badge reflects the country resolved at request
 * time; the full interactive selector lives on the product page.
 */
export function ProductCard({ product, country }: { product: MarketProduct; country: string }) {
  const cat = product.category ? CATEGORY_MAP[product.category] : undefined;
  const av = availabilityFor(product, country);
  const href = `/marketplace/product/${product.slug}`;
  const showRating = product.rating != null && product.reviewCount;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl2 border border-ink-line bg-surface shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={href} className="block aspect-[4/3] overflow-hidden bg-sand" aria-label={product.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || "/logo-mark.png"}
          alt={product.imageAlt || product.name}
          loading="lazy"
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {cat && (
          <Link
            href={`/marketplace/category/${cat.slug}`}
            className="text-xs font-semibold uppercase tracking-wide text-cyan-deep"
          >
            {cat.name}
          </Link>
        )}
        <h3 className="text-base font-semibold leading-snug">
          <Link href={href} className="text-ink hover:text-cyan-deep">
            {product.name}
          </Link>
        </h3>
        <p className="flex-1 text-sm text-ink-muted">
          {truncate(product.shortDescription || product.description, 110)}
        </p>
        <div className="flex items-center justify-between gap-2">
          {product.price != null && (
            <span className="text-lg font-bold text-ink">{money(product.price, product.currency)}</span>
          )}
          {showRating && (
            <span className="text-sm font-medium text-amber-600">
              ★ {Number(product.rating).toFixed(1)}{" "}
              <span className="text-ink-muted">({product.reviewCount})</span>
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 border-t border-ink-line pt-3">
          <AvailabilityBadge status={av.status} />
          <Link href={href} className="text-sm font-semibold text-cyan-deep">
            View details →
          </Link>
        </div>
      </div>
    </article>
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
      <div className="rounded-xl2 border border-dashed border-ink-line bg-surface p-10 text-center text-ink-muted">
        {empty || "No products here yet — check back soon."}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} country={country} />
      ))}
    </div>
  );
}
