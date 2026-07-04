"use client";
import { useState } from "react";
import { Smartphone, CreditCard, Landmark, Wallet, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

const METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone, note: "Pay via Google Pay, PhonePe, Paytm & more" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, note: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Landmark, note: "All major Indian banks" },
  { id: "wallet", label: "Nexora Wallet", icon: Wallet, note: "Balance: ₹1,250" },
  { id: "cash", label: "Cash After Service", icon: Banknote, note: "Available for select services" },
];

export function PaymentMethodSelector({ onSelect }: { onSelect?: (id: string) => void }) {
  const [selected, setSelected] = useState("upi");
  return (
    <div className="space-y-3">
      {METHODS.map((m) => (
        <button
          key={m.id}
          onClick={() => { setSelected(m.id); onSelect?.(m.id); }}
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-colors",
            selected === m.id ? "border-navy bg-navy/5 dark:bg-blue-400/10" : "border-line dark:border-slate-800"
          )}
        >
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", selected === m.id ? "bg-navy text-white" : "bg-mist dark:bg-slate-800 text-ink-soft dark:text-slate-400")}>
            <m.icon size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{m.label}</p>
            <p className="text-xs text-ink-soft dark:text-slate-400">{m.note}</p>
          </div>
          <div className={cn("w-5 h-5 rounded-full border-2 flex-shrink-0", selected === m.id ? "border-navy bg-navy" : "border-line dark:border-slate-700")} />
        </button>
      ))}
    </div>
  );
}
