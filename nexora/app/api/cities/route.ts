import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cities — public, used by city selector on the landing page & booking flow.
export async function GET() {
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(cities);
}
