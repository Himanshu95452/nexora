import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { calculateSettlement } from "@/lib/commission";

/**
 * Shared settlement logic — also called automatically from
 * app/api/reviews/route.ts right after a customer submits their rating,
 * since the booking engine's flow settles payment immediately after rating.
 * Exposed here too as an admin-triggered fallback (e.g. a cash booking the
 * customer never rated, or a retry after a failed settlement).
 */
export async function settleBookingPayment(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true, service: { include: { category: true } }, professional: true },
  });
  if (!booking) return { error: "Booking not found", status: 404 as const };
  if (!booking.payment) return { error: "No payment recorded for this booking yet", status: 400 as const };
  if (booking.payment.status === "SETTLED") return { error: "Already settled", status: 409 as const };
  if (booking.payment.status !== "SUCCESS") return { error: `Payment is ${booking.payment.status.toLowerCase()}, not yet collected`, status: 400 as const };
  if (booking.status !== "COMPLETED") return { error: "Booking is not completed yet", status: 400 as const };
  if (!booking.professionalId || !booking.professional) return { error: "No professional assigned", status: 400 as const };

  const rate = booking.service.category.commissionRate;
  const { platformCommission, professionalPayout } = calculateSettlement(booking.payment.amount, rate);

  const [payment] = await Promise.all([
    prisma.payment.update({
      where: { id: booking.payment.id },
      data: { status: "SETTLED", platformCommission, professionalPayout, settledAt: new Date() },
    }),
    prisma.professional.update({
      where: { id: booking.professionalId },
      data: { walletBalance: { increment: professionalPayout } },
    }),
    prisma.notification.create({
      data: {
        userId: booking.professional.userId,
        title: "Payment settled",
        body: `₹${(professionalPayout / 100).toFixed(2)} credited to your Nexora wallet for booking #${booking.id.slice(-6)}.`,
      },
    }),
  ]);

  return { payment, platformCommission, professionalPayout, status: 200 as const };
}

// POST /api/bookings/:id/settle — admin-triggered manual settlement.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"]);
  if (session instanceof NextResponse) return session;

  const result = await settleBookingPayment(params.id);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
