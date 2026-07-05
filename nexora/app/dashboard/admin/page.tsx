"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LayoutDashboard, ShieldCheck, Users, Calendar, AlertCircle, RotateCcw, BarChart3, DollarSign, MapPin, Percent, ChevronRight, Radio, AlertTriangle } from "lucide-react";
import { DashboardShell, StatCard } from "@/components/dashboard/DashboardShell";
import { StatusBadge } from "@/components/ui/Badge";
import { ComplaintTracker } from "@/components/complaint/ComplaintTracker";
import { CITIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "verification", label: "Verify Professionals", icon: ShieldCheck },
  { key: "customers", label: "Manage Customers", icon: Users },
  { key: "bookings", label: "Manage Bookings", icon: Calendar },
  { key: "complaints", label: "Handle Complaints", icon: AlertCircle },
  { key: "refunds", label: "Refund Management", icon: RotateCcw },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "revenue", label: "Revenue Dashboard", icon: DollarSign },
  { key: "cities", label: "City Management", icon: MapPin },
  { key: "commission", label: "Commission Management", icon: Percent },
  { key: "fraud", label: "Fraud Detection", icon: AlertTriangle },
];

const QUEUE = [
  { name: "Suresh Patil", role: "Electrician", stage: "Background Check" },
  { name: "Meena Rao", role: "Cleaning", stage: "Skill Assessment" },
  { name: "Vikas Joshi", role: "Carpenter", stage: "Identity Verification" },
];

const LIVE_BOOKINGS = [
  { id: "bk9", service: "AC Repair", pro: "Ramesh K.", status: "In Progress" },
  { id: "bk10", service: "Electrician", pro: "Anil V.", status: "Confirmed" },
];

