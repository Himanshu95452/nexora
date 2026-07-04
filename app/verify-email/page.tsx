import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <AuthCard title="Check your inbox" subtitle="We've sent a verification link to your email address">
      <div className="flex justify-center py-4"><MailCheck size={48} className="text-emerald" /></div>
      <Button className="w-full" type="button">Resend Verification Email</Button>
    </AuthCard>
  );
}
