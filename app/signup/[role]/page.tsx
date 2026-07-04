import { AuthCard, Field } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const LABELS: Record<string, string> = { customer: "Customer", professional: "Professional" };

export default function SignupPage({ params }: { params: { role: string } }) {
  const label = LABELS[params.role] ?? "Customer";
  return (
    <AuthCard title={`Create your ${label} account`} subtitle="Verification happens after sign up — identity, and for professionals, skill and background checks">
      <form className="space-y-1">
        <Field label="Full name" placeholder="Aditi Rao" />
        <Field label="Email" placeholder="you@example.com" />
        <Field label="Phone number" placeholder="+91 98xxxxxxxx" />
        <Field label="Password" type="password" placeholder="Create a password" />
        <Link href="/verify-otp"><Button className="w-full mt-2" type="button">Create Account</Button></Link>
      </form>
      <p className="text-sm text-center mt-6 text-ink-soft dark:text-slate-400">
        Already have an account? <Link href={`/login/${params.role}`} className="font-semibold text-navy dark:text-blue-400">Log in</Link>
      </p>
    </AuthCard>
  );
}
