import { NextRequest } from "next/server";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { uploadImage } from "@/lib/blob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;

  const form = await req.formData();
  const file = form.get("file");
  const folder = (form.get("folder") as string) || "uploads";

  if (!(file instanceof File)) {
    return jsonError("No file provided.", 400);
  }

  const result = await uploadImage(file, folder);
  if (!result.ok) return jsonError(result.error, 400);

  return jsonOk({ url: result.url });
}
