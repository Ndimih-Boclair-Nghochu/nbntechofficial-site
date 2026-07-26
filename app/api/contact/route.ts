import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { jsonError, jsonOk, zodFieldErrors } from "@/lib/api";
import { contactSchema } from "@/lib/validations";
import { getSiteContent } from "@/lib/data";

export const runtime = "nodejs";

/**
 * Public contact endpoint. If RESEND_API_KEY is set the message is emailed to
 * the site's contact address; otherwise it's accepted and logged server-side so
 * the form still works out of the box (with the mailto: fallback in the UI).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // Honeypot: bots fill hidden fields. Pretend success, drop silently.
    if (data.company) return jsonOk({ delivered: false });

    const content = await getSiteContent();
    const to = content.contactEmail || process.env.ADMIN_EMAIL || "";

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && to) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || "NBN TECH <onboarding@resend.dev>",
          to: [to],
          reply_to: data.email,
          subject: `New enquiry from ${data.name}`,
          text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
        }),
      });
      if (!res.ok) {
        console.error("[contact] Resend failed:", await res.text());
        return jsonError("Message could not be sent. Please email me directly.", 502);
      }
      return jsonOk({ delivered: true });
    }

    // No email provider configured — log so it's not lost, still succeed.
    console.info(`[contact] ${data.name} <${data.email}>: ${data.message}`);
    return jsonOk({ delivered: false });
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    return jsonError("Something went wrong. Please email me directly.", 500);
  }
}
