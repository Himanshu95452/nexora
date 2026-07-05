import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePrice } from "@/lib/pricing";

// POST /api/bookings/estimate — the booking flow's "Price Calculation" step.
// Body: { serviceId, emergency? }
// Public: a customer can see pricing before logging in / confirming.
export async function POST(req: Request) {
  const { serviceId, emergency } = await req.json();
  if (!serviceId) return NextResponse.json({ error: "serviceId is required" }, { status: 400 });

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  const breakdown = calculatePrice(service.basePrice, Boolean(emergency));
  return NextResponse.json({ serviceId, serviceName: service.name, ...breakdown });
}
