import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAllowedDestination } from "@/lib/tracking";
import { siteUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Click-tracking redirector. Records a first-party click event, then forwards to
 * the (allow-listed) affiliate destination. Refuses anything not on the allow
 * list — it can never be an open redirect.
 *
 *   /r?u=<encoded url>&s=<source>&pid=<slug>&c=<category>&pl=<placement>&co=<country>
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const dest = sp.get("u") || "";

  if (!dest || !isAllowedDestination(dest)) {
    // Never forward to an untrusted URL — send them to the marketplace instead.
    return NextResponse.redirect(new URL("/nbnmarket", siteUrl()), 302);
  }

  // Best-effort click log (reuses the existing analytics table; never blocks
  // the redirect on an error).
  try {
    await prisma.analyticsEvent.create({
      data: {
        type: "buy_click",
        productSlug: sp.get("pid") || null,
        category: sp.get("c") || null,
        provider: sp.get("s") || null,
        country: sp.get("co") || null,
        path: sp.get("pl") || null, // placement: bot | channel | pin | miniapp
      },
    });
  } catch {
    /* analytics is non-critical — proceed to the redirect regardless */
  }

  return NextResponse.redirect(dest, 302);
}
