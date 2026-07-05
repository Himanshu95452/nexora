"use client";
import { useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard, Field, FormError, FormSuccess } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const password = form.get("password");
    const confirm = form.get("confirm");
    if (password !== confirm) {
      setLoading(false);
      setError("Passwords don't match.");
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
    setMessage(data.message);
    setTimeout(() => router.push("/login/customer"), 1500);
  }

  if (!token) {
    return (
      <AuthCard title="Invalid link" subtitle="This password reset link is missing its token.">
        <FormError message="Request a new reset link from the forgot password page." />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" subtitle="Make it something you haven't used before">
      <form onSubmit={onSubmit}>
        <FormError message={error} />
        <FormSuccess message={message} />
        <Field label="New password" name="password" type="password" placeholder="••••••••" required />
        <Field label="Confirm new password" name="confirm" type="password" placeholder="••••••••" required />
        <Button className="w-full" type="submit" disabled={loading}>{loading ? "Updating…" : "Update Password"}</Button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
