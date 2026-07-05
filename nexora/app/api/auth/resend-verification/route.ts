import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEmailVerificationToken, sendPlaceholderNotification } from "@/lib/tokens";

// POST /api/auth/resend-verification  Body: { email }
export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (user && !user.emailVerified) {
    const token = await createEmailVerificationToken(user.id);
    const link = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/verify-email?token=${token}`;
    sendPlaceholderNotification(email, "Verify your Nexora email", link);
  }

  return NextResponse.json({ message: "If this email needs verification, a new link has been sent." });
}
