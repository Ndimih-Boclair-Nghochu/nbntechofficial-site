"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Single-image uploader → Vercel Blob via /api/upload. Controlled: parent owns
 * the URL string. Falls back to a manual URL paste field if storage isn't
 * configured (no BLOB_READ_WRITE_TOKEN), so the form always works.
 */
export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
  aspect = "aspect-[16/10]",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Upload failed.");
        return;
      }
      onChange(json.data.url);
    } catch {
      setError("Upload failed. Check your connection.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="nbn-label">{label}</span>

      {value ? (
        <div className={cn("relative overflow-hidden rounded-lg border border-ink-line bg-navy-50", aspect)}>
          <Image src={value} alt="" fill sizes="400px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-950/80 text-white hover:bg-red-600"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-line bg-canvas text-ink-muted transition-colors hover:border-cyan hover:text-cyan-deep",
            aspect,
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm">Uploading…</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-6 w-6" />
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs">JPG, PNG, WEBP or SVG · max 6MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}

      {/* Manual URL fallback (works without Blob configured). */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL"
        className="nbn-input mt-2 text-xs"
      />
    </div>
  );
}
