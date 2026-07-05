"use client";
import { useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthCard, Field, FormError } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const LABELS: Record<string, string> = { customer: "Customer", professional: "Professional", admin: "Admin" };
const DASHBOARD_PATH: Record<string, string> = { customer: "/dashboard/customer", professional: "/dashboard/professional", admin: "/dashboard/admin" };

function LoginForm({ params }: { params: { role: string } }) {
  const label = LABELS[params.role] ?? "Customer";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      role: params.role,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("That email/phone, password, or portal doesn't match an account. Please try again.");
      return;
    }
    const callbackUrl = searchParams.get("callbackUrl") ?? DASHBOARD_PATH[params.role] ?? "/";
    router.push(callbackUrl);
  }

  return (
    <AuthCard title={`${label} Login`} subtitle={`Sign in to your Nexora ${label.toLowerCase()} account`}>
      <form className="space-y-1" onSubmit={onSubmit}>
        <FormError message={error} />
        <Field label="Email or phone number" name="email" placeholder="you@example.com" required />
        <Field label="Password" name="password" type="password" placeholder="••••••••" required />
        <div className="flex justify-end mb-6">
          <Link href="/forgot-password" className="text-sm font-semibold text-navy dark:text-blue-400">Forgot password?</Link>
        </div>
        <Button className="w-full" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</Button>
      </form>
      <p className="text-sm text-center mt-6 text-ink-soft dark:text-slate-400">
        New to Nexora? <Link href={`/signup/${params.role}`} className="font-semibold text-navy dark:text-blue-400">Create an account</Link>
      </p>
      {params.role !== "admin" && (
        <div className="flex justify-center gap-4 mt-4 text-xs text-ink-soft dark:text-slate-400">
          {Object.keys(LABELS).filter((r) => r !== params.role).map((r) => (
            <Link key={r} href={`/login/${r}`} className="hover:text-navy dark:hover:text-blue-400">{LABELS[r]} login</Link>
          ))}
        </div>
      )}
    </AuthCard>
  );
}

export default function LoginPage({ params }: { params: { role: string } }) {
  return (
    <Suspense fallback={null}>
      <LoginForm params={params} />
    </Suspense>
  );
}
