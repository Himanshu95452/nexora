import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

// NOTE: the Prisma adapter manages Account/Session/User rows for OAuth-style
// flows. Credentials login below issues its own JWT session (adapter is
// still useful if/when a Google/OTP-backed provider is added later).
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login/customer",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or phone", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, // "customer" | "professional" | "admin"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: credentials.email }, { phone: credentials.email }],
          },
        });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        // Enforce that a customer can't log in through the professional
        // portal, etc. — role is passed from which /login/[role] form posted.
        if (credentials.role && user.role.toLowerCase() !== credentials.role.toLowerCase()) {
          return null;
        }

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role as Role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      if (session.user) (session.user as any).id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/** Server-side helper: get the current session in route handlers / server components. */
export function auth() {
  return getServerSession(authOptions);
}
