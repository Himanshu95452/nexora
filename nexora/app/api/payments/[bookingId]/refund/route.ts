import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { razorpay } from "@/lib/razorpay";

/**
 * Shared refund logic — called both from the standalone admin endpoint below
 * and automatically from the complaint workflow when an admin approves a
 * refund (app/api/complaints/[id]/route.ts).
 *
 * Handles all three payment paths: Razorpay-gateway payments get refunded
 * through Razorpay itself; wallet payments are refunded back into the
 * customer's Nexora Wallet; cash payments are refunded as a wallet credit
 * (there's no gateway transaction to reverse).
 */
export async function refundBookingPayment(bookingId: string, amount?: number) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { payment: true, customer: true } });
  if (!booking?.payment) return { error: "No payment found for this booking", status: 404 as const };
  const payment = booking.payment;
  if (payment.status === "REFUNDED") return { error: "Already fully refunded", status: 409 as const };
  if (!["SUCCESS", "SETTLED", "PARTIALLY_REFUNDED"].includes(payment.status)) {
    return { error: `Cannot refund a payment in ${payment.status} status`, status: 400 as const };
  }

  const refundAmount = amount ?? payment.amount;
  const isFull = refundAmount >= payment.amount;

  if (payment.method === "WALLET" || payment.method === "CASH") {
    // No gateway transaction to reverse — credit the customer's wallet directly.
    await prisma.customer.update({ where: { id: booking.customerId }, data: { walletBalance: { increment: refundAmount } } });
  } else if (payment.razorpayPaymentId) {
    // Real (or mocked) Razorpay refund.
    await razorpay.payments.refund(payment.razorpayPaymentId, { amount: refundAmount });
  }

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: { status: isFull ? "REFUNDED" : "PARTIALLY_REFUNDED", refundedAmount: refundAmount },
  });

  await prisma.notification.create({
    data: {
      userId: booking.customer.userId,
      title: "Refund processed",
      body: `₹${(refundAmount / 100).toFixed(2)} has been refunded for booking #${bookingId.slice(-6)}.`,
    },
  });

  return { payment: updated, status: 200 as const };
}

// POST /api/payments/:bookingId/refund — admin-triggered manual refund.
// Body: { amount? } (paise; omit for a full refund).
export async function POST(req: Request, { params }: { params: { bookingId: string } }) {
  const session = await requireRole(["ADMIN"]);
  if (session instanceof NextResponse) return session;

  const { amount } = await req.json().catch(() => ({}));
  const result = await refundBookingPayment(params.bookingId, amount);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.payment);
}
