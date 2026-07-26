"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Pencil } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { Card, Field, DeleteButton, useToast } from "@/components/admin/AdminUI";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StarInput, Stars } from "@/components/site/StarRating";
import { testimonialSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
  rating: number;
  approved: boolean;
  order: string;
};

const empty: FormState = {
  name: "",
  role: "",
  quote: "",
  avatarUrl: "",
  rating: 5,
  approved: true,
  order: "0",
};

export function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const [items, setItems] = useState<Testimonial[]>(initial);
  const [form, setForm] = useState<FormState>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { show, toastNode } = useToast();

  function resetForm() {
    setForm(empty);
    setEditingId(null);
    setErrors({});
  }

  function startEdit(t: Testimonial) {
    setEditingId(t.id);
    setForm({
      name: t.name,
      role: t.role ?? "",
      quote: t.quote,
      avatarUrl: t.avatarUrl ?? "",
      rating: t.rating,
      approved: t.approved,
      order: t.order.toString(),
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const payload = {
      name: form.name,
      role: form.role,
      quote: form.quote,
      avatarUrl: form.avatarUrl,
      rating: form.rating,
      approved: form.approved,
      order: Number(form.order) || 0,
    };
    const parsed = testimonialSchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""])));
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/testimonials/${editingId}` : "/api/testimonials", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.details) setErrors(json.details);
        show(json.error || "Save failed.", "error");
        return;
      }
      const saved = json.data as Testimonial;
      setItems((prev) =>
        editingId ? prev.map((i) => (i.id === saved.id ? saved : i)) : [...prev, saved],
      );
      show(editingId ? "Testimonial updated." : "Testimonial added.");
      resetForm();
    } catch {
      show("Network error.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      show("Testimonial deleted.");
      if (editingId === id) resetForm();
    } else {
      show("Could not delete.", "error");
    }
  }

  async function toggleApproved(id: string, approved: boolean) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, approved } : i)));
    const res = await fetch(`/api/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    if (res.ok) show(approved ? "Review approved — now live." : "Review hidden.");
    else show("Could not update.", "error");
  }

  // Pending (unapproved) first, then by order.
  const sorted = [...items].sort(
    (a, b) => Number(a.approved) - Number(b.approved) || a.order - b.order,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
      {toastNode}

      <Card className="lg:sticky lg:top-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Edit testimonial" : "Add testimonial"}
        </h2>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Field label="Name" error={errors.name}>
            <input
              className="nbn-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="A. Mensah"
            />
          </Field>
          <Field label="Role / company" error={errors.role}>
            <input
              className="nbn-input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Founder, EdTech startup"
            />
          </Field>
          <Field label="Quote" error={errors.quote}>
            <textarea
              className="nbn-input resize-y"
              rows={4}
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              placeholder="What they said…"
            />
          </Field>
          <ImageUpload
            label="Avatar (optional)"
            value={form.avatarUrl}
            onChange={(url) => setForm({ ...form, avatarUrl: url })}
            folder="avatars"
            aspect="aspect-square max-w-[120px]"
          />
          <div>
            <span className="nbn-label">Rating</span>
            <StarInput value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Order" error={errors.order}>
              <input
                type="number"
                min={0}
                className="nbn-input"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </Field>
            <div className="flex items-end">
              <label className="inline-flex cursor-pointer items-center gap-2 pb-2.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-cyan-deep"
                  checked={form.approved}
                  onChange={(e) => setForm({ ...form, approved: e.target.checked })}
                />
                <span className="text-sm font-medium text-ink">Approved (visible)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Save changes" : "Add testimonial"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-ink-muted hover:text-ink"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      <div>
        <p className="mb-3 text-sm text-ink-muted">
          {items.length} testimonial{items.length === 1 ? "" : "s"}
        </p>
        {sorted.length === 0 ? (
          <Card>
            <p className="text-sm text-ink-body">
              No testimonials yet. The section is hidden on the site until you add one.
            </p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {sorted.map((t) => (
              <li
                key={t.id}
                className={cn(
                  "rounded-xl border bg-surface p-5 shadow-sm",
                  t.approved ? "border-ink-line" : "border-amber-300 bg-amber-50/40",
                )}
              >
                <div className="flex items-start gap-3">
                  {t.avatarUrl ? (
                    <Image
                      src={t.avatarUrl}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan/15 font-serif font-semibold text-cyan-deep">
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{t.name}</p>
                      <Stars value={t.rating} />
                      {!t.approved && (
                        <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800">
                          Pending
                        </span>
                      )}
                    </div>
                    {t.role && <p className="text-xs text-ink-muted">{t.role}</p>}
                    <p className="mt-2 text-sm text-ink-body">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <button
                      onClick={() => toggleApproved(t.id, !t.approved)}
                      className={cn(
                        "rounded-md px-2.5 py-1.5 text-xs font-semibold",
                        t.approved
                          ? "text-ink-muted hover:bg-canvas"
                          : "bg-cyan text-navy-950 hover:bg-cyan-soft",
                      )}
                    >
                      {t.approved ? "Hide" : "Approve"}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(t)}
                        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-body hover:bg-canvas hover:text-cyan-deep"
                      >
                        Edit
                      </button>
                      <DeleteButton onConfirm={() => remove(t.id)} itemName={t.name} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
