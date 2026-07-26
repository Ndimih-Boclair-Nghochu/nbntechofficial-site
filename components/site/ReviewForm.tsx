"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { StarInput } from "@/components/site/StarRating";
import { reviewSubmitSchema } from "@/lib/validations";

type Errors = Partial<Record<"name" | "role" | "quote", string>>;

export function ReviewForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      role: String(fd.get("role") || ""),
      quote: String(fd.get("quote") || ""),
      rating,
      website: String(fd.get("website") || ""),
    };

    const parsed = reviewSubmitSchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors({ name: fe.name?.[0], role: fe.role?.[0], quote: fe.quote?.[0] });
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.details) setErrors(json.details);
        setServerError(json.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
      setRating(5);
    } catch {
      setServerError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl2 border border-cyan/30 bg-cyan/5 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-cyan-deep" />
        <h3 className="mt-4 text-xl font-semibold text-ink">Thank you!</h3>
        <p className="mt-2 max-w-sm text-ink-body">
          Your review was submitted and will appear here once it&apos;s approved.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-cyan-deep hover:underline"
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">Your rating</span>
        <StarInput value={rating} onChange={setRating} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rv-name" className="mb-1.5 block text-sm font-medium text-ink">
            Your name
          </label>
          <input id="rv-name" name="name" className="nbn-input" placeholder="Jane Doe" required />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="rv-role" className="mb-1.5 block text-sm font-medium text-ink">
            Role / company <span className="text-ink-muted">(optional)</span>
          </label>
          <input id="rv-role" name="role" className="nbn-input" placeholder="Founder, Acme Inc." />
        </div>
      </div>
      <div>
        <label htmlFor="rv-quote" className="mb-1.5 block text-sm font-medium text-ink">
          Your review
        </label>
        <textarea
          id="rv-quote"
          name="quote"
          rows={4}
          className="nbn-input resize-y"
          placeholder="What was it like working with NBN TECH?"
          required
        />
        {errors.quote && <p className="mt-1 text-sm text-red-600">{errors.quote}</p>}
      </div>

      <div className="hidden" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {serverError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-navy-700 disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            Submit review <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
      <p className="text-xs text-ink-muted">Reviews are checked before they appear on the site.</p>
    </form>
  );
}
