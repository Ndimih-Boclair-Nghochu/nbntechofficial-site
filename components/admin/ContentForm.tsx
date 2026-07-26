"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Card, Field, useToast } from "@/components/admin/AdminUI";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { siteContentSchema } from "@/lib/validations";
import type { ResolvedSiteContent } from "@/lib/data";

export function ContentForm({ initial }: { initial: ResolvedSiteContent }) {
  const router = useRouter();
  const { show, toastNode } = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [f, setF] = useState({
    heroHeadline: initial.heroHeadline,
    heroSubheadline: initial.heroSubheadline,
    heroPhotoUrl: initial.heroPhotoUrl ?? "",
    heroPhotoAlt: initial.heroPhotoAlt ?? "",
    positioningStatement: initial.positioningStatement,
    aboutTitle: initial.aboutTitle,
    aboutText: initial.aboutText,
    aboutPhotoUrl: initial.aboutPhotoUrl ?? "",
    aboutPhotoAlt: initial.aboutPhotoAlt ?? "",
    contactEmail: initial.contactEmail,
    contactHeadline: initial.contactHeadline,
    contactBody: initial.contactBody,
    linkedin: initial.socialLinks.linkedin ?? "",
    github: initial.socialLinks.github ?? "",
    x: initial.socialLinks.x ?? "",
    website: initial.socialLinks.website ?? "",
    metaTitle: initial.metaTitle,
    metaDescription: initial.metaDescription,
  });

  const set = (k: keyof typeof f) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const payload = {
      heroHeadline: f.heroHeadline,
      heroSubheadline: f.heroSubheadline,
      heroPhotoUrl: f.heroPhotoUrl,
      heroPhotoAlt: f.heroPhotoAlt,
      positioningStatement: f.positioningStatement,
      aboutTitle: f.aboutTitle,
      aboutText: f.aboutText,
      aboutPhotoUrl: f.aboutPhotoUrl,
      aboutPhotoAlt: f.aboutPhotoAlt,
      contactEmail: f.contactEmail,
      contactHeadline: f.contactHeadline,
      contactBody: f.contactBody,
      socialLinks: { linkedin: f.linkedin, github: f.github, x: f.x, website: f.website },
      metaTitle: f.metaTitle,
      metaDescription: f.metaDescription,
    };
    const parsed = siteContentSchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""])));
      show("Please fix the highlighted fields.", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.details) setErrors(json.details);
        show(json.error || "Save failed.", "error");
        return;
      }
      show("Site content saved.");
      router.refresh();
    } catch {
      show("Network error.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {toastNode}

      {/* Hero */}
      <Card>
        <h2 className="text-lg font-semibold text-ink">Hero</h2>
        <p className="mt-1 text-sm text-ink-muted">The first thing visitors see on the home page.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Headline" error={errors.heroHeadline} className="sm:col-span-2">
            <input className="nbn-input" value={f.heroHeadline} onChange={set("heroHeadline")} />
          </Field>
          <Field label="Subheadline" error={errors.heroSubheadline} className="sm:col-span-2">
            <textarea className="nbn-input resize-y" rows={3} value={f.heroSubheadline} onChange={set("heroSubheadline")} />
          </Field>
          <Field label="Positioning statement" error={errors.positioningStatement} className="sm:col-span-2">
            <input className="nbn-input" value={f.positioningStatement} onChange={set("positioningStatement")} />
          </Field>
          <div>
            <ImageUpload
              label="Hero background photo"
              value={f.heroPhotoUrl}
              onChange={(url) => setF({ ...f, heroPhotoUrl: url })}
              folder="hero"
            />
          </div>
          <Field label="Hero photo alt text" error={errors.heroPhotoAlt} hint="Describe the image for screen readers.">
            <input className="nbn-input" value={f.heroPhotoAlt} onChange={set("heroPhotoAlt")} />
          </Field>
        </div>
      </Card>

      {/* About */}
      <Card>
        <h2 className="text-lg font-semibold text-ink">About</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="About title" error={errors.aboutTitle} className="sm:col-span-2">
            <input className="nbn-input" value={f.aboutTitle} onChange={set("aboutTitle")} />
          </Field>
          <Field
            label="About text"
            error={errors.aboutText}
            hint="Separate paragraphs with a blank line."
            className="sm:col-span-2"
          >
            <textarea className="nbn-input resize-y" rows={6} value={f.aboutText} onChange={set("aboutText")} />
          </Field>
          <div>
            <ImageUpload
              label="About photo"
              value={f.aboutPhotoUrl}
              onChange={(url) => setF({ ...f, aboutPhotoUrl: url })}
              folder="about"
              aspect="aspect-[4/5]"
            />
          </div>
          <Field label="About photo alt text" error={errors.aboutPhotoAlt}>
            <input className="nbn-input" value={f.aboutPhotoAlt} onChange={set("aboutPhotoAlt")} />
          </Field>
        </div>
      </Card>

      {/* Contact + social */}
      <Card>
        <h2 className="text-lg font-semibold text-ink">Contact & social</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Contact email" error={errors.contactEmail}>
            <input type="email" className="nbn-input" value={f.contactEmail} onChange={set("contactEmail")} />
          </Field>
          <Field label="Contact headline" error={errors.contactHeadline}>
            <input className="nbn-input" value={f.contactHeadline} onChange={set("contactHeadline")} />
          </Field>
          <Field label="Contact body" error={errors.contactBody} className="sm:col-span-2">
            <textarea className="nbn-input resize-y" rows={2} value={f.contactBody} onChange={set("contactBody")} />
          </Field>
          <Field label="LinkedIn URL" error={errors.socialLinks}>
            <input type="url" className="nbn-input" value={f.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/…" />
          </Field>
          <Field label="GitHub URL">
            <input type="url" className="nbn-input" value={f.github} onChange={set("github")} placeholder="https://github.com/…" />
          </Field>
          <Field label="X (Twitter) URL">
            <input type="url" className="nbn-input" value={f.x} onChange={set("x")} placeholder="https://x.com/…" />
          </Field>
          <Field label="Website URL">
            <input type="url" className="nbn-input" value={f.website} onChange={set("website")} placeholder="https://…" />
          </Field>
        </div>
      </Card>

      {/* SEO */}
      <Card>
        <h2 className="text-lg font-semibold text-ink">SEO</h2>
        <div className="mt-5 grid gap-4">
          <Field label="Meta title" error={errors.metaTitle} hint="Shown in search results and the browser tab.">
            <input className="nbn-input" value={f.metaTitle} onChange={set("metaTitle")} />
          </Field>
          <Field label="Meta description" error={errors.metaDescription} hint="150–160 characters recommended.">
            <textarea className="nbn-input resize-y" rows={2} value={f.metaDescription} onChange={set("metaDescription")} />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-medium text-white shadow-card-hover hover:bg-navy-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save all changes
        </button>
      </div>
    </form>
  );
}
