import type { AmazonProduct } from "./types";

/**
 * Normalize a raw Creators API `Item` (lowerCamelCase) into our clean, safe
 * AmazonProduct shape. Every access is defensive — the API omits resources that
 * weren't requested or that the account isn't approved for.
 */

type AnyObj = Record<string, unknown>;
function obj(v: unknown): AnyObj {
  return v && typeof v === "object" ? (v as AnyObj) : {};
}
function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}
function num(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function normalizeItem(raw: unknown, marketplace: string): AmazonProduct | null {
  const item = obj(raw);
  const asin = str(item.asin);
  if (!asin) return null;

  const itemInfo = obj(item.itemInfo);
  const title = str(obj(itemInfo.title).displayValue) || asin;
  const brand = str(obj(obj(itemInfo.byLineInfo).brand).displayValue);

  // Images: primary in decreasing size preference, plus a small gallery.
  const primary = obj(obj(item.images).primary);
  const image =
    str(obj(primary.large).url) || str(obj(primary.medium).url) || str(obj(primary.small).url);
  const variants = Array.isArray(obj(item.images).variants) ? (obj(item.images).variants as unknown[]) : [];
  const gallery = variants
    .map((v) => str(obj(obj(v).large).url) || str(obj(obj(v).medium).url))
    .filter((u): u is string => !!u);
  const images = [image, ...gallery].filter((u): u is string => !!u).slice(0, 6);

  // First offer listing (buy-box preferred).
  const listings = Array.isArray(obj(item.offersV2).listings)
    ? (obj(item.offersV2).listings as unknown[])
    : [];
  const listing =
    obj(listings.find((l) => obj(l).isBuyBoxWinner === true)) ||
    obj(listings[0]) ||
    {};
  const money = obj(obj(listing.price).money);
  const price = num(money.amount);
  const priceDisplay = str(money.displayAmount);
  const currency = str(money.currency);
  const availability = str(obj(listing.availability).message) || str(obj(listing.availability).type);
  const condition =
    str(listing.condition) || str(obj(listing.condition).value) || str(obj(listing.condition).conditionNote);

  // Reviews (only present if the account/resources include them).
  const reviews = obj(item.customerReviews);
  const reviewCount = num(reviews.count);
  const rating = num(obj(reviews.starRating).value);

  const detailPageUrl = str(item.detailPageURL);

  return {
    asin,
    title,
    brand,
    image,
    images,
    price,
    priceDisplay,
    currency,
    availability,
    condition,
    rating,
    reviewCount,
    detailPageUrl,
    marketplace,
  };
}
