import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";
import { createEmailVerificationToken, sendPlaceholderNotification } from "@/lib/tokens";

// POST /api/auth/register
// Body: { name, email, phone, password, role: "customer" | "professional", categoryId?, cityId? }
//
// Creates the base User plus the matching role-profile row. OTP/email
// verification is a placeholder here — see lib/notifications.ts for where a
// real SMS/email provider would be wired in.
export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, password, role, categoryId, cityId } = body ?? {};

  if (!name || !password || (!email && !phone) || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!["customer", "professional"].includes(role)) {
    return NextResponse.json({ error: "Invalid role for self sign-up" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email or phone already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const roleEnum = role.toUpperCase() as Role;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role: roleEnum,
      ...(role === "customer"
        ? { customer: { create: { referralCode: `NEXORA-${name.split(" ")[0].toUpperCase()}${Math.floor(Math.random() * 100)}` } } }
        : {
            professional: {
              create: {
                categoryId,
                cityId,
                kycStatus: "PENDING",
              },
            },
          }),
    },
  });

  if (email) {
    const token = await createEmailVerificationToken(user.id);
    const link = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/verify-email?token=${token}`;
    sendPlaceholderNotification(email, "Verify your Nexora email", link);
  }

  return NextResponse.json({ id: user.id, message: "Account created. Check your email to verify your account." }, { status: 201 });
}
