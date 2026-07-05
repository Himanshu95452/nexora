import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { verifyPaymentSignature } from "@/lib/razorpay-verify";

// POST /api/payments/razorpay/verify — called by the client right after
// Razorpay Checkout's success handler fires. This is a fast-path for
// immediate UI feedback; the webhook (app/api/webhooks/razorpay) is the
// source of truth and will independently mark the same payment SUCCESS if
// this call never happens.
export async function POST(req: Request) {
  const session = await requireRole(["CUSTOMER"]);
  if (session instanceof NextResponse) return session;

  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
  if (!bookingId || !razorpay_order_id || !razorpay_payment_id) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { bookingId } });
  if (!payment || payment.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Order does not match this booking's payment record" }, { status: 400 });
  }

  const valid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature ?? "");
  if (!valid) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "SUCCESS", razorpayPaymentId: razorpay_payment_id, transactionRef: razorpay_payment_id },
  });

  return NextResponse.json(updated);
}
