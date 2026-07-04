import { StatusBadge } from "@/components/ui/Badge";
import { SAMPLE_COMPLAINTS } from "@/lib/mock-data";

export function ComplaintTracker({ withActions = false }: { withActions?: boolean }) {
  return (
    <div className="rounded-2xl border border-line dark:border-slate-800 overflow-hidden">
      {SAMPLE_COMPLAINTS.map((c) => (
        <div key={c.id} className="p-4 border-b border-line dark:border-slate-800 last:border-0 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{c.subject}</p>
            <p className="text-xs text-ink-soft dark:text-slate-400 mt-0.5">Booking {c.bookingId} · Raised by {c.raisedBy} · {c.date}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <StatusBadge status={c.status} />
            {withActions && <button className="text-xs font-semibold text-navy dark:text-blue-400">Investigate</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
