import { TierBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const TIERS = [
  { tier: "Bronze" as const, min: 0 },
  { tier: "Silver" as const, min: 70 },
  { tier: "Gold" as const, min: 85 },
  { tier: "Platinum" as const, min: 95 },
];

export function BadgeSystem({ score }: { score: number }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {TIERS.map((t) => {
        const achieved = score >= t.min;
        return (
          <div key={t.tier} className={cn("rounded-xl border p-3 text-center", achieved ? "border-emerald bg-emerald-soft dark:bg-emerald-400/10" : "border-line dark:border-slate-800 opacity-50")}>
            <TierBadge tier={t.tier} />
            <p className="text-[10px] mt-2 text-ink-soft dark:text-slate-400">{t.min}+ score</p>
          </div>
        );
      })}
    </div>
  );
}
