import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";

export const runtime = "nodejs";

/** Mark a message read/unread. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    const { read } = await req.json();
    const item = await prisma.contactMessage.update({
      where: { id: params.id },
      data: { read: Boolean(read) },
    });
    return jsonOk(item);
  } catch {
    return jsonError("Could not update message", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { deny } = await requireAdminApi();
  if (deny) return deny;
  try {
    await prisma.contactMessage.delete({ where: { id: params.id } });
    return jsonOk({ id: params.id });
  } catch {
    return jsonError("Could not delete message", 500);
  }
}
