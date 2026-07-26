"use client";

import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import type { Project } from "@prisma/client";
import { Card, Field } from "@/components/admin/AdminUI";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { StringListInput } from "@/components/admin/StringListInput";
import { projectSchema, projectCategories } from "@/lib/validations";
import { slugify, categoryLabel } from "@/lib/utils";

type Props = {
  initial?: Project | null;
  onDone: (saved: Project) => void;
  onCancel: () => void;
};

export function ProjectForm({ initial, onDone, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(!!initial);

  const [f, setF] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    summary: initial?.summary ?? "",
    description: initial?.description ?? "",
    role: initial?.role ?? "",
    techStack: initial?.techStack ?? [],
    coverImageUrl: initial?.coverImageUrl ?? "",
    coverImageAlt: initial?.coverImageAlt ?? "",
    gallery: initial?.gallery ?? [],
    liveUrl: initial?.liveUrl ?? "",
    githubUrl: initial?.githubUrl ?? "",
    featured: initial?.featured ?? false,
    order: initial?.order?.toString() ?? "0",
    category: initial?.category ?? "Web",
  });

  function setTitle(v: string) {
    setF((prev) => ({
      ...prev,
      title: v,
      slug: slugTouched ? prev.slug : slugify(v),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const payload = {
      title: f.title,
      slug: f.slug,
      summary: f.summary,
      description: f.description,
      role: f.role,
      techStack: f.techStack,
      coverImageUrl: f.coverImageUrl,
      coverImageAlt: f.coverImageAlt,
      gallery: f.gallery,
      liveUrl: f.liveUrl,
      githubUrl: f.githubUrl,
      featured: f.featured,
      order: Number(f.order) || 0,
      category: f.category,
    };
    const parsed = projectSchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""])));
      setServerError("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(initial ? `/api/projects/${initial.id}` : "/api/projects", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.details) setErrors(json.details);
        setServerError(json.error || "Save failed.");
        return;
      }
      onDone(json.data as Project);
    } catch {
      setServerError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </button>

      <Card>
        <h2 className="text-lg font-semibold text-ink">Details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Title" error={errors.title} className="sm:col-span-2">
            <input className="nbn-input" value={f.title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Slug" error={errors.slug} hint="Used in the URL: /work/your-slug" className="sm:col-span-2">
            <input
              className="nbn-input"
              value={f.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setF({ ...f, slug: e.target.value });
              }}
            />
          </Field>
          <Field label="Summary" error={errors.summary} hint="Short line shown on cards." className="sm:col-span-2">
            <textarea className="nbn-input resize-y" rows={2} value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} />
          </Field>
          <Field
            label="Description (Markdown)"
            error={errors.description}
            hint="Full case study. Supports Markdown headings, lists, links, bold."
            className="sm:col-span-2"
          >
            <textarea className="nbn-input resize-y font-mono text-xs leading-relaxed" rows={12} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          </Field>
          <Field label="Role" error={errors.role}>
            <input className="nbn-input" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} placeholder="Sole engineer" />
          </Field>
          <Field label="Category" error={errors.category}>
            <select
              className="nbn-input"
              value={f.category}
              onChange={(e) => setF({ ...f, category: e.target.value as Project["category"] })}
            >
              {projectCategories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tech stack" error={errors.techStack} className="sm:col-span-2">
            <StringListInput
              value={f.techStack}
              onChange={(next) => setF({ ...f, techStack: next })}
              placeholder="e.g. Next.js — press Enter"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">Media</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ImageUpload
            label="Cover image"
            value={f.coverImageUrl}
            onChange={(url) => setF({ ...f, coverImageUrl: url })}
            folder="covers"
          />
          <Field label="Cover image alt text" error={errors.coverImageAlt} hint="Required for accessibility when an image is set.">
            <input className="nbn-input" value={f.coverImageAlt} onChange={(e) => setF({ ...f, coverImageAlt: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <GalleryUploader value={f.gallery} onChange={(next) => setF({ ...f, gallery: next })} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">Links & display</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Live URL" error={errors.liveUrl}>
            <input type="url" className="nbn-input" value={f.liveUrl} onChange={(e) => setF({ ...f, liveUrl: e.target.value })} placeholder="https://…" />
          </Field>
          <Field label="GitHub URL" error={errors.githubUrl}>
            <input type="url" className="nbn-input" value={f.githubUrl} onChange={(e) => setF({ ...f, githubUrl: e.target.value })} placeholder="https://github.com/…" />
          </Field>
          <Field label="Order" error={errors.order} hint="Lower numbers appear first.">
            <input type="number" min={0} className="nbn-input" value={f.order} onChange={(e) => setF({ ...f, order: e.target.value })} />
          </Field>
          <div className="flex items-end">
            <label className="inline-flex cursor-pointer items-center gap-3">
              <span className="relative inline-flex">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={f.featured}
                  onChange={(e) => setF({ ...f, featured: e.target.checked })}
                />
                <span className="h-6 w-11 rounded-full bg-ink-line transition-colors peer-checked:bg-cyan-deep" />
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </span>
              <span className="text-sm font-medium text-ink">Featured on home page</span>
            </label>
          </div>
        </div>
      </Card>

      {serverError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {serverError}
        </p>
      )}

      <div className="sticky bottom-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-5 py-3 text-sm font-medium text-ink-muted hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-medium text-white shadow-card-hover hover:bg-navy-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {initial ? "Save changes" : "Create project"}
        </button>
      </div>
    </form>
  );
}
