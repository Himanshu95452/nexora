import { cn } from "@/lib/utils";

const TIER_STYLES: Record<string, string> = {
  Bronze: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Silver: "bg-slate-200 text-slate-700 dark:bg-slate-700/50 dark:text-slate-200",
  Gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Platinum: "bg-emerald-soft text-emerald-dark dark:bg-emerald-900/30 dark:text-emerald-300",
};

export function TierBadge({ tier }: { tier: "Bronze" | "Silver" | "Gold" | "Platinum" }) {
  return (
    <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide", TIER_STYLES[tier])}>
      {tier}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmed: "text-navy bg-navy/10 dark:text-blue-300 dark:bg-blue-400/10",
    Pending: "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-400/10",
    Completed: "text-emerald-dark bg-emerald-soft dark:text-emerald-300 dark:bg-emerald-400/10",
    "In Progress": "text-navy bg-navy/10 dark:text-blue-300 dark:bg-blue-400/10",
    Cancelled: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-400/10",
    Open: "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-400/10",
    "Under Investigation": "text-navy bg-navy/10 dark:text-blue-300 dark:bg-blue-400/10",
    "Refund Approved": "text-emerald-dark bg-emerald-soft dark:text-emerald-300 dark:bg-emerald-400/10",
    Resolved: "text-emerald-dark bg-emerald-soft dark:text-emerald-300 dark:bg-emerald-400/10",
    Rejected: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-400/10",
  };
  return <span className={cn("text-xs font-semibold px-3 py-1 rounded-full", map[status] ?? "text-ink-soft bg-mist")}>{status}</span>;
}
