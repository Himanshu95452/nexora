import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// GET /api/customers/me — the signed-in customer's own record (wallet
// balance, referral code, rewards points).
export async function GET() {
  const session = await requireRole(["CUSTOMER"]);
  if (session instanceof NextResponse) return session;
  const { id: userId } = session.user as any;

  const customer = await prisma.customer.findUnique({ where: { userId } });
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(customer);
}
