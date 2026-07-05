import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken, sendPlaceholderNotification } from "@/lib/tokens";

// POST /api/auth/forgot-password  Body: { identifier: email|phone }
//
// Always returns a generic success message, whether or not the account
// exists — this avoids leaking which emails/phones are registered.
export async function POST(req: Request) {
  const { identifier } = await req.json();
  if (!identifier) return NextResponse.json({ error: "Email or phone is required" }, { status: 400 });

  const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { phone: identifier }] } });

  if (user) {
    const token = await createPasswordResetToken(user.id);
    const link = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
    sendPlaceholderNotification(identifier, "Reset your Nexora password", link);
  }

  return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
}
