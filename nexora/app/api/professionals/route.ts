import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/professionals?cityId=&categoryId= — public, powers Featured
// Professionals and the booking flow's "select professional" step.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get("cityId") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const professionals = await prisma.professional.findMany({
    where: {
      kycStatus: "APPROVED",
      ...(cityId ? { cityId } : {}),
      ...(categoryId ? { categoryId } : {}),
    },
    include: { user: { select: { name: true } }, category: true, city: true },
    orderBy: { ratingAvg: "desc" },
  });
  return NextResponse.json(professionals);
}
