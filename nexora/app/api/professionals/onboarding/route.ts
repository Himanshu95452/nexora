import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// PATCH /api/professionals/onboarding — a professional completes their
// category/city/bio after signing up (this is what the "Profile completion"
// indicator on the Professional Dashboard is tracking toward).
export async function PATCH(req: Request) {
  const session = await requireRole(["PROFESSIONAL"]);
  if (session instanceof NextResponse) return session;

  const { id: userId } = session.user as any;
  const body = await req.json();
  const { categoryId, cityId, bio } = body ?? {};

  const updated = await prisma.professional.update({
    where: { userId },
    data: {
      ...(categoryId ? { categoryId } : {}),
      ...(cityId ? { cityId } : {}),
      ...(bio !== undefined ? { bio } : {}),
    },
  });

  return NextResponse.json(updated);
}
