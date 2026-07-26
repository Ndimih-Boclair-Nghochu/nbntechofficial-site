import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi, zodFieldErrors } from "@/lib/api";
import { siteContentSchema } from "@/lib/validations";
import { ZodError } from "zod";

export const runtime = "nodejs";

export async function GET() {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  const content = await prisma.siteContent.findUnique({ where: { id: "singleton" } });
  return jsonOk(content);
}

export async function PUT(req: NextRequest) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    const data = siteContentSchema.parse(body);

    const payload = {
      heroHeadline: data.heroHeadline,
      heroSubheadline: data.heroSubheadline,
      heroPhotoUrl: data.heroPhotoUrl || null,
      heroPhotoAlt: data.heroPhotoAlt,
      positioningStatement: data.positioningStatement,
      aboutTitle: data.aboutTitle,
      aboutText: data.aboutText,
      aboutPhotoUrl: data.aboutPhotoUrl || null,
      aboutPhotoAlt: data.aboutPhotoAlt,
      contactEmail: data.contactEmail,
      contactHeadline: data.contactHeadline,
      contactBody: data.contactBody,
      socialLinks: data.socialLinks,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    };

    const content = await prisma.siteContent.upsert({
      where: { id: "singleton" },
      update: payload,
      create: { id: "singleton", ...payload },
    });
    return jsonOk(content);
  } catch (err) {
    if (err instanceof ZodError) return jsonError("Validation failed", 422, zodFieldErrors(err));
    return jsonError("Could not save site content", 500);
  }
}
