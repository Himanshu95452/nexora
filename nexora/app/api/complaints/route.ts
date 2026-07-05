import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";

// GET /api/complaints — admin sees all; customer/professional see complaints
// tied to their own bookings.
export async function GET() {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;
  const { role, id: userId } = session.user as any;

  if (role === "ADMIN") {
    const complaints = await prisma.complaint.findMany({ include: { booking: true, raisedBy: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(complaints);
  }

  const complaints = await prisma.complaint.findMany({
    where: { raisedById: userId },
    include: { booking: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(complaints);
}

// POST /api/complaints — customer or professional raises a complaint on a booking.
export async function POST(req: Request) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;
  const { id: userId } = session.user as any;

  const body = await req.json();
  const { bookingId, subject, description } = body ?? {};
  if (!bookingId || !subject || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const complaint = await prisma.complaint.create({
    data: { bookingId, raisedById: userId, subject, description },
  });
  return NextResponse.json(complaint, { status: 201 });
}
