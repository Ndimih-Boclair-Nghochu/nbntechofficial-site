"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Star, ExternalLink } from "lucide-react";
import type { Project } from "@prisma/client";
import { Card, DeleteButton, useToast } from "@/components/admin/AdminUI";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { categoryLabel } from "@/lib/utils";

type View = { mode: "list" } | { mode: "new" } | { mode: "edit"; project: Project };

export function ProjectsManager({ initial }: { initial: Project[] }) {
  const [items, setItems] = useState<Project[]>(initial);
  const [view, setView] = useState<View>({ mode: "list" });
  const { show, toastNode } = useToast();

  function handleDone(saved: Project) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
    });
    show(view.mode === "edit" ? "Project updated." : "Project created.");
    setView({ mode: "list" });
  }

  async function remove(id: string) {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.id !== id));
      show("Project deleted.");
    } else {
      show("Could not delete.", "error");
    }
  }

  if (view.mode === "new" || view.mode === "edit") {
    return (
      <>
        {toastNode}
        <ProjectForm
          initial={view.mode === "edit" ? view.project : null}
          onDone={handleDone}
          onCancel={() => setView({ mode: "list" })}
        />
      </>
    );
  }

  const sorted = [...items].sort(
    (a, b) => a.order - b.order || +new Date(b.createdAt) - +new Date(a.createdAt),
  );

  return (
    <div>
      {toastNode}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setView({ mode: "new" })}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-700"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      {sorted.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-body">No projects yet. Create your first case study.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {sorted.map((p) => (
            <li key={p.id}>
              <Card className="flex items-center gap-4 p-4">
                <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-navy-50 sm:block">
                  {p.coverImageUrl ? (
                    <Image src={p.coverImageUrl} alt="" fill sizes="96px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700 font-serif text-cyan/70">
                      {p.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-ink">{p.title}</p>
                    {p.featured && (
                      <span title="Featured" className="text-cyan-deep">
                        <Star className="h-4 w-4 fill-current" />
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">
                    {categoryLabel(p.category)} · /work/{p.slug} · order {p.order}
                  </p>
                </div>
                <a
                  href={`/work/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden rounded-md p-2 text-ink-muted hover:text-cyan-deep sm:inline-flex"
                  aria-label="View on site"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setView({ mode: "edit", project: p })}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-ink-body hover:bg-canvas hover:text-cyan-deep"
                >
                  Edit
                </button>
                <DeleteButton onConfirm={() => remove(p.id)} itemName={p.title} />
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
