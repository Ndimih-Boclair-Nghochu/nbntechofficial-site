"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, X } from "lucide-react";

/** Multi-image gallery editor → Vercel Blob. Value is an array of URLs. */
export function GalleryUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setError(null);
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "gallery");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || "Upload failed.");
          break;
        }
        uploaded.push(json.data.url);
      }
      if (uploaded.length) onChange([...value, ...uploaded]);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="nbn-label">Gallery images</span>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-ink-line bg-navy-50">
            <Image src={url} alt="" fill sizes="150px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy-950/80 text-white hover:bg-red-600"
              aria-label={`Remove image ${i + 1}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-ink-line text-ink-muted hover:border-cyan hover:text-cyan-deep"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
          <span className="text-xs">{uploading ? "Uploading…" : "Add"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
