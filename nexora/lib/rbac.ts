import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";

/**
 * Guard for API route handlers. Usage:
 *
 *   const session = await requireRole(["ADMIN"]);
 *   if (session instanceof NextResponse) return session; // unauthorized
 *
 * Returns the session on success, or a 401/403 NextResponse to return
 * directly from the route handler.
 */
export async function requireRole(allowed: Role[]) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as any).role as Role;
  if (!allowed.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return session;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}
