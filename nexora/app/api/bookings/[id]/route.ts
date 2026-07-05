import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";
import type { BookingStatus } from "@prisma/client";

// GET /api/bookings/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { customer: { include: { user: true } }, professional: { include: { user: true } }, service: true, payment: true, review: true },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

// The booking engine's state machine. Keys are the *current* status; values
// are the statuses it's legal to move to next, and which role is allowed to
// make that move. This is the single source of truth for the flow:
//
//   PENDING -> (professional) Accepts -> CONFIRMED
//   PENDING -> (professional/customer) Rejects/Cancels -> CANCELLED
//   CONFIRMED -> (professional) Travels -> ON_THE_WAY
//   CONFIRMED -> (customer/professional) Cancels -> CANCELLED
//   ON_THE_WAY -> (professional) Job Started -> IN_PROGRESS
//   IN_PROGRESS -> (professional) Job Completed -> COMPLETED
const TRANSITIONS: Record<BookingStatus, Partial<Record<BookingStatus, Array<"CUSTOMER" | "PROFESSIONAL" | "ADMIN">>>> = {
  PENDING: { CONFIRMED: ["PROFESSIONAL"], CANCELLED: ["PROFESSIONAL", "CUSTOMER", "ADMIN"] },
  CONFIRMED: { ON_THE_WAY: ["PROFESSIONAL"], CANCELLED: ["PROFESSIONAL", "CUSTOMER", "ADMIN"] },
  ON_THE_WAY: { IN_PROGRESS: ["PROFESSIONAL"], CANCELLED: ["ADMIN"] },
  IN_PROGRESS: { COMPLETED: ["PROFESSIONAL"], CANCELLED: ["ADMIN"] },
  COMPLETED: {},
  CANCELLED: {},
};

const NOTIFICATION_COPY: Partial<Record<BookingStatus, { title: string; body: (service: string) => string }>> = {
  CONFIRMED: { title: "Booking confirmed", body: (s) => `Your ${s} professional has accepted the job.` },
  ON_THE_WAY: { title: "Professional on the way", body: (s) => `Your ${s} professional is heading to you now.` },
  IN_PROGRESS: { title: "Job started", body: (s) => `Work has started on your ${s} booking.` },
  COMPLETED: { title: "Service completed", body: (s) => `Your ${s} booking is marked complete. Please rate your experience.` },
  CANCELLED: { title: "Booking cancelled", body: (s) => `Your ${s} booking has been cancelled.` },
};

// PATCH /api/bookings/:id — drives the booking engine's status transitions.
// Body: { status, finalPrice? }
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  const { role, id: userId } = session.user as any;
  const body = await req.json();
  const { status, finalPrice } = body ?? {};

  const booking = await prisma.booking.findUnique({ where: { id: params.id }, include: { service: true } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Ownership check: professionals may only update their own assigned
  // bookings; customers only their own; admins can update any.
  if (role === "PROFESSIONAL") {
    const pro = await prisma.professional.findUnique({ where: { userId } });
    if (!pro || booking.professionalId !== pro.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (role === "CUSTOMER") {
    const customer = await prisma.customer.findUnique({ where: { userId } });
    if (!customer || booking.customerId !== customer.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (status) {
    const allowedNext = TRANSITIONS[booking.status] ?? {};
    const allowedRoles = allowedNext[status as BookingStatus];
    if (!allowedRoles || !allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: `Cannot move booking from ${booking.status} to ${status} as ${role}` },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: {
      ...(status ? { status } : {}),
      ...(finalPrice != null ? { finalPrice } : {}),
    },
  });

  if (status === "COMPLETED" && booking.professionalId) {
    await prisma.professional.update({ where: { id: booking.professionalId }, data: { jobsCompleted: { increment: 1 } } });

    // Cash-after-service: the professional collects payment in person at
    // completion, so mark it collected now. (Simplification: for cash jobs
    // the "settlement" step below then represents commission owed to the
    // platform rather than a wallet credit, since the professional already
    // holds the cash — a real ledger/reconciliation system would track that
    // distinction explicitly.)
    const payment = await prisma.payment.findUnique({ where: { bookingId: booking.id } });
    if (payment?.method === "CASH" && payment.status === "PENDING") {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "SUCCESS" } });
    }
  }

  // Notify the customer of every professional-driven transition (and vice
  // versa for cancellation), matching the flow's downstream steps.
  if (status && NOTIFICATION_COPY[status as BookingStatus]) {
    const customer = await prisma.customer.findUnique({ where: { id: booking.customerId } });
    if (customer) {
      const copy = NOTIFICATION_COPY[status as BookingStatus]!;
      await prisma.notification.create({
        data: { userId: customer.userId, title: copy.title, body: copy.body(booking.service.name) },
      });
    }
  }

  return NextResponse.json(updated);
}
