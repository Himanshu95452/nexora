import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// GET /api/professionals/earnings — powers the Professional Earnings
// Dashboard: this week / this month settled totals, wallet balance
// available for payout, and a recent settlement history list.
export async function GET() {
  const session = await requireRole(["PROFESSIONAL"]);
  if (session instanceof NextResponse) return session;
  const { id: userId } = session.user as any;

  const pro = await prisma.professional.findUnique({ where: { userId } });
  if (!pro) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date();
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const settledPayments = await prisma.payment.findMany({
    where: { status: "SETTLED", booking: { professionalId: pro.id } },
    include: { booking: { include: { service: true } } },
    orderBy: { settledAt: "desc" },
  });

  const sum = (from: Date) =>
    settledPayments
      .filter((p) => p.settledAt && p.settledAt >= from)
      .reduce((acc, p) => acc + (p.professionalPayout ?? 0), 0);

  return NextResponse.json({
    walletBalance: pro.walletBalance,
    thisWeek: sum(startOfWeek),
    thisMonth: sum(startOfMonth),
    recentSettlements: settledPayments.slice(0, 10),
  });
}
