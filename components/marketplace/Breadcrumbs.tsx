import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/lib/utils";
import { BackButton } from "./BackButton";

export type Crumb = { name: string; url: string };

/** Visual breadcrumb trail with a back arrow. Pair with breadcrumbJsonLd(). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-3 py-4">
      <BackButton />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.url} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-ink-line" aria-hidden />}
              {last ? (
                <span className="font-medium text-ink" aria-current="page">
                  {c.name}
                </span>
              ) : (
                <Link href={c.url} className="hover:text-cyan-deep">
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** BreadcrumbList JSON-LD from the same crumb list. */
export function breadcrumbJsonLd(items: Crumb[]) {
  const base = siteUrl();
  const abs = (u: string) => (u.startsWith("http") ? u : `${base}${u}`);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.url),
    })),
  };
}
