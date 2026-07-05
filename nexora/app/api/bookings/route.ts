import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/rbac";
import { calculatePrice } from "@/lib/pricing";

// GET /api/bookings — role-aware listing.
// - customer: their own bookings
// - professional: bookings assigned to them
// - admin: all bookings
export async function GET() {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  const { role, id: userId } = session.user as any;

  if (role === "ADMIN") {
    const bookings = await prisma.booking.findMany({
      include: { customer: { include: { user: true } }, professional: { include: { user: true } }, service: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  }

  if (role === "CUSTOMER") {
    const customer = await prisma.customer.findUnique({ where: { userId } });
    if (!customer) return NextResponse.json([]);
    const bookings = await prisma.booking.findMany({
      where: { customerId: customer.id },
      include: { professional: { include: { user: true } }, service: true, payment: true, review: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  }

  if (role === "PROFESSIONAL") {
    const pro = await prisma.professional.findUnique({ where: { userId } });
    if (!pro) return NextResponse.json([]);
    const bookings = await prisma.booking.findMany({
      where: { professionalId: pro.id },
      include: { customer: { include: { user: true } }, service: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  }

  return NextResponse.json([]);
}

// POST /api/bookings — customer creates a new booking (the "Booking
// Confirmation" step of the booking engine). Professional assignment can be
// provided directly (customer picked one) or left null for auto-assignment.
// Price is recomputed server-side from the service's base price — the
// client's estimate (from /api/bookings/estimate) is for display only and
// is never trusted directly.
export async function POST(req: Request) {
  const session = await requireRole(["CUSTOMER"]);
  if (session instanceof NextResponse) return session;

  const { id: userId } = session.user as any;
  const body = await req.json();
  const { serviceId, professionalId, cityId, scheduledAt, address, emergency } = body ?? {};

  if (!serviceId || !cityId || !scheduledAt || !address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [customer, service] = await Promise.all([
    prisma.customer.findUnique({ where: { userId } }),
    prisma.service.findUnique({ where: { id: serviceId } }),
  ]);
  if (!customer) return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  const { total } = calculatePrice(service.basePrice, Boolean(emergency));

  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      professionalId: professionalId ?? null,
      serviceId,
      cityId,
      scheduledAt: new Date(scheduledAt),
      address,
      estimatedPrice: total,
      status: "PENDING",
    },
  });

  if (professionalId) {
    const pro = await prisma.professional.findUnique({ where: { id: professionalId } });
    if (pro) {
      await prisma.notification.create({
        data: { userId: pro.userId, title: "New booking request", body: `${service.name} requested for ${new Date(scheduledAt).toLocaleString()}.` },
      });
    }
  }

  return NextResponse.json(booking, { status: 201 });
}
