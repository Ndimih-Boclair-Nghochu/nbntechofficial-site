/** Normalized product shape returned to callers (safe to send to the client). */
export type AmazonProduct = {
  asin: string;
  title: string;
  brand: string | null;
  image: string | null;
  images: string[];
  /** Numeric price (may be null when no offer/price is available). */
  price: number | null;
  /** Localised price string from Amazon, e.g. "£899.00". */
  priceDisplay: string | null;
  currency: string | null;
  availability: string | null;
  condition: string | null;
  rating: number | null;
  reviewCount: number | null;
  /** Affiliate-tagged Amazon product URL (from the API). */
  detailPageUrl: string | null;
  /** App country code of the marketplace this result came from. */
  marketplace: string;
};

export type AmazonSearchResult = {
  items: AmazonProduct[];
  totalResultCount: number | null;
  marketplace: string;
  page: number;
};
