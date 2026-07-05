import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { razorpay, RAZORPAY_KEY_ID, usingMockGateway } from "@/lib/razorpay";

// POST /api/payments/razorpay/order — Booking Payment step (UPI/Card/Net
// Banking). Creates a Razorpay Order and a matching local Payment row in
// PENDING status keyed by razorpayOrderId, so the webhook can find it even
// if the client never calls /verify (e.g. the tab closes after paying).
export async function POST(req: Request) {
  const session = await requireRole(["CUSTOMER"]);
  if (session instanceof NextResponse) return session;
  const { id: userId } = session.user as any;

  const { bookingId, method } = await req.json();
  if (!bookingId) return NextResponse.json({ error: "bookingId is required" }, { status: 400 });

  const customer = await prisma.customer.findUnique({ where: { userId } });
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!customer || !booking || booking.customerId !== customer.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const order = await razorpay.orders.create({
    amount: booking.estimatedPrice, // paise
    currency: "INR",
    receipt: bookingId,
    notes: { bookingId },
  });

  await prisma.payment.upsert({
    where: { bookingId },
    update: { method: method ?? "CARD", amount: booking.estimatedPrice, status: "PENDING", razorpayOrderId: order.id },
    create: { bookingId, method: method ?? "CARD", amount: booking.estimatedPrice, status: "PENDING", razorpayOrderId: order.id },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: RAZORPAY_KEY_ID,
    mock: usingMockGateway,
  });
}
