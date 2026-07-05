import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/auth/verify-email?token=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || !record.identifier.startsWith("verify:") || record.expires < new Date()) {
    return NextResponse.json({ error: "This verification link is invalid or has expired" }, { status: 400 });
  }

  const userId = record.identifier.replace("verify:", "");
  await prisma.user.update({ where: { id: userId }, data: { emailVerified: new Date() } });
  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ message: "Email verified successfully." });
}
