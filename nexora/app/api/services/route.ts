import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/services?categoryId=... — public.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const services = await prisma.service.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(services);
}
