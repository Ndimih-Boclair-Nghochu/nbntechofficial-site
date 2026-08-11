import Link from "next/link";
import type { MarketProduct } from "@prisma/client";
import { availabilityFor, ctaLabel, money } from "@/lib/marketplace";
import { AmazonLink } from "./AmazonLink";
import { CardGallery } from "./CardGallery";

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
 * Product card — image + title link to the product page (crawlable), plus a Buy
 * button that goes straight to the seller for the shopper's country.
 */
export function ProductCard({ product, country }: { product: MarketProduct; country: string }) {
  const av = availabilityFor(product, country);
  const href = `/marketplace/product/${product.slug}`;
  const showRating = product.rating != null && product.reviewCount;
  const images = [product.imageUrl, ...(product.gallery || [])].filter(Boolean) as string[];

  return (
    <article className="group flex flex-col rounded-lg border border-ink-line bg-surface p-3 transition-shadow hover:shadow-card-hover">
      <div className="mb-3">
        <CardGallery images={images.length ? images : ["/logo-mark.png"]} alt={product.imageAlt || product.name} href={href} />
      </div>

      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-ink">
        <Link href={href} className="hover:text-cyan-deep">{product.name}</Link>
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
          ? `In stock${av.platform ? ` · ${av.platform}` : ""}`
          : av.status === "UNAVAILABLE"
            ? "Currently unavailable"
            : "Check availability"}
      </span>

      <div className="mt-3">
        {av.hasLink ? (
          <AmazonLink
            href={av.url}
            productSlug={product.slug}
            country={country}
            platform={av.platform}
            className="flex w-full items-center justify-center rounded-lg bg-[#ff9900] px-3 py-2 text-sm font-bold text-[#231a00] transition hover:brightness-105"
          >
            {ctaLabel(av) || "Buy now"}
          </AmazonLink>
        ) : (
          <Link
            href={href}
            className="flex w-full items-center justify-center rounded-lg border border-ink-line px-3 py-2 text-sm font-semibold text-ink transition hover:border-cyan hover:text-cyan-deep"
          >
            View details
          </Link>
        )}
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
