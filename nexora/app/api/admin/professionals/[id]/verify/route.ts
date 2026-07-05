import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// PATCH /api/admin/professionals/:id/verify — admin-only KYC decision.
// Body: { decision: "APPROVED" | "REJECTED" }
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"]);
  if (session instanceof NextResponse) return session;

  const { decision } = await req.json();
  if (!["APPROVED", "REJECTED"].includes(decision)) {
    return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
  }

  const updated = await prisma.professional.update({ where: { id: params.id }, data: { kycStatus: decision } });

  await prisma.notification.create({
    data: {
      userId: (await prisma.professional.findUnique({ where: { id: params.id } }))!.userId,
      title: decision === "APPROVED" ? "You're verified!" : "Verification update",
      body: decision === "APPROVED" ? "Your KYC is approved — you can now accept bookings." : "Your KYC was not approved. Contact partner support for details.",
    },
  });

  return NextResponse.json(updated);
}
