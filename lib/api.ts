import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/auth";

/** Standard JSON error response. */
export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, error: message, details }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

/** Turn a ZodError into a flat { field: message } map. */
export function zodFieldErrors(err: ZodError) {
  const flat = err.flatten().fieldErrors;
  const out: Record<string, string> = {};
  for (const [key, msgs] of Object.entries(flat)) {
    if (msgs && msgs.length) out[key] = msgs[0]!;
  }
  return out;
}

/**
 * Guard for admin-only API routes. Returns the session user, or a 401 response
 * to return directly. Server-side — never trust the client for this.
 */
export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user) {
    return { user: null, deny: jsonError("Unauthorized", 401) };
  }
  return { user: session.user, deny: null };
}
