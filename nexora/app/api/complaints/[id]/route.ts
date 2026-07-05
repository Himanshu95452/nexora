import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { refundBookingPayment } from "@/app/api/payments/[bookingId]/refund/route";

// PATCH /api/complaints/:id — admin-only: investigate / resolve / approve refund.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"]);
  if (session instanceof NextResponse) return session;

  const body = await req.json();
  const { status, resolutionNotes } = body ?? {};

  const updated = await prisma.complaint.update({
    where: { id: params.id },
    data: { ...(status ? { status } : {}), ...(resolutionNotes !== undefined ? { resolutionNotes } : {}) },
  });

  // Approving a refund routes through the same Razorpay-aware refund logic
  // used by the standalone admin refund endpoint — handles gateway,
  // wallet, and cash payments consistently.
  if (status === "REFUND_APPROVED") {
    const complaint = await prisma.complaint.findUnique({ where: { id: params.id } });
    if (complaint) await refundBookingPayment(complaint.bookingId);
  }

  return NextResponse.json(updated);
}
