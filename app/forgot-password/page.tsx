import { AuthCard, Field } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset your password" subtitle="We'll send a verification code to your registered email or phone">
      <Field label="Email or phone number" placeholder="you@example.com" />
      <Link href="/verify-otp"><Button className="w-full" type="button">Send Reset Code</Button></Link>
      <p className="text-sm text-center mt-6 text-ink-soft dark:text-slate-400">
        Remembered it? <Link href="/login/customer" className="font-semibold text-navy dark:text-blue-400">Back to login</Link>
      </p>
    </AuthCard>
  );
}
