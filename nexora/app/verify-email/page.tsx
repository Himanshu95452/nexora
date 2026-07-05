"use client";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard, FormError, FormSuccess } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { MailCheck } from "lucide-react";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setStatus("verifying");
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        setStatus(res.ok ? "success" : "error");
        setMessage(data.message ?? data.error);
      })
      .catch(() => { setStatus("error"); setMessage("Something went wrong verifying your email."); });
  }, [token]);

  async function resend() {
    if (!email) return;
    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMessage("A new verification link has been sent.");
  }

  return (
    <AuthCard title={status === "success" ? "Email verified" : "Check your inbox"} subtitle={token ? "Confirming your email address" : "We've sent a verification link to your email address"}>
      <div className="flex justify-center py-4"><MailCheck size={48} className="text-emerald" /></div>
      {status === "success" && <FormSuccess message={message} />}
      {status === "error" && <FormError message={message} />}
      {status !== "success" && <Button className="w-full" type="button" onClick={resend}>Resend Verification Email</Button>}
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
