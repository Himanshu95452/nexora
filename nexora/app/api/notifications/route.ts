import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";

// GET /api/notifications — the current user's own notifications only.
export async function GET() {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;
  const { id: userId } = session.user as any;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(notifications);
}
