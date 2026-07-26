import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * TEMPORARY diagnostic endpoint. Token-guarded. REMOVE after debugging.
 * Reports env/config presence the running app actually sees (names/booleans
 * only — never secret values).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = "nbn-diag-8462"; // remove this whole file when done

function maskHost(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/@([^/:?]+)/);
  return m ? m[1] : "unparseable";
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("token") !== TOKEN) {
    return new Response("Not found", { status: 404 });
  }

  const out: Record<string, unknown> = {
    hasAuthSecret: !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    databaseHost: maskHost(process.env.DATABASE_URL),
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    blobEnvKeys: Object.keys(process.env)
      .filter((k) => k.toUpperCase().includes("BLOB"))
      .sort(),
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    out.adminCount = await prisma.adminUser.count();
    out.dbOk = true;
  } catch (e) {
    out.dbOk = false;
    out.dbError = (e as Error).message?.slice(0, 200);
  }

  return Response.json(out);
}
