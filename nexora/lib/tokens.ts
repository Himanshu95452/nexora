import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function makeToken() {
  return crypto.randomBytes(32).toString("hex");
}

/** identifier prefix keeps reset vs. verify tokens from colliding in one table. */
export async function createPasswordResetToken(identifier: string) {
  const token = makeToken();
  await prisma.verificationToken.create({
    data: { identifier: `reset:${identifier}`, token, expires: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
  });
  return token;
}

export async function createEmailVerificationToken(identifier: string) {
  const token = makeToken();
  await prisma.verificationToken.create({
    data: { identifier: `verify:${identifier}`, token, expires: new Date(Date.now() + VERIFY_TOKEN_TTL_MS) },
  });
  return token;
}

/**
 * PLACEHOLDER — logs the link instead of sending a real email/SMS.
 * Swap this for a real provider (Resend, SendGrid, Twilio, etc.) in production.
 */
export function sendPlaceholderNotification(to: string, subject: string, link: string) {
  console.log(`[placeholder-email] To: ${to} | Subject: ${subject} | Link: ${link}`);
}
