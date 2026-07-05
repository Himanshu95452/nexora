import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// GET /api/professionals/me — the signed-in professional's own record,
// including walletBalance (credited by payment settlement) and KYC status.
export async function GET() {
  const session = await requireRole(["PROFESSIONAL"]);
  if (session instanceof NextResponse) return session;
  const { id: userId } = session.user as any;

  const pro = await prisma.professional.findUnique({
    where: { userId },
    include: { category: true, city: true },
  });
  if (!pro) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pro);
}
