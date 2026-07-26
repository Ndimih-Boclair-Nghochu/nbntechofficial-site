"use client";

import { useState } from "react";
import { Loader2, Plus, Pencil, GripVertical } from "lucide-react";
import type { Skill } from "@prisma/client";
import { Card, Field, DeleteButton, useToast } from "@/components/admin/AdminUI";
import { Icon } from "@/components/site/Icon";
import { skillSchema, skillCategories } from "@/lib/validations";
import { categoryLabel } from "@/lib/utils";

type FormState = {
  name: string;
  category: (typeof skillCategories)[number];
  proficiency: string;
  icon: string;
  order: string;
};

const empty: FormState = {
  name: "",
  category: "Frontend",
  proficiency: "",
  icon: "",
  order: "0",
};

export function SkillsManager({ initial }: { initial: Skill[] }) {
  const [items, setItems] = useState<Skill[]>(initial);
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

  function startEdit(s: Skill) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency?.toString() ?? "",
      icon: s.icon ?? "",
      order: s.order.toString(),
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const payload = {
      name: form.name,
      category: form.category,
      proficiency: form.proficiency === "" ? undefined : Number(form.proficiency),
      icon: form.icon,
      order: Number(form.order) || 0,
    };
    const parsed = skillSchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""])));
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/skills/${editingId}` : "/api/skills", {
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
      const saved = json.data as Skill;
      setItems((prev) =>
        editingId ? prev.map((i) => (i.id === saved.id ? saved : i)) : [...prev, saved],
      );
      show(editingId ? "Skill updated." : "Skill added.");
      resetForm();
    } catch {
      show("Network error.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      show("Skill deleted.");
      if (editingId === id) resetForm();
    } else {
      show("Could not delete.", "error");
    }
  }

  const sorted = [...items].sort(
    (a, b) =>
      skillCategories.indexOf(a.category) - skillCategories.indexOf(b.category) ||
      a.order - b.order ||
      a.name.localeCompare(b.name),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
      {toastNode}

      {/* Form */}
      <Card className="lg:sticky lg:top-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Edit skill" : "Add skill"}
        </h2>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Field label="Name" htmlFor="name" error={errors.name}>
            <input
              id="name"
              className="nbn-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="TypeScript"
            />
          </Field>
          <Field label="Category" htmlFor="category" error={errors.category}>
            <select
              id="category"
              className="nbn-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as FormState["category"] })}
            >
              {skillCategories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Proficiency" htmlFor="proficiency" error={errors.proficiency} hint="1–100 (optional)">
              <input
                id="proficiency"
                type="number"
                min={1}
                max={100}
                className="nbn-input"
                value={form.proficiency}
                onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
              />
            </Field>
            <Field label="Order" htmlFor="order" error={errors.order}>
              <input
                id="order"
                type="number"
                min={0}
                className="nbn-input"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </Field>
          </div>
          <Field
            label="Icon"
            htmlFor="icon"
            error={errors.icon}
            hint="Lucide icon name (e.g. Cloud, Database) or an image URL."
          >
            <input
              id="icon"
              className="nbn-input"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="Cloud"
            />
          </Field>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Save changes" : "Add skill"}
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

      {/* List */}
      <div>
        <p className="mb-3 text-sm text-ink-muted">
          {items.length} skill{items.length === 1 ? "" : "s"}
        </p>
        {sorted.length === 0 ? (
          <Card>
            <p className="text-sm text-ink-body">No skills yet. Add your first one.</p>
          </Card>
        ) : (
          <ul className="space-y-2">
            {sorted.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-xl border border-ink-line bg-surface px-4 py-3 shadow-sm"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-ink-line" />
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                  <Icon name={s.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-ink-muted">
                    {categoryLabel(s.category)} · order {s.order}
                    {typeof s.proficiency === "number" && ` · ${s.proficiency}%`}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(s)}
                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-body hover:bg-canvas hover:text-cyan-deep"
                >
                  Edit
                </button>
                <DeleteButton onConfirm={() => remove(s.id)} itemName={s.name} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
