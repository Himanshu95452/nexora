"use client";
import { AuthCard } from "@/components/auth/AuthCard";
import { OTPInput } from "@/components/auth/OTPInput";
import { Button } from "@/components/ui/Button";

export default function VerifyOtpPage() {
  return (
    <AuthCard title="Enter verification code" subtitle="We sent a 4-digit code to your phone number ending in ••42">
      <OTPInput length={4} />
      <Button className="w-full mt-8" type="button">Verify</Button>
      <p className="text-sm text-center mt-6 text-ink-soft dark:text-slate-400">
        Didn&apos;t get a code? <button className="font-semibold text-navy dark:text-blue-400">Resend</button>
      </p>
    </AuthCard>
  );
}
