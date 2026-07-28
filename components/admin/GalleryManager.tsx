"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Pencil, Star } from "lucide-react";
import type { GalleryImage } from "@prisma/client";
import { Card, Field, DeleteButton, useToast } from "@/components/admin/AdminUI";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { galleryImageSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

type FormState = { url: string; alt: string; caption: string; featured: boolean; order: string };
const empty: FormState = { url: "", alt: "", caption: "", featured: false, order: "0" };

export function GalleryManager({ initial }: { initial: GalleryImage[] }) {
  const [items, setItems] = useState<GalleryImage[]>(initial);
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

  function startEdit(g: GalleryImage) {
    setEditingId(g.id);
    setForm({ url: g.url, alt: g.alt, caption: g.caption ?? "", featured: g.featured, order: g.order.toString() });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const parsed = galleryImageSchema.safeParse({
      url: form.url,
      alt: form.alt,
      caption: form.caption,
      featured: form.featured,
      order: Number(form.order) || 0,
    });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""])));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/gallery/${editingId}` : "/api/gallery", {
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
      const saved = json.data as GalleryImage;
      setItems((prev) => (editingId ? prev.map((i) => (i.id === saved.id ? saved : i)) : [...prev, saved]));
      show(editingId ? "Image updated." : "Image added.");
      resetForm();
    } catch {
      show("Network error.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      show("Image deleted.");
      if (editingId === id) resetForm();
    } else {
      show("Could not delete.", "error");
    }
  }

  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
      {toastNode}

      <Card className="lg:sticky lg:top-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Edit image" : "Add image"}
        </h2>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <ImageUpload
              label="Image"
              value={form.url}
              onChange={(url) => setForm({ ...form, url })}
              folder="gallery"
              aspect="aspect-[4/3]"
            />
            {errors.url && <p className="mt-1 text-xs font-medium text-red-600">{errors.url}</p>}
          </div>
          <Field
            label="Alt text"
            error={errors.alt}
            hint="Describe the photo — e.g. 'Ndimih Boclair Nghochu at a tech conference'. Helps image search."
          >
            <input
              className="nbn-input"
              value={form.alt}
              onChange={(e) => setForm({ ...form, alt: e.target.value })}
              placeholder="Ndimih Boclair Nghochu speaking at…"
            />
          </Field>
          <Field label="Caption (optional)" error={errors.caption}>
            <input
              className="nbn-input"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Shown under the photo"
            />
          </Field>
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
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                <span className="text-sm font-medium text-ink">Show on home</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Save changes" : "Add image"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-muted hover:text-ink"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      <div>
        <p className="mb-3 text-sm text-ink-muted">
          {items.length} image{items.length === 1 ? "" : "s"}
        </p>
        {sorted.length === 0 ? (
          <Card>
            <p className="text-sm text-ink-body">No images yet. Upload your first photo.</p>
          </Card>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {sorted.map((g) => (
              <li key={g.id} className="overflow-hidden rounded-xl border border-ink-line bg-surface shadow-sm">
                <div className="relative aspect-[4/3] bg-navy-50">
                  <Image src={g.url} alt={g.alt} fill sizes="200px" className="object-cover" />
                  {g.featured && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-cyan px-2 py-0.5 text-[10px] font-bold text-navy-950">
                      <Star className="h-3 w-3 fill-current" /> home
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 p-2">
                  <span className={cn("truncate text-xs", g.caption ? "text-ink" : "text-ink-muted")}>
                    {g.caption || g.alt}
                  </span>
                  <span className="flex shrink-0 items-center">
                    <button
                      onClick={() => startEdit(g)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-ink-body hover:text-cyan-deep"
                    >
                      Edit
                    </button>
                    <DeleteButton onConfirm={() => remove(g.id)} itemName="image" />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
