import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * TEMPORARY diagnostic endpoint. Token-guarded. REMOVE after debugging login.
 * Reports what the running app actually sees: env presence, which database it
 * is connected to, whether the admin exists there, and (via POST) whether a
 * password verifies — exactly replicating the auth authorize() logic.
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
    directHost: maskHost(process.env.DIRECT_URL),
    nodeEnv: process.env.NODE_ENV,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  };

  try {
    const admins = await prisma.adminUser.findMany({
      select: { email: true, createdAt: true },
    });
    out.dbOk = true;
    out.adminCount = admins.length;
    out.adminEmails = admins.map((a) => a.email);
  } catch (e) {
    out.dbOk = false;
    out.dbError = (e as Error).message?.slice(0, 300);
  }

  return Response.json(out);
}

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("token") !== TOKEN) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const { email, password } = await req.json();
    const user = await prisma.adminUser.findUnique({
      where: { email: String(email || "").toLowerCase() },
    });
    if (!user) return Response.json({ userFound: false });
    const passwordOk = await bcrypt.compare(String(password || ""), user.passwordHash);
    return Response.json({
      userFound: true,
      passwordOk,
      hashPrefix: user.passwordHash.slice(0, 7),
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message?.slice(0, 300) });
  }
}
