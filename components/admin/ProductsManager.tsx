"use client";

import { useState } from "react";
import { Loader2, Plus, Pencil, Sparkles } from "lucide-react";
import type { MarketProduct } from "@prisma/client";
import { Card, Field, DeleteButton, useToast } from "@/components/admin/AdminUI";
import { ProviderImport } from "@/components/admin/ProviderImport";
import { marketProductSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { CATEGORIES, COUNTRIES, countriesByRegion } from "@/lib/marketplace";
import type { AmazonProduct } from "@/lib/amazon/types";

type Avail = { status: string; platform: string; url: string; price: string };
type FormState = {
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: string;
  currency: string;
  rating: string;
  reviewCount: string;
  sku: string;
  imageUrl: string;
  imageAlt: string;
  shortDescription: string;
  description: string;
  whoFor: string;
  whyRecommend: string;
  features: string;
  pros: string;
  cons: string;
  specsText: string;
  faqsText: string;
  gallery: string;
  tags: string;
  related: string;
  guides: string;
  featured: boolean;
  trending: boolean;
  published: boolean;
};

const emptyAvail = (): Record<string, Avail> =>
  Object.fromEntries(
    COUNTRIES.map((c) => [
      c.code,
      { status: "AVAILABILITY_UNKNOWN", platform: c.amazon ? "Amazon" : "", url: "", price: "" },
    ]),
  );

const empty: FormState = {
  name: "", slug: "", brand: "", category: "", price: "", currency: "EUR", rating: "", reviewCount: "",
  sku: "", imageUrl: "", imageAlt: "", shortDescription: "", description: "", whoFor: "", whyRecommend: "",
  features: "", pros: "", cons: "", specsText: "", faqsText: "", gallery: "", tags: "", related: "", guides: "",
  featured: false, trending: false, published: true,
};

const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const commas = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

function parseSpecs(text: string) {
  return lines(text).map((l) => {
    const i = l.indexOf(":");
    return i === -1 ? { label: l, value: "" } : { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() };
  }).filter((s) => s.label);
}
function specsToText(specs: unknown) {
  return Array.isArray(specs)
    ? (specs as { label?: string; value?: string }[]).map((s) => `${s.label || ""}: ${s.value || ""}`).join("\n")
    : "";
}
function parseFaqs(text: string) {
  return lines(text).map((l) => {
    const p = l.split("::");
    return { q: (p[0] || "").trim(), a: (p.slice(1).join("::") || "").trim() };
  }).filter((f) => f.q && f.a);
}
function faqsToText(faqs: unknown) {
  return Array.isArray(faqs)
    ? (faqs as { q?: string; a?: string }[]).map((f) => `${f.q || ""} :: ${f.a || ""}`).join("\n")
    : "";
}

export function ProductsManager({ initial }: { initial: MarketProduct[] }) {
  const [items, setItems] = useState<MarketProduct[]>(initial);
  const [form, setForm] = useState<FormState>(empty);
  const [avail, setAvail] = useState<Record<string, Avail>>(emptyAvail());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const { show, toastNode } = useToast();

  async function loadDemo() {
    setSeeding(true);
    try {
      const res = await fetch("/api/marketplace/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        show(json.error || "Could not load demo products.", "error");
        return;
      }
      setItems(json.data.products as MarketProduct[]);
      show(`Loaded ${json.data.seeded} demo products.`);
    } catch {
      show("Network error.", "error");
    } finally {
      setSeeding(false);
    }
  }

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  function resetForm() {
    setForm(empty);
    setAvail(emptyAvail());
    setEditingId(null);
    setErrors({});
  }

  // Prefill the form from an Amazon search result (admin import).
  function importFromAmazon(p: AmazonProduct, cc: string) {
    setEditingId(null);
    setForm((f) => ({
      ...f,
      name: p.title || f.name,
      slug: "",
      brand: p.brand || f.brand,
      imageUrl: p.image || f.imageUrl,
      imageAlt: p.title || f.imageAlt,
      gallery: p.images && p.images.length ? p.images.join("\n") : f.gallery,
      price: p.price != null ? String(p.price) : f.price,
      currency: p.currency || f.currency,
      sku: p.asin || f.sku,
      shortDescription: f.shortDescription || p.title || "",
    }));
    setAvail((a) => ({
      ...a,
      [cc]: {
        status: p.price != null ? "AVAILABLE" : "AVAILABILITY_UNKNOWN",
        platform: "Amazon",
        url: p.detailPageUrl || "",
        price: p.price != null ? String(p.price) : "",
      },
    }));
    show("Imported from Amazon — review, add a category, then save.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(p: MarketProduct) {
    setEditingId(p.id);
    setForm({
      name: p.name, slug: p.slug, brand: p.brand ?? "", category: p.category ?? "",
      price: p.price?.toString() ?? "", currency: p.currency ?? "EUR",
      rating: p.rating?.toString() ?? "", reviewCount: p.reviewCount?.toString() ?? "",
      sku: p.sku ?? "", imageUrl: p.imageUrl ?? "", imageAlt: p.imageAlt ?? "",
      shortDescription: p.shortDescription ?? "", description: p.description ?? "",
      whoFor: p.whoFor ?? "", whyRecommend: p.whyRecommend ?? "",
      features: p.features.join("\n"), pros: p.pros.join("\n"), cons: p.cons.join("\n"),
      specsText: specsToText(p.specs), faqsText: faqsToText(p.faqs),
      gallery: p.gallery.join("\n"), tags: p.tags.join(", "), related: p.related.join(", "), guides: p.guides.join(", "),
      featured: p.featured, trending: p.trending, published: p.published,
    });
    const av = emptyAvail();
    const stored = (p.amazonAvailability && typeof p.amazonAvailability === "object" ? p.amazonAvailability : {}) as Record<string, { status?: string; platform?: string; url?: string; price?: number }>;
    for (const c of COUNTRIES) {
      const d = stored[c.code];
      if (d) av[c.code] = { status: d.status || "AVAILABILITY_UNKNOWN", platform: d.platform || (c.amazon ? "Amazon" : ""), url: d.url || "", price: d.price != null ? String(d.price) : "" };
    }
    setAvail(av);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const amazonAvailability: Record<string, { status: string; platform?: string; url?: string; price?: number; currency?: string }> = {};
    for (const c of COUNTRIES) {
      const a = avail[c.code];
      const entry: { status: string; platform?: string; url?: string; price?: number; currency?: string } = { status: a.status };
      if (a.platform.trim()) entry.platform = a.platform.trim();
      if (a.url.trim()) entry.url = a.url.trim();
      if (a.price.trim() && !Number.isNaN(Number(a.price))) { entry.price = Number(a.price); entry.currency = c.currency; }
      amazonAvailability[c.code] = entry;
    }

    const payload = {
      name: form.name,
      slug: form.slug ? slugify(form.slug) : slugify(form.name),
      brand: form.brand, category: form.category,
      shortDescription: form.shortDescription, description: form.description,
      whoFor: form.whoFor, whyRecommend: form.whyRecommend,
      imageUrl: form.imageUrl, imageAlt: form.imageAlt,
      gallery: lines(form.gallery),
      price: form.price === "" ? undefined : Number(form.price),
      currency: form.currency,
      rating: form.rating === "" ? undefined : Number(form.rating),
      reviewCount: form.reviewCount === "" ? undefined : Number(form.reviewCount),
      features: lines(form.features), pros: lines(form.pros), cons: lines(form.cons),
      tags: commas(form.tags), related: commas(form.related).map(slugify), guides: commas(form.guides),
      specs: parseSpecs(form.specsText), faqs: parseFaqs(form.faqsText),
      amazonAvailability,
      sku: form.sku,
      featured: form.featured, trending: form.trending, published: form.published,
      order: 0,
    };

    const parsed = marketProductSchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""])));
      show("Please fix the highlighted fields.", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        editingId ? `/api/marketplace/products/${editingId}` : "/api/marketplace/products",
        { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) },
      );
      const json = await res.json();
      if (!res.ok) {
        if (json.details) setErrors(json.details);
        show(json.error || "Save failed.", "error");
        return;
      }
      const saved = json.data as MarketProduct;
      setItems((prev) => (editingId ? prev.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...prev]));
      show(editingId ? "Product updated." : "Product added.");
      resetForm();
    } catch {
      show("Network error.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/marketplace/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      show("Product deleted.");
      if (editingId === id) resetForm();
    } else {
      show("Could not delete.", "error");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[440px_1fr] lg:items-start">
      {toastNode}

      {/* Form */}
      <Card className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Edit product" : "Add product"}
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Only fill in what you know. Never invent availability, prices, ratings or reviews.
        </p>
        <div className="mt-4">
          <ProviderImport onPick={importFromAmazon} />
        </div>
        <form onSubmit={onSubmit} className="mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" htmlFor="p-name" error={errors.name}>
              <input id="p-name" className="nbn-input" value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </Field>
            <Field label="Slug" htmlFor="p-slug" error={errors.slug} hint="auto from name if blank">
              <input id="p-slug" className="nbn-input" value={form.slug} onChange={(e) => set({ slug: e.target.value })} />
            </Field>
            <Field label="Brand" htmlFor="p-brand" error={errors.brand}>
              <input id="p-brand" className="nbn-input" value={form.brand} onChange={(e) => set({ brand: e.target.value })} />
            </Field>
            <Field label="Category" htmlFor="p-cat" error={errors.category}>
              <select id="p-cat" className="nbn-input" value={form.category} onChange={(e) => set({ category: e.target.value })}>
                <option value="">— select —</option>
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Reference price" htmlFor="p-price" error={errors.price}>
              <input id="p-price" type="number" step="0.01" className="nbn-input" value={form.price} onChange={(e) => set({ price: e.target.value })} />
            </Field>
            <Field label="Currency" htmlFor="p-cur" error={errors.currency}>
              <select id="p-cur" className="nbn-input" value={form.currency} onChange={(e) => set({ currency: e.target.value })}>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
              </select>
            </Field>
            <Field label="Rating (0–5)" htmlFor="p-rat" error={errors.rating} hint="only if reliable">
              <input id="p-rat" type="number" step="0.1" min={0} max={5} className="nbn-input" value={form.rating} onChange={(e) => set({ rating: e.target.value })} />
            </Field>
            <Field label="Review count" htmlFor="p-rc" error={errors.reviewCount} hint="only if reliable">
              <input id="p-rc" type="number" min={0} className="nbn-input" value={form.reviewCount} onChange={(e) => set({ reviewCount: e.target.value })} />
            </Field>
            <Field label="Image URL" htmlFor="p-img" error={errors.imageUrl}>
              <input id="p-img" className="nbn-input" value={form.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} placeholder="https://… or /path" />
            </Field>
            <Field label="Image alt" htmlFor="p-alt" error={errors.imageAlt}>
              <input id="p-alt" className="nbn-input" value={form.imageAlt} onChange={(e) => set({ imageAlt: e.target.value })} />
            </Field>
          </div>

          <Field label="Short description" htmlFor="p-short" error={errors.shortDescription} hint="used on cards & meta">
            <input id="p-short" className="nbn-input" value={form.shortDescription} onChange={(e) => set({ shortDescription: e.target.value })} />
          </Field>
          <Field label="Overview / full description" htmlFor="p-desc" error={errors.description}>
            <textarea id="p-desc" rows={3} className="nbn-input" value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>
          <Field label="Who is it for?" htmlFor="p-who" error={errors.whoFor}>
            <textarea id="p-who" rows={2} className="nbn-input" value={form.whoFor} onChange={(e) => set({ whoFor: e.target.value })} />
          </Field>
          <Field label="Why we recommend it" htmlFor="p-why" error={errors.whyRecommend}>
            <textarea id="p-why" rows={2} className="nbn-input" value={form.whyRecommend} onChange={(e) => set({ whyRecommend: e.target.value })} />
          </Field>
          <Field label="Key features (one per line)" htmlFor="p-feat">
            <textarea id="p-feat" rows={3} className="nbn-input" value={form.features} onChange={(e) => set({ features: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pros (one per line)" htmlFor="p-pros">
              <textarea id="p-pros" rows={3} className="nbn-input" value={form.pros} onChange={(e) => set({ pros: e.target.value })} />
            </Field>
            <Field label="Cons (one per line)" htmlFor="p-cons">
              <textarea id="p-cons" rows={3} className="nbn-input" value={form.cons} onChange={(e) => set({ cons: e.target.value })} />
            </Field>
          </div>
          <Field label='Specifications (one per line, "Label: Value")' htmlFor="p-specs">
            <textarea id="p-specs" rows={4} className="nbn-input" value={form.specsText} onChange={(e) => set({ specsText: e.target.value })} placeholder={"Memory: 16GB\nStorage: 512GB SSD"} />
          </Field>
          <Field label='FAQs (one per line, "Question :: Answer")' htmlFor="p-faqs">
            <textarea id="p-faqs" rows={3} className="nbn-input" value={form.faqsText} onChange={(e) => set({ faqsText: e.target.value })} />
          </Field>
          <Field label="Gallery image URLs (one per line)" htmlFor="p-gal">
            <textarea id="p-gal" rows={2} className="nbn-input" value={form.gallery} onChange={(e) => set({ gallery: e.target.value })} />
          </Field>
          <div className="grid grid-cols-1 gap-3">
            <Field label="Tags (comma separated)" htmlFor="p-tags">
              <input id="p-tags" className="nbn-input" value={form.tags} onChange={(e) => set({ tags: e.target.value })} placeholder="programming, student, budget" />
            </Field>
            <Field label="Related product slugs (comma separated)" htmlFor="p-rel">
              <input id="p-rel" className="nbn-input" value={form.related} onChange={(e) => set({ related: e.target.value })} />
            </Field>
          </div>

          {/* Availability */}
          <fieldset className="rounded-lg border border-ink-line p-3">
            <legend className="px-1.5 text-sm font-medium text-ink">Availability by country &amp; platform</legend>
            <p className="mb-2 text-xs text-ink-muted">
              Leave as “Not verified” unless you have real data. Platform can be Amazon, Selar, Jumia,
              eBay, etc. Add the direct product URL to send buyers straight to it.
            </p>
            <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
              {countriesByRegion().map((group) => (
                <div key={group.region}>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{group.region}</p>
                  <div className="space-y-1.5">
                    {group.countries.map((c) => (
                      <div key={c.code} className="grid grid-cols-[70px_1fr] items-start gap-2">
                        <span className="pt-2 text-xs">{c.flag} {c.code}</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <select
                            aria-label={`${c.name} availability`}
                            className="nbn-input !py-1.5 !text-xs"
                            value={avail[c.code].status}
                            onChange={(e) => setAvail((a) => ({ ...a, [c.code]: { ...a[c.code], status: e.target.value } }))}
                          >
                            <option value="AVAILABILITY_UNKNOWN">Not verified</option>
                            <option value="AVAILABLE">Available</option>
                            <option value="UNAVAILABLE">Not available</option>
                          </select>
                          <input
                            aria-label={`${c.name} platform`}
                            className="nbn-input !py-1.5 !text-xs" placeholder="platform"
                            value={avail[c.code].platform}
                            onChange={(e) => setAvail((a) => ({ ...a, [c.code]: { ...a[c.code], platform: e.target.value } }))}
                          />
                          <input
                            aria-label={`${c.name} product URL`}
                            className="nbn-input col-span-2 !py-1.5 !text-xs" placeholder="direct product URL"
                            value={avail[c.code].url}
                            onChange={(e) => setAvail((a) => ({ ...a, [c.code]: { ...a[c.code], url: e.target.value } }))}
                          />
                          <input
                            aria-label={`${c.name} price`}
                            type="number" step="0.01" className="nbn-input !py-1.5 !text-xs" placeholder={`price (${c.currency})`}
                            value={avail[c.code].price}
                            onChange={(e) => setAvail((a) => ({ ...a, [c.code]: { ...a[c.code], price: e.target.value } }))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => set({ featured: e.target.checked })} /> Featured</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.trending} onChange={(e) => set({ trending: e.target.checked })} /> Trending</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => set({ published: e.target.checked })} /> Published</label>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Save changes" : "Add product"}
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
          <p className="text-sm text-ink-muted">{items.length} product{items.length === 1 ? "" : "s"}</p>
          <button
            type="button"
            onClick={loadDemo}
            disabled={seeding}
            className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan-deep hover:bg-cyan/15 disabled:opacity-60"
          >
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Load demo products
          </button>
        </div>
        {items.length === 0 ? (
          <Card>
            <p className="text-sm text-ink-body">
              No products yet. Click <strong>Load demo products</strong> to fill the store with sample
              items (real photos + info) you can then edit or delete — or add your own above.
            </p>
          </Card>
        ) : (
          <ul className="space-y-2">
            {items.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border border-ink-line bg-surface px-4 py-3 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl || "/logo-mark.png"} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {p.name} {!p.published && <span className="text-xs font-normal text-rose-600">(draft)</span>}
                  </p>
                  <p className="truncate text-xs text-ink-muted">
                    {p.category || "—"} · /marketplace/product/{p.slug}
                    {p.featured && " · featured"}
                    {p.trending && " · trending"}
                  </p>
                </div>
                <a href={`/marketplace/product/${p.slug}`} target="_blank" rel="noreferrer" className="rounded-md px-2 py-1.5 text-xs font-medium text-ink-body hover:bg-canvas hover:text-cyan-deep">View</a>
                <button onClick={() => startEdit(p)} className="rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-body hover:bg-canvas hover:text-cyan-deep">Edit</button>
                <DeleteButton onConfirm={() => remove(p.id)} itemName={p.name} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
