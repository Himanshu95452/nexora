import { TRUST_BREAKDOWN } from "@/lib/mock-data";

export function TrustScoreBreakdown() {
  return (
    <div className="space-y-4">
      {TRUST_BREAKDOWN.map((item) => {
        const pct = Math.round((item.score / item.weight) * 100);
        return (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium">{item.label}</span>
              <span className="text-ink-soft dark:text-slate-400">{item.score}/{item.weight}</span>
            </div>
            <div className="h-2 rounded-full bg-line dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
