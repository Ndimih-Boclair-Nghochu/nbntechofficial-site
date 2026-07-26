"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

/** Chip-style editor for a string[] (e.g. tech stack). */
export function StringListInput({
  value,
  onChange,
  placeholder = "Add and press Enter",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]);
    setDraft("");
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          className="nbn-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-ink-line px-3 text-sm font-medium text-ink-body hover:border-cyan hover:text-cyan-deep"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      {value.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {value.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1 text-sm text-ink">
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== item))}
                aria-label={`Remove ${item}`}
                className="text-ink-muted hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
