import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Quote, PenLine } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { ReviewForm } from "@/components/site/ReviewForm";
import { Stars } from "@/components/site/StarRating";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { getTestimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What clients say about working with NBN TECH — and a place to share your own experience.",
};

export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await getTestimonials({ approvedOnly: true });
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title="Trusted by the people I've built for."
        intro="Real words from clients and collaborators. Worked with me before? Add yours below — it appears once approved."
        background="/photos/contact.jpg"
      >
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
          <Link
            href="#write-review"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 text-sm font-semibold text-navy-950 shadow-[0_8px_30px_rgba(47,180,154,0.35)] transition-colors hover:bg-cyan-soft"
          >
            <PenLine className="h-4 w-4" /> Write a review
          </Link>
          {avg && (
            <span className="inline-flex items-center gap-2 text-sm text-white/75">
              <Stars value={Math.round(Number(avg))} />
              <strong className="text-white">{avg}</strong> · {reviews.length} review
              {reviews.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </PageHeader>

      {/* Reviews grid */}
      <section className="relative bg-gradient-to-b from-canvas to-white py-section">
        <Container>
          {reviews.length === 0 ? (
            <Reveal className="mx-auto max-w-lg rounded-xl2 border border-dashed border-ink-line bg-surface p-12 text-center">
              <p className="text-lg font-medium text-ink">Be the first to leave a review.</p>
              <p className="mt-2 text-ink-body">
                Approved reviews will appear here. Share your experience below.
              </p>
            </Reveal>
          ) : (
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <RevealItem
                  key={r.id}
                  as="article"
                  className="flex flex-col rounded-xl2 border border-ink-line bg-surface p-6 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <Quote className="h-7 w-7 text-cyan/40" aria-hidden />
                    <Stars value={r.rating} />
                  </div>
                  <blockquote className="mt-4 flex-1 leading-relaxed text-ink-body">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3 border-t border-ink-line pt-4">
                    {r.avatarUrl ? (
                      <Image
                        src={r.avatarUrl}
                        alt={r.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan/15 font-serif font-semibold text-cyan-deep">
                        {r.name.charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-ink">{r.name}</p>
                      {r.role && <p className="text-xs text-ink-muted">{r.role}</p>}
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </Container>
      </section>

      {/* Submit form */}
      <section id="write-review" className="scroll-mt-24 bg-sand py-section">
        <Container className="max-w-2xl">
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-6 bg-current opacity-60" />
              Share your experience
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Leave a review
            </h2>
            <p className="mt-3 text-ink-body">
              Worked with NBN TECH? I&apos;d be grateful to hear how it went.
            </p>
          </Reveal>
          <div className="mt-8 rounded-xl2 border border-ink-line bg-surface p-6 shadow-card sm:p-8">
            <ReviewForm />
          </div>
        </Container>
      </section>
    </>
  );
}
