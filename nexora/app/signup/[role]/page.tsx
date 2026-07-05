"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard, Field, FormError } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const LABELS: Record<string, string> = { customer: "Customer", professional: "Professional" };

export default function SignupPage({ params }: { params: { role: string } }) {
  const label = LABELS[params.role] ?? "Customer";
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      password: form.get("password"),
      role: params.role,
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    router.push(`/verify-email?email=${encodeURIComponent(String(payload.email ?? ""))}`);
  }

  return (
    <AuthCard title={`Create your ${label} account`} subtitle="Verification happens after sign up — identity, and for professionals, skill and background checks">
      <form className="space-y-1" onSubmit={onSubmit}>
        <FormError message={error} />
        <Field label="Full name" name="name" placeholder="Aditi Rao" required />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
        <Field label="Phone number" name="phone" placeholder="+91 98xxxxxxxx" />
        <Field label="Password" name="password" type="password" placeholder="Create a password" required />
        <Button className="w-full mt-2" type="submit" disabled={loading}>{loading ? "Creating account…" : "Create Account"}</Button>
      </form>
      <p className="text-sm text-center mt-6 text-ink-soft dark:text-slate-400">
        Already have an account? <Link href={`/login/${params.role}`} className="font-semibold text-navy dark:text-blue-400">Log in</Link>
      </p>
    </AuthCard>
  );
}
