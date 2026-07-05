import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay-verify";

// POST /api/webhooks/razorpay — source of truth for payment state. Configure
// this URL in the Razorpay dashboard, subscribed to at least:
// payment.captured, payment.failed, refund.processed.
//
// Reads the raw body (not req.json()) because signature verification is
// computed over the exact bytes Razorpay sent, not a re-serialized object.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  switch (event.event) {
    case "payment.captured": {
      const orderId = event.payload?.payment?.entity?.order_id;
      const paymentId = event.payload?.payment?.entity?.id;
      if (!orderId) break;
      const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } });
      // Idempotent: a client-side /verify call may have already marked this SUCCESS.
      if (payment && payment.status !== "SUCCESS" && payment.status !== "SETTLED") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "SUCCESS", razorpayPaymentId: paymentId, transactionRef: paymentId },
        });
      }
      break;
    }
    case "payment.failed": {
      const orderId = event.payload?.payment?.entity?.order_id;
      if (!orderId) break;
      const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } });
      if (payment && payment.status === "PENDING") {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
      }
      break;
    }
    case "refund.processed": {
      const paymentId = event.payload?.refund?.entity?.payment_id;
      const refundAmount = event.payload?.refund?.entity?.amount;
      if (!paymentId) break;
      const payment = await prisma.payment.findFirst({ where: { razorpayPaymentId: paymentId } });
      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: refundAmount >= payment.amount ? "REFUNDED" : "PARTIALLY_REFUNDED",
            refundedAmount: refundAmount,
          },
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