export default function AdminDashboardPage() {
  const { data: authSession } = useSession();
  const [tab, setTab] = useState("overview");
  const [realBookings, setRealBookings] = useState<any[] | null>(null);
  const [pendingPros, setPendingPros] = useState<any[] | null>(null);

  useEffect(() => {
    if (!authSession?.user) return;
    fetch("/api/bookings").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setRealBookings(d); }).catch(() => {});
    fetch("/api/admin/professionals?kycStatus=PENDING").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setPendingPros(d); }).catch(() => {});
  }, [authSession, tab]);

  async function decideVerification(id: string, decision: "APPROVED" | "REJECTED") {
    await fetch(`/api/admin/professionals/${id}/verify`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    }).catch(() => {});
    fetch("/api/admin/professionals?kycStatus=PENDING").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setPendingPros(d); }).catch(() => {});
  }

  async function settlePayment(bookingId: string) {
    await fetch(`/api/bookings/${bookingId}/settle`, { method: "POST" }).catch(() => {});
    fetch("/api/bookings").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setRealBookings(d); }).catch(() => {});
  }

  const usingRealData = authSession?.user && realBookings !== null;
  const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pending", CONFIRMED: "Confirmed", ON_THE_WAY: "In Progress",
    IN_PROGRESS: "In Progress", COMPLETED: "Completed", CANCELLED: "Cancelled",
  };
  const liveBookings = (realBookings ?? []).filter((b) => ["CONFIRMED", "ON_THE_WAY", "IN_PROGRESS"].includes(b.status));

  return (
    <DashboardShell navItems={NAV} active={tab} onSelect={setTab} roleLabel="Admin" topbarTitle="Admin Overview" topbarSubtitle="Nagpur launch market">
      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-4 gap-4">
            <StatCard icon={Calendar} label="Total bookings" value="1,204" sub="+8%" />
            <StatCard icon={Users} label="Active professionals" value="86" delay={0.05} />
            <StatCard icon={ShieldCheck} label="Pending verifications" value="7" delay={0.1} />
            <StatCard icon={DollarSign} label="Revenue, this month" value="₹5.2L" sub="+15%" delay={0.15} />
          </div>
          <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-6 py-4 border-b border-line dark:border-slate-800 flex items-center gap-2"><Radio size={15} className="text-emerald" /><p className="font-display font-semibold">Live bookings</p></div>
            {usingRealData ? (
              <>
                {liveBookings.length === 0 && <p className="p-6 text-sm text-ink-soft dark:text-slate-400">No bookings currently in progress.</p>}
                {liveBookings.map((b) => (
                  <div key={b.id} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0">
                    <div><p className="font-semibold text-sm">{b.service?.name ?? "Service"}</p><p className="text-xs text-ink-soft dark:text-slate-400">{b.professional?.user?.name ?? "Unassigned"}</p></div>
                    <StatusBadge status={STATUS_LABEL[b.status] ?? b.status} />
                  </div>
                ))}
              </>
            ) : (
              LIVE_BOOKINGS.map((b) => (
                <div key={b.id} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0">
                  <div><p className="font-semibold text-sm">{b.service}</p><p className="text-xs text-ink-soft dark:text-slate-400">{b.pro}</p></div>
                  <StatusBadge status={b.status} />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "verification" && (
        <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-6 py-4 border-b border-line dark:border-slate-800 flex items-center justify-between">
            <p className="font-display font-semibold">Verification queue</p>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-soft text-emerald-dark dark:bg-emerald-400/10 dark:text-emerald">{(pendingPros ?? QUEUE).length} pending</span>
          </div>
          {usingRealData ? (
            <>
              {(pendingPros ?? []).length === 0 && <p className="p-6 text-sm text-ink-soft dark:text-slate-400">No professionals awaiting verification.</p>}
              {(pendingPros ?? []).map((q) => (
                <div key={q.id} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0">
                  <div><p className="font-semibold text-sm">{q.user?.name ?? "Professional"}</p><p className="text-xs mt-0.5 text-ink-soft dark:text-slate-400">{q.category?.name ?? "Uncategorized"} · {q.kycStatus.replaceAll("_", " ")}</p></div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => decideVerification(q.id, "APPROVED")} className="text-xs font-semibold text-emerald-dark dark:text-emerald">Approve</button>
                    <button onClick={() => decideVerification(q.id, "REJECTED")} className="text-xs font-semibold text-red-600">Reject</button>
                    <ChevronRight size={16} className="text-ink-soft dark:text-slate-400" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            QUEUE.map((q, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0">
                <div><p className="font-semibold text-sm">{q.name}</p><p className="text-xs mt-0.5 text-ink-soft dark:text-slate-400">{q.role} · {q.stage}</p></div>
                <div className="flex items-center gap-3">
                  <button className="text-xs font-semibold text-emerald-dark dark:text-emerald">Approve</button>
                  <button className="text-xs font-semibold text-red-600">Reject</button>
                  <ChevronRight size={16} className="text-ink-soft dark:text-slate-400" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "customers" && (
        <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {[{ n: "Aditi Rao", b: 6, city: "Nagpur" }, { n: "Karan Mehta", b: 3, city: "Nagpur" }].map((c, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0">
              <div><p className="font-semibold text-sm">{c.n}</p><p className="text-xs text-ink-soft dark:text-slate-400">{c.city}</p></div>
              <p className="text-sm text-ink-soft dark:text-slate-400">{c.b} bookings</p>
            </div>
          ))}
        </div>
      )}

      {tab === "bookings" && (
        <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {usingRealData ? (
            <>
              {(realBookings ?? []).length === 0 && <p className="p-6 text-sm text-ink-soft dark:text-slate-400">No bookings yet.</p>}
              {(realBookings ?? []).map((b) => (
                <div key={b.id} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0">
                  <div><p className="font-semibold text-sm">{b.service?.name ?? "Service"}</p><p className="text-xs text-ink-soft dark:text-slate-400">{b.professional?.user?.name ?? "Unassigned"} · #{b.id.slice(-6)}</p></div>
                  <div className="flex items-center gap-3">
                    {b.status === "COMPLETED" && b.payment?.status === "SUCCESS" && (
                      <button onClick={() => settlePayment(b.id)} className="text-xs font-semibold text-emerald-dark dark:text-emerald">Settle Payment</button>
                    )}
                    {b.payment?.status === "SETTLED" && <span className="text-xs text-ink-soft dark:text-slate-400">Settled</span>}
                    <StatusBadge status={STATUS_LABEL[b.status] ?? b.status} />
                  </div>
                </div>
              ))}
            </>
          ) : (
            LIVE_BOOKINGS.map((b) => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0">
                <div><p className="font-semibold text-sm">{b.service}</p><p className="text-xs text-ink-soft dark:text-slate-400">{b.pro} · #{b.id}</p></div>
                <StatusBadge status={b.status} />
              </div>
            ))
          )}
        </div>
      )}

      {tab === "complaints" && (
        <div className="space-y-6 max-w-3xl">
          <ComplaintTracker withActions />
        </div>
      )}

      {tab === "refunds" && (
        <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden max-w-2xl">
          <div className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800">
            <div><p className="font-semibold text-sm">Booking #bk4 — incomplete job</p><p className="text-xs text-ink-soft dark:text-slate-400">Requested ₹300 partial refund</p></div>
            <div className="flex gap-3"><button className="text-xs font-semibold text-emerald-dark dark:text-emerald">Approve</button><button className="text-xs font-semibold text-red-600">Deny</button></div>
          </div>
        </div>
      )}

      {tab === "analytics" && (
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard icon={BarChart3} label="Booking conversion" value="64%" />
          <StatCard icon={Users} label="Repeat customer rate" value="41%" delay={0.05} />
          <StatCard icon={ShieldCheck} label="Avg. verification time" value="2.4 days" delay={0.1} />
        </div>
      )}

      {tab === "revenue" && (
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard icon={DollarSign} label="Gross bookings value" value="₹5.2L" />
          <StatCard icon={Percent} label="Commission earned" value="₹78,000" delay={0.05} />
          <StatCard icon={DollarSign} label="Payouts settled" value="₹4.1L" delay={0.1} />
        </div>
      )}

      {tab === "cities" && (
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
          {CITIES.map((c) => (
            <div key={c} className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2"><MapPin size={16} className="text-navy dark:text-blue-400" /><span className="font-semibold text-sm">{c}</span></div>
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", c === "Nagpur" ? "bg-emerald-soft text-emerald-dark dark:bg-emerald-400/10 dark:text-emerald" : "bg-mist text-ink-soft dark:bg-slate-800 dark:text-slate-400")}>
                {c === "Nagpur" ? "Live" : "Planned"}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "commission" && (
        <div className="max-w-md rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <p className="font-display font-semibold mb-4">Commission by category</p>
          {["Plumbing", "Electrician", "AC Repair", "Carpenter", "Cleaning", "Appliance Repair"].map((c) => (
            <div key={c} className="flex items-center justify-between py-2 text-sm border-b border-line dark:border-slate-800 last:border-0">
              <span>{c}</span><span className="font-semibold">15%</span>
            </div>
          ))}
        </div>
      )}

      {tab === "fraud" && (
        <div className="max-w-2xl rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4"><AlertTriangle size={18} className="text-amber-600" /><p className="font-display font-semibold">Flagged for review</p></div>
          <div className="text-sm space-y-3">
            <div className="flex justify-between border-b border-line dark:border-slate-800 pb-3"><span>Duplicate payout account detected</span><span className="text-ink-soft dark:text-slate-400">Professional #P112</span></div>
            <div className="flex justify-between"><span>Unusual cancellation pattern</span><span className="text-ink-soft dark:text-slate-400">Customer #C048</span></div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
