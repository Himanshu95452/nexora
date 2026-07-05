import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// POST /api/payments/wallet — pay for a booking from the customer's Nexora
// Wallet balance instead of Razorpay. Doesn't touch the payment gateway at
// all; it's an internal ledger transfer.
export async function POST(req: Request) {
  const session = await requireRole(["CUSTOMER"]);
  if (session instanceof NextResponse) return session;
  const { id: userId } = session.user as any;

  const { bookingId } = await req.json();
  if (!bookingId) return NextResponse.json({ error: "bookingId is required" }, { status: 400 });

  const customer = await prisma.customer.findUnique({ where: { userId } });
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!customer || !booking || booking.customerId !== customer.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (customer.walletBalance < booking.estimatedPrice) {
    return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
  }

  const [payment] = await prisma.$transaction([
    prisma.payment.upsert({
      where: { bookingId },
      update: { method: "WALLET", amount: booking.estimatedPrice, status: "SUCCESS", transactionRef: `WALLET-${Date.now()}` },
      create: { bookingId, method: "WALLET", amount: booking.estimatedPrice, status: "SUCCESS", transactionRef: `WALLET-${Date.now()}` },
    }),
    prisma.customer.update({ where: { id: customer.id }, data: { walletBalance: { decrement: booking.estimatedPrice } } }),
  ]);

  return NextResponse.json(payment, { status: 201 });
}
