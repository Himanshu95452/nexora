import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";

// PATCH /api/notifications/:id — mark as read (owner only).
export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;
  const { id: userId } = session.user as any;

  const notification = await prisma.notification.findUnique({ where: { id: params.id } });
  if (!notification || notification.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.notification.update({ where: { id: params.id }, data: { read: true } });
  return NextResponse.json(updated);
}
