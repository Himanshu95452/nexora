import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// GET /api/admin/professionals?kycStatus=PENDING — admin-only, powers the
// Verify Professionals queue (unlike /api/professionals, which is the public
// directory and only shows already-approved professionals).
export async function GET(req: Request) {
  const session = await requireRole(["ADMIN"]);
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(req.url);
  const kycStatus = searchParams.get("kycStatus") ?? undefined;

  const professionals = await prisma.professional.findMany({
    where: kycStatus ? { kycStatus: kycStatus as any } : undefined,
    include: { user: { select: { name: true, email: true } }, category: true, city: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(professionals);
}
