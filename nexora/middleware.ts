import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Maps each protected path prefix to the single role allowed in it.
// Customers cannot reach /dashboard/professional or /dashboard/admin, etc.
// This is enforced here, at the edge, before any page code runs — not left
// to individual pages to remember to check.
const ROLE_FOR_PREFIX: Array<{ prefix: string; role: "CUSTOMER" | "PROFESSIONAL" | "ADMIN" }> = [
  { prefix: "/dashboard/customer", role: "CUSTOMER" },
  { prefix: "/dashboard/professional", role: "PROFESSIONAL" },
  { prefix: "/dashboard/admin", role: "ADMIN" },
];

const DASHBOARD_FOR_ROLE: Record<string, string> = {
  CUSTOMER: "/dashboard/customer",
  PROFESSIONAL: "/dashboard/professional",
  ADMIN: "/dashboard/admin",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const match = ROLE_FOR_PREFIX.find((r) => pathname.startsWith(r.prefix));
  if (!match) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Not logged in at all — send to the login portal for the section they tried to reach.
  if (!token) {
    const loginPath = `/login/${match.role.toLowerCase()}`;
    const url = req.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Logged in, but wrong role for this section — bounce to their own
  // dashboard rather than letting them see a section they don't own.
  if (token.role !== match.role) {
    const url = req.nextUrl.clone();
    url.pathname = DASHBOARD_FOR_ROLE[token.role as string] ?? "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
