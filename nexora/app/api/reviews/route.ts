import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { settleBookingPayment } from "@/app/api/bookings/[id]/settle/route";

// POST /api/reviews — the booking flow's "Rating & Review" step.
export async function POST(req: Request) {
  const session = await requireRole(["CUSTOMER"]);
  if (session instanceof NextResponse) return session;

  const { id: userId } = session.user as any;
  const body = await req.json();
  const { bookingId, rating, comment } = body ?? {};
  if (!bookingId || !rating) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const customer = await prisma.customer.findUnique({ where: { userId } });
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!customer || !booking || booking.customerId !== customer.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!booking.professionalId) {
    return NextResponse.json({ error: "Booking has no assigned professional" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: { bookingId, customerId: customer.id, professionalId: booking.professionalId, rating, comment },
  });

  // Recompute the professional's average rating.
  const agg = await prisma.review.aggregate({ where: { professionalId: booking.professionalId }, _avg: { rating: true } });
  await prisma.professional.update({
    where: { id: booking.professionalId },
    data: { ratingAvg: agg._avg.rating ?? rating },
  });

  // Final step of the booking engine: settle payment now that the customer
  // has rated the job. Settlement failures here (e.g. cash booking with no
  // payment record yet) don't block the review itself — an admin can settle
  // manually via POST /api/bookings/:id/settle as a fallback.
  const settlement = await settleBookingPayment(bookingId);

  return NextResponse.json({ review, settlement: "error" in settlement ? { skipped: settlement.error } : settlement }, { status: 201 });
}
