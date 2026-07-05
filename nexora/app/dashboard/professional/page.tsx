"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { LayoutDashboard, Briefcase, Wallet, Calendar, ShieldCheck, Shield, Star, PlayCircle, LifeBuoy, MapPin, DollarSign, CheckCircle2, XCircle, Truck, PlayCircle as PlayIcon } from "lucide-react";
import { DashboardShell, StatCard } from "@/components/dashboard/DashboardShell";
import { Seal } from "@/components/ui/Seal";
import { TrustScoreBreakdown } from "@/components/trust/TrustScoreBreakdown";
import { BadgeSystem } from "@/components/trust/BadgeSystem";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const formatCurrency = (paise: number) => `₹${Math.round(paise / 100).toLocaleString("en-IN")}`;

const NAV = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "jobs", label: "Job Requests", icon: Briefcase },
  { key: "earnings", label: "Earnings", icon: Wallet },
  { key: "calendar", label: "Calendar Availability", icon: Calendar },
  { key: "kyc", label: "KYC Status", icon: ShieldCheck },
  { key: "trust", label: "Trust Score", icon: Shield },
  { key: "reviews", label: "Customer Reviews", icon: Star },
  { key: "training", label: "Training Videos", icon: PlayCircle },
  { key: "support", label: "Partner Support", icon: LifeBuoy },
];

const JOBS = [
  { id: "j1", service: "Plumbing — Pipe leak", area: "Dharampeth, Nagpur", pay: 450 },
  { id: "j2", service: "AC Servicing", area: "Civil Lines, Nagpur", pay: 600 },
];

const KYC_STEPS = ["ID Proof Uploaded", "Address Proof Uploaded", "Skill Certificate Verified", "Background Check", "Final Approval"];

