import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { getProviderStatuses } from "@/lib/affiliate/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only: safe status of every affiliate network (enabled/configured/
 * capabilities/missing-var-names). Never returns secret values.
 */
export async function GET() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    return jsonOk({ providers: getProviderStatuses() });
  } catch {
    return jsonError("Could not read affiliate status", 500);
  }
}
