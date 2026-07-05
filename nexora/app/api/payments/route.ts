import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/rbac";

// GET /api/payments — Payment History. Role-aware:
// - customer: payments on their own bookings
// - professional: payments on bookings assigned to them (their earnings trail)
// - admin: everything
export async function GET() {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;
  const { role, id: userId } = session.user as any;

  if (role === "ADMIN") {
    const payments = await prisma.payment.findMany({
      include: { booking: { include: { service: true, customer: { include: { user: true } }, professional: { include: { user: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(payments);
  }

  if (role === "CUSTOMER") {
    const customer = await prisma.customer.findUnique({ where: { userId } });
    if (!customer) return NextResponse.json([]);
    const payments = await prisma.payment.findMany({
      where: { booking: { customerId: customer.id } },
      include: { booking: { include: { service: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(payments);
  }

  if (role === "PROFESSIONAL") {
    const pro = await prisma.professional.findUnique({ where: { userId } });
    if (!pro) return NextResponse.json([]);
    const payments = await prisma.payment.findMany({
      where: { booking: { professionalId: pro.id } },
      include: { booking: { include: { service: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(payments);
  }

  return NextResponse.json([]);
}

// POST /api/payments — Cash After Service only now. Prepaid methods go
// through /api/payments/razorpay/order + /verify; wallet payments go
// through /api/payments/wallet.
export async function POST(req: Request) {
  const session = await requireRole(["CUSTOMER"]);
  if (session instanceof NextResponse) return session;

  const { bookingId } = await req.json();
  if (!bookingId) return NextResponse.json({ error: "bookingId is required" }, { status: 400 });

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const payment = await prisma.payment.upsert({
    where: { bookingId },
    update: { method: "CASH", amount: booking.estimatedPrice, status: "PENDING" },
    create: { bookingId, method: "CASH", amount: booking.estimatedPrice, status: "PENDING" },
  });

  return NextResponse.json(payment, { status: 201 });
}
