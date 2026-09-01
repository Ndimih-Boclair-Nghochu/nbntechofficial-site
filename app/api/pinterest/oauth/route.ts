import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api";
import { getPinterestApp, pinterestAuthorizeUrl } from "@/lib/pinterest/config";
import { exchangeCodeForToken } from "@/lib/pinterest/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One-time OAuth connect helper (admin-only).
 *   /api/pinterest/oauth?start=1   → redirects to Pinterest consent
 *   /api/pinterest/oauth?code=...  → Pinterest redirects back here; we exchange
 *                                    the code and SHOW the refresh token to copy
 *                                    into PINTEREST_REFRESH_TOKEN (never stored).
 */
export async function GET(req: NextRequest) {
  // Only the admin may run the connect flow.
  const { deny } = await requireAdminApi();
  if (deny) return deny;

  if (!getPinterestApp()) {
    return NextResponse.json({ error: "Set PINTEREST_APP_ID and PINTEREST_APP_SECRET first." }, { status: 400 });
  }

  const sp = req.nextUrl.searchParams;

  if (sp.get("start") === "1") {
    return NextResponse.redirect(pinterestAuthorizeUrl("nbn"));
  }

  const code = sp.get("code");
  if (code) {
    try {
      const tokens = await exchangeCodeForToken(code);
      const html = `<!doctype html><meta charset="utf-8"><title>Pinterest connected</title>
      <body style="font-family:system-ui;max-width:640px;margin:40px auto;padding:0 16px;color:#111633">
        <h1>✅ Pinterest connected</h1>
        <p>Copy this <b>refresh token</b> into your Vercel env var <code>PINTEREST_REFRESH_TOKEN</code>, then redeploy. Keep it secret.</p>
        <pre style="background:#f4f4f7;padding:16px;border-radius:8px;white-space:pre-wrap;word-break:break-all">${(tokens.refresh_token || "(no refresh token returned)").replace(/[<>&]/g, "")}</pre>
        <p>Scopes granted: ${(tokens.scope || "").replace(/[<>&]/g, "")}</p>
        <p>After setting the env var and redeploying, set <code>PINTEREST_ENABLED=true</code> and run a dry-run.</p>
      </body>`;
      return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    } catch (err) {
      return NextResponse.json({ error: "Code exchange failed", detail: String(err) }, { status: 400 });
    }
  }

  // Default: kick off the flow.
  return NextResponse.redirect(pinterestAuthorizeUrl("nbn"));
}