export default function ProfessionalDashboardPage() {
  const { data: authSession } = useSession();
  const [tab, setTab] = useState("overview");
  const [online, setOnline] = useState(true);
  const [jobs, setJobs] = useState(JOBS);
  const [realBookings, setRealBookings] = useState<any[] | null>(null);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const bars = [40, 65, 50, 80, 60, 90, 70];

  useEffect(() => {
    if (!authSession?.user) return;
    fetch("/api/bookings").then((r) => r.json()).then((data) => { if (Array.isArray(data)) setRealBookings(data); }).catch(() => {});
  }, [authSession, tab]);

  const respond = (id: string) => setJobs((j) => j.filter((x) => x.id !== id));

  // Advances a real booking through the state machine (Accept/Travel/Start/Complete).
  async function advance(bookingId: string, status: string) {
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
    fetch("/api/bookings").then((r) => r.json()).then((data) => { if (Array.isArray(data)) setRealBookings(data); }).catch(() => {});
  }

  const [myProfile, setMyProfile] = useState<any | null>(null);
  const [earnings, setEarnings] = useState<any | null>(null);
  useEffect(() => {
    if (!authSession?.user) return;
    fetch("/api/professionals/me").then((r) => r.json()).then((data) => { if (!data.error) setMyProfile(data); }).catch(() => {});
    fetch("/api/professionals/earnings").then((r) => r.json()).then((data) => { if (!data.error) setEarnings(data); }).catch(() => {});
  }, [authSession, tab]);

  const activeRealBookings = (realBookings ?? []).filter((b) => !["COMPLETED", "CANCELLED"].includes(b.status));
  const NEXT_ACTION: Record<string, { label: string; to: string; icon: any } | null> = {
    PENDING: { label: "Accept", to: "CONFIRMED", icon: CheckCircle2 },
    CONFIRMED: { label: "Start Traveling", to: "ON_THE_WAY", icon: Truck },
    ON_THE_WAY: { label: "Start Job", to: "IN_PROGRESS", icon: PlayIcon },
    IN_PROGRESS: { label: "Complete Job", to: "COMPLETED", icon: CheckCircle2 },
    COMPLETED: null,
    CANCELLED: null,
  };

  return (
    <DashboardShell navItems={NAV} active={tab} onSelect={setTab} roleLabel="Professional"
      topbarTitle="Good afternoon, Ramesh" topbarSubtitle={online ? "You&apos;re online and receiving jobs" : "You&apos;re offline"}>

      <div className="flex justify-end mb-6">
        <button onClick={() => setOnline(!online)} className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold", online ? "bg-emerald-soft text-emerald-dark dark:bg-emerald-400/10 dark:text-emerald" : "bg-mist text-ink-soft dark:bg-slate-800 dark:text-slate-400")}>
          <span className={cn("w-2 h-2 rounded-full", online ? "bg-emerald" : "bg-slate-400")} /> {online ? "Online" : "Offline"} — tap to toggle
        </button>
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
              <Seal size={44} ringDash={false} />
              <div><p className="font-display text-xl font-bold">92</p><p className="text-xs text-ink-soft dark:text-slate-400">Trust Score</p></div>
            </div>
            <StatCard icon={DollarSign} label="This week" value="₹4,820" sub="+12%" delay={0.05} />
            <StatCard icon={CheckCircle2} label="Jobs completed" value="146" delay={0.1} />
            <StatCard icon={Star} label="Rating" value="4.8" delay={0.15} />
          </div>
          <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <p className="font-display font-semibold mb-4">Profile completion</p>
            <div className="h-2 rounded-full bg-line dark:bg-slate-800 overflow-hidden"><div className="h-full bg-emerald" style={{ width: "80%" }} /></div>
            <p className="text-xs text-ink-soft dark:text-slate-400 mt-2">80% complete — add portfolio photos to reach 100%</p>
          </div>
        </div>
      )}

      {tab === "jobs" && (
        <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {authSession?.user && realBookings !== null ? (
            <>
              {activeRealBookings.length === 0 && <p className="p-6 text-sm text-ink-soft dark:text-slate-400">No active jobs right now.</p>}
              {activeRealBookings.map((b) => {
                const action = NEXT_ACTION[b.status];
                return (
                  <div key={b.id} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0">
                    <div>
                      <p className="font-semibold text-sm">{b.service?.name ?? "Service"}</p>
                      <p className="text-xs mt-0.5 flex items-center gap-1 text-ink-soft dark:text-slate-400"><MapPin size={12} /> {b.address} · <span className="uppercase font-semibold">{b.status.replaceAll("_", " ")}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">₹{Math.round(b.estimatedPrice / 100)}</span>
                      {action && (
                        <button onClick={() => advance(b.id, action.to)} className="text-xs font-semibold text-white px-3 py-2 rounded-full bg-emerald flex items-center gap-1">
                          <action.icon size={12} /> {action.label}
                        </button>
                      )}
                      {b.status === "PENDING" && (
                        <button onClick={() => advance(b.id, "CANCELLED")} className="text-xs font-semibold px-3 py-2 rounded-full border border-line dark:border-slate-700 flex items-center gap-1"><XCircle size={12} /> Reject</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {jobs.length === 0 && <p className="p-6 text-sm text-ink-soft dark:text-slate-400">No pending job requests right now.</p>}
              {jobs.map((j) => (
                <div key={j.id} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0">
                  <div>
                    <p className="font-semibold text-sm">{j.service}</p>
                    <p className="text-xs mt-0.5 flex items-center gap-1 text-ink-soft dark:text-slate-400"><MapPin size={12} /> {j.area}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">₹{j.pay}</span>
                    <button onClick={() => respond(j.id)} className="text-xs font-semibold text-white px-3 py-2 rounded-full bg-emerald flex items-center gap-1"><CheckCircle2 size={12} /> Accept</button>
                    <button onClick={() => setCancelReason(j.id)} className="text-xs font-semibold px-3 py-2 rounded-full border border-line dark:border-slate-700 flex items-center gap-1"><XCircle size={12} /> Reject</button>
                  </div>
                </div>
              ))}
            </>
          )}
          {cancelReason && (
            <div className="p-6 border-t border-line dark:border-slate-800">
              <p className="text-sm font-medium mb-2">Reason for rejecting</p>
              <select className="w-full h-11 px-3 rounded-xl border border-line dark:border-slate-700 bg-transparent text-sm mb-3" onChange={() => { setJobs((j) => j.filter((x) => x.id !== cancelReason)); setCancelReason(null); }}>
                <option value="">Select a reason</option>
                <option>Too far from my location</option>
                <option>Not available at this time</option>
                <option>Outside my skill category</option>
              </select>
            </div>
          )}
        </div>
      )}

      {tab === "earnings" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard icon={DollarSign} label="This week" value={earnings ? formatCurrency(earnings.thisWeek) : "₹4,820"} />
            <StatCard icon={DollarSign} label="This month" value={earnings ? formatCurrency(earnings.thisMonth) : "₹18,650"} delay={0.05} />
            <StatCard icon={Wallet} label="Available for payout" value={myProfile ? formatCurrency(myProfile.walletBalance) : "₹3,200"} delay={0.1} />
          </div>
          <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <p className="font-display font-semibold mb-6">Earnings, last 7 days</p>
            <div className="flex items-end gap-3 h-32">
              {bars.map((h, i) => (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.6, delay: i * 0.06 }} className="flex-1 rounded-t-md" style={{ background: i === 5 ? "#10B981" : "#3556c4", opacity: i === 5 ? 1 : 0.6 }} />
              ))}
            </div>
            <Button variant="ghost" className="mt-6 !text-xs !py-2">Download weekly report</Button>
          </div>
          {earnings?.recentSettlements?.length > 0 && (
            <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="px-6 py-4 border-b border-line dark:border-slate-800"><p className="font-display font-semibold">Recent settlements</p></div>
              {earnings.recentSettlements.map((s: any) => (
                <div key={s.id} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0 text-sm">
                  <div><p className="font-semibold">{s.booking?.service?.name ?? "Booking"}</p><p className="text-xs text-ink-soft dark:text-slate-400">{s.settledAt ? new Date(s.settledAt).toLocaleDateString() : ""} · commission ₹{Math.round((s.platformCommission ?? 0) / 100)}</p></div>
                  <span className="font-semibold">+{formatCurrency(s.professionalPayout ?? 0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "calendar" && (
        <div className="max-w-2xl rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <p className="font-display font-semibold mb-4">This week&apos;s availability</p>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
              <button key={d} className={cn("rounded-xl p-3 text-center border text-xs font-semibold", i !== 3 ? "border-emerald bg-emerald-soft dark:bg-emerald-400/10" : "border-line dark:border-slate-800 opacity-50")}>
                {d}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-soft dark:text-slate-400 mt-4">Tap a day to toggle your availability for new job requests.</p>
        </div>
      )}

      {tab === "kyc" && (
        <div className="max-w-md space-y-4">
          {KYC_STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3 rounded-xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <CheckCircle2 size={18} className={i < 3 ? "text-emerald" : "text-line dark:text-slate-700"} />
              <span className={cn("text-sm font-medium", i >= 3 && "text-ink-soft dark:text-slate-500")}>{s}</span>
              {i === 3 && <span className="ml-auto text-[10px] font-semibold text-amber-700 bg-amber-100 dark:bg-amber-400/10 dark:text-amber-300 px-2 py-1 rounded-full">In progress</span>}
            </div>
          ))}
        </div>
      )}

      {tab === "trust" && (
        <div className="max-w-2xl space-y-8">
          <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-4 mb-6"><Seal size={56} ringDash={false} /><div><p className="font-display text-2xl font-bold">92</p><p className="text-sm text-ink-soft dark:text-slate-400">Overall Trust Score</p></div></div>
            <TrustScoreBreakdown />
          </div>
          <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <p className="font-display font-semibold mb-4">Badge tiers</p>
            <BadgeSystem score={92} />
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-line dark:divide-slate-800 max-w-2xl">
          {[{ n: "Karan M.", r: 5, c: "Fixed the AC quickly, very professional." }, { n: "Sneha D.", r: 4, c: "Good work, arrived slightly late." }].map((rv, i) => (
            <div key={i} className="p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{rv.n}</p>
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} fill={j < rv.r ? "#10B981" : "none"} stroke="#10B981" />)}</div>
              </div>
              <p className="text-sm mt-1.5 text-ink-soft dark:text-slate-400">{rv.c}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "training" && (
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          {["Customer communication basics", "Safety protocols on the job", "Handling payment disputes", "Rating & review best practices"].map((t) => (
            <div key={t} className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-3">
              <PlayCircle size={22} className="text-navy dark:text-blue-400" />
              <p className="text-sm font-medium">{t}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "support" && (
        <div className="max-w-lg rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-5 h-64 flex flex-col justify-end gap-3">
          <div className="self-start bg-mist dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-2 text-sm max-w-[80%]">Hi Ramesh, this is Nexora Partner Support. How can we help?</div>
          <div className="self-end bg-navy text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm max-w-[80%]">My weekly payout hasn&apos;t landed yet</div>
        </div>
      )}
    </DashboardShell>
  );
}
