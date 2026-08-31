import type { ReactNode } from "react";

/**
 * Professional article header — eyebrow, large title, author/meta row and an
 * optional cover image. Shared across every NBN MARKET blog article so they read
 * as one polished, modern editorial system.
 */
export function ArticleHeader({
  eyebrow,
  title,
  readMinutes,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  readMinutes?: number;
  image?: string | null;
  imageAlt?: string;
}) {
  const updated = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date());
  return (
    <header className="mx-auto max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c77b00]">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-[2rem] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-[2.6rem]">
        {title}
      </h1>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
        <span className="inline-flex items-center gap-2 font-medium text-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="" className="h-6 w-6 rounded-full ring-1 ring-ink-line" />
          NBN TECH
        </span>
        <span aria-hidden>·</span>
        <span>Updated {updated}</span>
        {readMinutes ? (
          <>
            <span aria-hidden>·</span>
            <span>{readMinutes} min read</span>
          </>
        ) : null}
      </div>

      {image ? (
        <figure className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt || title}
            loading="eager"
            className="aspect-[16/9] w-full rounded-2xl border border-ink-line bg-white object-cover shadow-card"
          />
        </figure>
      ) : (
        <hr className="mt-8 border-ink-line" />
      )}
    </header>
  );
}

/** Brand-styled long-form typography wrapper (Tailwind Typography `prose-nbn`). */
export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`prose prose-nbn prose-lg mx-auto max-w-2xl ${className}`}>{children}</div>;
}

/** A tidy, self-contained callout/box that opts out of prose styling. */
export function ArticleBox({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`not-prose mx-auto max-w-2xl rounded-2xl border border-ink-line bg-sand-soft p-5 ${className}`}>
      {children}
    </div>
  );
}
