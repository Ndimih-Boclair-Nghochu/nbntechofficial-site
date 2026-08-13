"use client";

import { useState } from "react";
import { Loader2, Plus, Pencil, Sparkles, Link2 } from "lucide-react";
import type { Course } from "@prisma/client";
import { Card, Field, DeleteButton, useToast } from "@/components/admin/AdminUI";
import { courseSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { COURSE_CATEGORIES, COURSE_PROVIDERS, COURSE_LEVELS, COURSE_LANGUAGES } from "@/lib/courses";

type FormState = {
  title: string;
  slug: string;
  provider: string;
  affiliateNetwork: string;
  affiliateUrl: string;
  image: string;
  imageAlt: string;
  category: string;
  subcategory: string;
  instructor: string;
  shortDescription: string;
  description: string;
  price: string;
  currency: string;
  originalPrice: string;
  discountPercentage: string;
  rating: string;
  reviewCount: string;
  duration: string;
  lectureCount: string;
  level: string;
  language: string;
  lastUpdated: string;
  tags: string;
  whatYouLearn: string;
  requirements: string;
  commissionRate: string;
  commissionType: string;
  trackingId: string;
  externalProductId: string;
  externalProductUrl: string;
  certificateAvailable: boolean;
  bestseller: boolean;
  featured: boolean;
  demo: boolean;
  published: boolean;
  order: string;
};

const empty: FormState = {
  title: "", slug: "", provider: "Udemy", affiliateNetwork: "Impact", affiliateUrl: "", image: "", imageAlt: "",
  category: "", subcategory: "", instructor: "", shortDescription: "", description: "", price: "", currency: "USD",
  originalPrice: "", discountPercentage: "", rating: "", reviewCount: "", duration: "", lectureCount: "",
  level: "", language: "English", lastUpdated: "", tags: "", whatYouLearn: "", requirements: "",
  commissionRate: "", commissionType: "", trackingId: "", externalProductId: "", externalProductUrl: "",
  certificateAvailable: false, bestseller: false, featured: false, demo: false, published: true, order: "0",
};

const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const commas = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const numOrUndef = (s: string) => (s.trim() === "" || Number.isNaN(Number(s)) ? undefined : Number(s));

export function CoursesManager({ initial }: { initial: Course[] }) {
  const [items, setItems] = useState<Course[]>(initial);
  const [form, setForm] = useState<FormState>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const { show, toastNode } = useToast();

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  function resetForm() {
    setForm(empty);
    setEditingId(null);
    setErrors({});
  }

  async function loadDemo() {
    setSeeding(true);
    try {
      const res = await fetch("/api/courses/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        show(json.error || "Could not load demo courses.", "error");
        return;
      }
      setItems(json.data.courses as Course[]);
      show(`Loaded ${json.data.seeded} demo courses.`);
    } catch {
      show("Network error.", "error");
    } finally {
      setSeeding(false);
    }
  }

  function startEdit(c: Course) {
    setEditingId(c.id);
    setForm({
      title: c.title, slug: c.slug, provider: c.provider, affiliateNetwork: c.affiliateNetwork,
      affiliateUrl: c.affiliateUrl ?? "", image: c.image ?? "", imageAlt: c.imageAlt ?? "",
      category: c.category ?? "", subcategory: c.subcategory ?? "", instructor: c.instructor ?? "",
      shortDescription: c.shortDescription ?? "", description: c.description ?? "",
      price: c.price?.toString() ?? "", currency: c.currency ?? "USD",
      originalPrice: c.originalPrice?.toString() ?? "", discountPercentage: c.discountPercentage?.toString() ?? "",
      rating: c.rating?.toString() ?? "", reviewCount: c.reviewCount?.toString() ?? "",
      duration: c.duration ?? "", lectureCount: c.lectureCount?.toString() ?? "",
      level: c.level ?? "", language: c.language ?? "English", lastUpdated: c.lastUpdated ?? "",
      tags: c.tags.join(", "), whatYouLearn: c.whatYouLearn.join("\n"), requirements: c.requirements.join("\n"),
      commissionRate: c.commissionRate?.toString() ?? "", commissionType: c.commissionType ?? "",
      trackingId: c.trackingId ?? "", externalProductId: c.externalProductId ?? "",
      externalProductUrl: c.externalProductUrl ?? "",
      certificateAvailable: c.certificateAvailable, bestseller: c.bestseller, featured: c.featured,
      demo: c.demo, published: c.published, order: c.order?.toString() ?? "0",
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const payload = {
      title: form.title,
      slug: form.slug ? slugify(form.slug) : slugify(form.title),
      provider: form.provider,
      affiliateNetwork: form.affiliateNetwork,
      affiliateUrl: form.affiliateUrl,
      image: form.image,
      imageAlt: form.imageAlt,
      category: form.category ? slugify(form.category) : "",
      subcategory: form.subcategory ? slugify(form.subcategory) : "",
      instructor: form.instructor,
      shortDescription: form.shortDescription,
      description: form.description,
      price: numOrUndef(form.price),
      currency: form.currency,
      originalPrice: numOrUndef(form.originalPrice),
      discountPercentage: numOrUndef(form.discountPercentage),
      rating: numOrUndef(form.rating),
      reviewCount: numOrUndef(form.reviewCount),
      duration: form.duration,
      lectureCount: numOrUndef(form.lectureCount),
      level: form.level,
      language: form.language,
      lastUpdated: form.lastUpdated,
      tags: commas(form.tags),
      whatYouLearn: lines(form.whatYouLearn),
      requirements: lines(form.requirements),
      commissionRate: numOrUndef(form.commissionRate),
      commissionType: form.commissionType,
      trackingId: form.trackingId,
      externalProductId: form.externalProductId,
      externalProductUrl: form.externalProductUrl,
      certificateAvailable: form.certificateAvailable,
      bestseller: form.bestseller,
      featured: form.featured,
      demo: form.demo,
      published: form.published,
      order: numOrUndef(form.order) ?? 0,
    };

    const parsed = courseSchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""])));
      show("Please fix the highlighted fields.", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/courses/${editingId}` : "/api/courses", {
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
      const saved = json.data as Course;
      setItems((prev) => (editingId ? prev.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...prev]));
      show(editingId ? "Course updated." : "Course added.");
      resetForm();
    } catch {
      show("Network error.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      show("Course deleted.");
      if (editingId === id) resetForm();
    } else {
      show("Could not delete.", "error");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[460px_1fr] lg:items-start">
      {toastNode}

      {/* Form */}
      <Card className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Edit course" : "Add course"}
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Add a course from any provider/affiliate network. Paste the network-generated affiliate URL (e.g. the
          Impact/Udemy tracking link) — never fabricate ratings, prices or reviews.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title" htmlFor="c-title" error={errors.title} className="col-span-2">
              <input id="c-title" className="nbn-input" value={form.title} onChange={(e) => set({ title: e.target.value })} />
            </Field>
            <Field label="Slug" htmlFor="c-slug" error={errors.slug} hint="auto from title if blank">
              <input id="c-slug" className="nbn-input" value={form.slug} onChange={(e) => set({ slug: e.target.value })} />
            </Field>
            <Field label="Instructor" htmlFor="c-instr" error={errors.instructor}>
              <input id="c-instr" className="nbn-input" value={form.instructor} onChange={(e) => set({ instructor: e.target.value })} />
            </Field>
            <Field label="Provider" htmlFor="c-prov" error={errors.provider}>
              <input id="c-prov" list="course-providers" className="nbn-input" value={form.provider} onChange={(e) => set({ provider: e.target.value })} />
              <datalist id="course-providers">
                {COURSE_PROVIDERS.map((p) => <option key={p.name} value={p.name} />)}
              </datalist>
            </Field>
            <Field label="Affiliate network" htmlFor="c-net" error={errors.affiliateNetwork}>
              <input id="c-net" className="nbn-input" value={form.affiliateNetwork} onChange={(e) => set({ affiliateNetwork: e.target.value })} />
            </Field>
          </div>

          {/* Affiliate URL — the key field */}
          <Field
            label="Affiliate URL (tracked link)"
            htmlFor="c-aff"
            error={errors.affiliateUrl}
            hint="Paste the Impact-generated Udemy tracking URL here. Leave blank to show a 'link coming soon' state."
          >
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 shrink-0 text-ink-muted" />
              <input id="c-aff" className="nbn-input" placeholder="https://…impact tracking link…" value={form.affiliateUrl} onChange={(e) => set({ affiliateUrl: e.target.value })} />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category" htmlFor="c-cat" error={errors.category} hint="type any — new ones appear automatically">
              <input id="c-cat" list="course-cats" className="nbn-input" placeholder="e.g. AWS, DevOps" value={form.category} onChange={(e) => set({ category: e.target.value })} />
              <datalist id="course-cats">
                {COURSE_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </datalist>
            </Field>
            <Field label="Sub-category" htmlFor="c-sub" error={errors.subcategory}>
              <input id="c-sub" className="nbn-input" value={form.subcategory} onChange={(e) => set({ subcategory: e.target.value })} />
            </Field>
          </div>

          <Field label="Image URL" htmlFor="c-img" error={errors.image}>
            <input id="c-img" className="nbn-input" placeholder="https://… or /path.png" value={form.image} onChange={(e) => set({ image: e.target.value })} />
          </Field>
          <Field label="Image alt" htmlFor="c-imgalt" error={errors.imageAlt}>
            <input id="c-imgalt" className="nbn-input" value={form.imageAlt} onChange={(e) => set({ imageAlt: e.target.value })} />
          </Field>

          <Field label="Short description" htmlFor="c-short" error={errors.shortDescription}>
            <textarea id="c-short" rows={2} className="nbn-input" value={form.shortDescription} onChange={(e) => set({ shortDescription: e.target.value })} />
          </Field>
          <Field label="Description" htmlFor="c-desc" error={errors.description}>
            <textarea id="c-desc" rows={4} className="nbn-input" value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Price" htmlFor="c-price" error={errors.price}>
              <input id="c-price" className="nbn-input" inputMode="decimal" value={form.price} onChange={(e) => set({ price: e.target.value })} />
            </Field>
            <Field label="Original price" htmlFor="c-oprice" error={errors.originalPrice}>
              <input id="c-oprice" className="nbn-input" inputMode="decimal" value={form.originalPrice} onChange={(e) => set({ originalPrice: e.target.value })} />
            </Field>
            <Field label="Currency" htmlFor="c-cur" error={errors.currency}>
              <input id="c-cur" className="nbn-input" value={form.currency} onChange={(e) => set({ currency: e.target.value })} />
            </Field>
            <Field label="Discount %" htmlFor="c-disc" error={errors.discountPercentage} hint="optional; auto from prices">
              <input id="c-disc" className="nbn-input" inputMode="numeric" value={form.discountPercentage} onChange={(e) => set({ discountPercentage: e.target.value })} />
            </Field>
            <Field label="Rating (0–5)" htmlFor="c-rate" error={errors.rating}>
              <input id="c-rate" className="nbn-input" inputMode="decimal" value={form.rating} onChange={(e) => set({ rating: e.target.value })} />
            </Field>
            <Field label="Review count" htmlFor="c-rev" error={errors.reviewCount}>
              <input id="c-rev" className="nbn-input" inputMode="numeric" value={form.reviewCount} onChange={(e) => set({ reviewCount: e.target.value })} />
            </Field>
            <Field label="Duration" htmlFor="c-dur" error={errors.duration} hint="e.g. 24 hours">
              <input id="c-dur" className="nbn-input" value={form.duration} onChange={(e) => set({ duration: e.target.value })} />
            </Field>
            <Field label="Lectures" htmlFor="c-lec" error={errors.lectureCount}>
              <input id="c-lec" className="nbn-input" inputMode="numeric" value={form.lectureCount} onChange={(e) => set({ lectureCount: e.target.value })} />
            </Field>
            <Field label="Last updated" htmlFor="c-upd" error={errors.lastUpdated} hint="e.g. 2024-11">
              <input id="c-upd" className="nbn-input" value={form.lastUpdated} onChange={(e) => set({ lastUpdated: e.target.value })} />
            </Field>
            <Field label="Level" htmlFor="c-lvl" error={errors.level}>
              <select id="c-lvl" className="nbn-input" value={form.level} onChange={(e) => set({ level: e.target.value })}>
                <option value="">—</option>
                {COURSE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Language" htmlFor="c-lang" error={errors.language}>
              <select id="c-lang" className="nbn-input" value={form.language} onChange={(e) => set({ language: e.target.value })}>
                {COURSE_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Order" htmlFor="c-ord" error={errors.order}>
              <input id="c-ord" className="nbn-input" inputMode="numeric" value={form.order} onChange={(e) => set({ order: e.target.value })} />
            </Field>
          </div>

          <Field label="What you'll learn (one per line)" htmlFor="c-learn">
            <textarea id="c-learn" rows={3} className="nbn-input" value={form.whatYouLearn} onChange={(e) => set({ whatYouLearn: e.target.value })} />
          </Field>
          <Field label="Requirements (one per line)" htmlFor="c-req">
            <textarea id="c-req" rows={2} className="nbn-input" value={form.requirements} onChange={(e) => set({ requirements: e.target.value })} />
          </Field>
          <Field label="Tags (comma separated)" htmlFor="c-tags">
            <input id="c-tags" className="nbn-input" value={form.tags} onChange={(e) => set({ tags: e.target.value })} />
          </Field>

          <details className="rounded-lg border border-ink-line p-3">
            <summary className="cursor-pointer text-sm font-medium text-ink">Affiliate economics & tracking (optional)</summary>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Commission rate" htmlFor="c-comm" error={errors.commissionRate}>
                <input id="c-comm" className="nbn-input" inputMode="decimal" value={form.commissionRate} onChange={(e) => set({ commissionRate: e.target.value })} />
              </Field>
              <Field label="Commission type" htmlFor="c-commt" error={errors.commissionType} hint="e.g. percent / flat">
                <input id="c-commt" className="nbn-input" value={form.commissionType} onChange={(e) => set({ commissionType: e.target.value })} />
              </Field>
              <Field label="Tracking ID" htmlFor="c-track" error={errors.trackingId}>
                <input id="c-track" className="nbn-input" value={form.trackingId} onChange={(e) => set({ trackingId: e.target.value })} />
              </Field>
              <Field label="External product ID" htmlFor="c-ext" error={errors.externalProductId}>
                <input id="c-ext" className="nbn-input" value={form.externalProductId} onChange={(e) => set({ externalProductId: e.target.value })} />
              </Field>
              <Field label="External product URL" htmlFor="c-exturl" error={errors.externalProductUrl} className="col-span-2">
                <input id="c-exturl" className="nbn-input" value={form.externalProductUrl} onChange={(e) => set({ externalProductUrl: e.target.value })} />
              </Field>
            </div>
          </details>

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.certificateAvailable} onChange={(e) => set({ certificateAvailable: e.target.checked })} /> Certificate</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.bestseller} onChange={(e) => set({ bestseller: e.target.checked })} /> Bestseller</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => set({ featured: e.target.checked })} /> Featured</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => set({ published: e.target.checked })} /> Published</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.demo} onChange={(e) => set({ demo: e.target.checked })} /> Demo</label>
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-950 hover:brightness-105 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingId ? "Save changes" : "Add course"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-full px-4 py-2.5 text-sm font-medium text-ink-muted hover:text-ink">
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* List */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-ink-muted">{items.length} course{items.length === 1 ? "" : "s"}</p>
          <button type="button" onClick={loadDemo} disabled={seeding} className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan-deep hover:bg-cyan/15 disabled:opacity-60">
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Load demo courses
          </button>
        </div>

        {items.length === 0 ? (
          <Card>
            <p className="text-sm text-ink-body">
              No courses yet. Click <strong>Load demo courses</strong> to preview the layout, or add a real course
              above and paste its Impact/Udemy affiliate URL.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {items.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-ink-line bg-surface p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image || "/logo-mark.png"} alt="" className="h-12 w-20 shrink-0 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {c.title}
                    {c.demo && <span className="ml-2 rounded bg-navy-950/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">Demo</span>}
                    {!c.published && <span className="ml-2 rounded bg-ink-line px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink-muted">Draft</span>}
                    {!c.affiliateUrl && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700">No link</span>}
                  </p>
                  <p className="truncate text-xs text-ink-muted">
                    {c.provider} · {c.category || "—"} · /courses/{c.slug}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <a href={`/courses/${c.slug}`} target="_blank" rel="noreferrer" className="rounded-md px-2 py-1.5 text-xs font-medium text-ink-body hover:bg-canvas hover:text-cyan-deep">View</a>
                  <button onClick={() => startEdit(c)} className="rounded-md px-2 py-1.5 text-xs font-medium text-ink-body hover:bg-canvas hover:text-cyan-deep">Edit</button>
                  <DeleteButton onConfirm={() => remove(c.id)} itemName={c.title} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
