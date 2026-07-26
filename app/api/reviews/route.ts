import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, zodFieldErrors } from "@/lib/api";
import { reviewSubmitSchema } from "@/lib/validations";

export const runtime = "nodejs";

/**
 * Public review submission. Always stored unapproved — an admin approves it
 * before it appears on the site.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = reviewSubmitSchema.parse(body);

    // Honeypot: silently accept + drop bots.
    if (data.website) return jsonOk({ pending: true });

    await prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role || null,
        quote: data.quote,
        rating: data.rating,
        approved: false,
      },
    });
    return jsonOk({ pending: true }, 201);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    return jsonError("Could not submit review. Please try again.", 500);
  }
}
