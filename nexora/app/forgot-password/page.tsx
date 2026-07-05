"use client";
import { useState } from "react";
import { AuthCard, Field, FormSuccess, FormError } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: form.get("identifier") }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
    setMessage(data.message);
  }

  return (
    <AuthCard title="Reset your password" subtitle="We'll send a reset link to your registered email or phone">
      <form onSubmit={onSubmit}>
        <FormError message={error} />
        <FormSuccess message={message} />
        <Field label="Email or phone number" name="identifier" placeholder="you@example.com" required />
        <Button className="w-full" type="submit" disabled={loading}>{loading ? "Sending…" : "Send Reset Code"}</Button>
      </form>
      <p className="text-sm text-center mt-6 text-ink-soft dark:text-slate-400">
        Remembered it? <Link href="/login/customer" className="font-semibold text-navy dark:text-blue-400">Back to login</Link>
      </p>
    </AuthCard>
  );
}
