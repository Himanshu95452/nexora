import { AuthCard, Field } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const LABELS: Record<string, string> = { customer: "Customer", professional: "Professional", admin: "Admin" };

export default function LoginPage({ params }: { params: { role: string } }) {
  const label = LABELS[params.role] ?? "Customer";
  return (
    <AuthCard title={`${label} Login`} subtitle={`Sign in to your Nexora ${label.toLowerCase()} account`}>
      <form className="space-y-1">
        <Field label="Email or phone number" placeholder="you@example.com" />
        <Field label="Password" type="password" placeholder="••••••••" />
        <div className="flex justify-end mb-6">
          <Link href="/forgot-password" className="text-sm font-semibold text-navy dark:text-blue-400">Forgot password?</Link>
        </div>
        <Button className="w-full" type="button">Sign In</Button>
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
