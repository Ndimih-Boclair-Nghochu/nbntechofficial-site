import { put, del } from "@vercel/blob";

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/** Upload an image File to Vercel Blob and return its public URL. */
export async function uploadImage(file: File, folder = "uploads"): Promise<UploadResult> {
  if (!isBlobConfigured()) {
    return { ok: false, error: "Image storage is not configured (missing BLOB_READ_WRITE_TOKEN)." };
  }
  if (!file || file.size === 0) return { ok: false, error: "No file provided." };
  if (file.size > MAX_BYTES) return { ok: false, error: "Image must be 6 MB or smaller." };
  if (!ALLOWED.includes(file.type)) {
    return { ok: false, error: "Unsupported file type. Use JPG, PNG, WEBP, GIF or SVG." };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${Date.now()}-${safeName}`;

  try {
    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return { ok: true, url: blob.url };
  } catch (err) {
    const msg = (err as Error).message || "Upload failed.";
    // The most common misconfiguration: the Blob store only allows private
    // access, but a public portfolio needs public images.
    if (/private/i.test(msg)) {
      return {
        ok: false,
        error:
          "Your Vercel Blob store is set to private-only. Public site images need a public store — create a Blob store with public access (or paste an image URL instead).",
      };
    }
    return { ok: false, error: msg };
  }
}

/** Best-effort delete of a previously uploaded blob (ignores failures). */
export async function deleteImage(url: string) {
  if (!isBlobConfigured() || !url) return;
  try {
    await del(url);
  } catch {
    /* non-fatal */
  }
}
