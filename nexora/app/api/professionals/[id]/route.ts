import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/professionals/:id — public profile.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const pro = await prisma.professional.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true } }, category: true, city: true, reviews: true },
  });
  if (!pro) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pro);
}
