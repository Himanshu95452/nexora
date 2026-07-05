"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Calendar, Heart, Wallet, Bell, Gift, Users, MessageCircle, Download, MapPin, Star, DollarSign, Repeat } from "lucide-react";
import { DashboardShell, StatCard } from "@/components/dashboard/DashboardShell";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ComplaintForm } from "@/components/complaint/ComplaintForm";
import { SAMPLE_BOOKINGS, FEATURED_PROFESSIONALS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

const NAV = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "bookings", label: "My Bookings", icon: Calendar },
  { key: "saved", label: "Saved Professionals", icon: Heart },
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "addresses", label: "Saved Addresses", icon: MapPin },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "referral", label: "Referral Program", icon: Users },
  { key: "rewards", label: "Rewards", icon: Gift },
  { key: "support", label: "Support Chat", icon: MessageCircle },
];

export default function CustomerDashboardPage() {
  const { data: authSession } = useSession();
  const [tab, setTab] = useState("overview");
  const [realBookings, setRealBookings] = useState<any[] | null>(null);
  const [ratingDraft, setRatingDraft] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!authSession?.user) return;
    fetch("/api/bookings").then((r) => r.json()).then((data) => { if (Array.isArray(data)) setRealBookings(data); }).catch(() => {});
  }, [authSession, tab]);

  async function submitRating(bookingId: string) {
    const rating = ratingDraft[bookingId];
    if (!rating) return;
    await fetch("/api/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, rating }),
    }).catch(() => {});
    fetch("/api/bookings").then((r) => r.json()).then((data) => { if (Array.isArray(data)) setRealBookings(data); }).catch(() => {});
  }

  const [myProfile, setMyProfile] = useState<any | null>(null);
  const [myPayments, setMyPayments] = useState<any[] | null>(null);
  useEffect(() => {
    if (!authSession?.user) return;
    fetch("/api/customers/me").then((r) => r.json()).then((d) => { if (!d.error) setMyProfile(d); }).catch(() => {});
    fetch("/api/payments").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setMyPayments(d); }).catch(() => {});
  }, [authSession, tab]);

  const usingRealData = authSession?.user && realBookings !== null;
  const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pending", CONFIRMED: "Confirmed", ON_THE_WAY: "In Progress",
    IN_PROGRESS: "In Progress", COMPLETED: "Completed", CANCELLED: "Cancelled",
  };

  return (
    <DashboardShell navItems={NAV} active={tab} onSelect={setTab} roleLabel="Customer" topbarTitle="Welcome back, Aditi" topbarSubtitle="Here's what's happening with your bookings">
      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard icon={Calendar} label="Upcoming bookings" value="2" />
            <StatCard icon={DollarSign} label="Total spent" value="₹6,450" delay={0.05} />
            <StatCard icon={Heart} label="Saved professionals" value="4" delay={0.1} />
          </div>
          <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-6 py-4 border-b border-line dark:border-slate-800 flex items-center justify-between">
              <p className="font-display font-semibold">Recent bookings</p>
              <button onClick={() => setTab("bookings")} className="text-sm font-semibold text-navy dark:text-blue-400">View all</button>
            </div>
            {SAMPLE_BOOKINGS.map((b) => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between border-b border-line dark:border-slate-800 last:border-0">
                <div><p className="font-semibold text-sm">{b.service}</p><p className="text-xs mt-0.5 text-ink-soft dark:text-slate-400">{b.professional} · {b.date}</p></div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {usingRealData ? (
            <>
              {realBookings!.length === 0 && <p className="p-6 text-sm text-ink-soft dark:text-slate-400">You don&apos;t have any bookings yet.</p>}
              {realBookings!.map((b) => (
                <div key={b.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line dark:border-slate-800 last:border-0">
                  <div>
                    <p className="font-semibold text-sm">{b.service?.name ?? "Service"}</p>
                    <p className="text-xs mt-0.5 text-ink-soft dark:text-slate-400">{b.professional?.user?.name ?? "Unassigned"} · {new Date(b.scheduledAt).toLocaleString()} · {b.address}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-sm font-semibold">{formatINR(Math.round(b.estimatedPrice / 100))}</p>
                    <StatusBadge status={STATUS_LABEL[b.status] ?? b.status} />
                    {b.status === "COMPLETED" && (
                      <>
                        <a href={`/invoice/${b.id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold flex items-center gap-1 text-navy dark:text-blue-400"><Download size={12} /> Invoice</a>
                        <button className="text-xs font-semibold flex items-center gap-1 text-emerald-dark dark:text-emerald"><Repeat size={12} /> Rebook</button>
                        {!b.review ? (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <button key={i} onClick={() => setRatingDraft((d) => ({ ...d, [b.id]: i + 1 }))}>
                                <Star size={14} fill={i < (ratingDraft[b.id] ?? 0) ? "#10B981" : "none"} stroke="#10B981" />
                              </button>
                            ))}
                            <button onClick={() => submitRating(b.id)} className="text-xs font-semibold text-navy dark:text-blue-400 ml-1">Rate</button>
                          </div>
                        ) : (
                          <span className="text-xs text-ink-soft dark:text-slate-400 flex items-center gap-1"><Star size={12} fill="#10B981" stroke="none" /> Rated {b.review.rating}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            SAMPLE_BOOKINGS.map((b) => (
              <div key={b.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line dark:border-slate-800 last:border-0">
                <div>
                  <p className="font-semibold text-sm">{b.service}</p>
                  <p className="text-xs mt-0.5 text-ink-soft dark:text-slate-400">{b.professional} · {b.date}, {b.time} · {b.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold">{formatINR(b.price)}</p>
                  <StatusBadge status={b.status} />
                  {b.status === "Completed" && (
                    <>
                      <button className="text-xs font-semibold flex items-center gap-1 text-navy dark:text-blue-400"><Download size={12} /> Invoice</button>
                      <button className="text-xs font-semibold flex items-center gap-1 text-emerald-dark dark:text-emerald"><Repeat size={12} /> Rebook</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "saved" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_PROFESSIONALS.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center font-semibold">{p.avatarInitials}</div>
                <Heart size={16} className="text-emerald" fill="#10B981" />
              </div>
              <p className="font-semibold text-sm mt-3">{p.name}</p>
              <p className="text-xs text-ink-soft dark:text-slate-400">{p.category}</p>
              <div className="flex items-center gap-1 mt-2 text-xs font-semibold"><Star size={11} fill="#10B981" stroke="none" /> {p.rating}</div>
              <Button className="w-full mt-4 !py-2 !text-xs">Book again</Button>
            </div>
          ))}
        </div>
      )}

      {tab === "wallet" && (
        <div className="max-w-md space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-navy to-navy-dark text-white p-6">
            <p className="text-xs text-white/70">Nexora Wallet Balance</p>
            <p className="font-display text-3xl font-bold mt-2">{myProfile ? formatINR(Math.round(myProfile.walletBalance / 100)) : "₹1,250"}</p>
            <div className="flex gap-3 mt-5">
              <Button variant="emerald" className="!py-2 !text-xs flex-1">Add Money</Button>
              <Button variant="ghost" className="!py-2 !text-xs flex-1 !border-white !text-white">Withdraw</Button>
            </div>
          </div>
          <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-line dark:divide-slate-800">
            {myPayments && myPayments.length > 0 ? (
              myPayments.map((p) => (
                <div key={p.id} className="p-4 flex justify-between text-sm">
                  <span>{p.booking?.service?.name ?? "Booking"} · {p.method}</span>
                  <span className="font-semibold">{p.status === "REFUNDED" || p.status === "PARTIALLY_REFUNDED" ? "-" : ""}{formatINR(Math.round(p.amount / 100))} <span className="text-xs text-ink-soft dark:text-slate-400 ml-1">{p.status}</span></span>
                </div>
              ))
            ) : myPayments && myPayments.length === 0 ? (
              <p className="p-4 text-sm text-ink-soft dark:text-slate-400">No payment history yet.</p>
            ) : (
              [{ label: "Cashback — AC Repair booking", amt: "+₹35" }, { label: "Referral bonus", amt: "+₹100" }, { label: "Used on Cleaning booking", amt: "-₹150" }].map((t, i) => (
                <div key={i} className="p-4 flex justify-between text-sm"><span>{t.label}</span><span className="font-semibold">{t.amt}</span></div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "addresses" && (
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          {[{ label: "Home", addr: "Flat 302, Manas Apartments, Dharampeth, Nagpur" }, { label: "Office", addr: "3rd Floor, Civil Lines, Nagpur" }].map((a) => (
            <div key={a.label} className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <p className="text-xs font-semibold uppercase text-emerald-dark dark:text-emerald flex items-center gap-1"><MapPin size={12} /> {a.label}</p>
              <p className="text-sm mt-2">{a.addr}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "notifications" && (
        <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-line dark:divide-slate-800 max-w-2xl">
          {["Your AC Repair booking is confirmed for 6 Jul, 4:00 PM.", "Ramesh K. is on the way for your booking.", "₹100 referral bonus added to your wallet."].map((n, i) => (
            <div key={i} className="p-4 flex items-start gap-3 text-sm"><Bell size={15} className="text-emerald flex-shrink-0 mt-0.5" /> {n}</div>
          ))}
        </div>
      )}

      {tab === "referral" && (
        <div className="max-w-md rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <p className="font-display font-semibold mb-2">Invite friends, earn rewards</p>
          <p className="text-sm text-ink-soft dark:text-slate-400 mb-5">Share your code — you both get ₹100 in Nexora Wallet credit after their first booking.</p>
          <div className="flex items-center rounded-full border border-line dark:border-slate-700 overflow-hidden">
            <span className="flex-1 px-4 py-2.5 text-sm font-mono">NEXORA-ADITI42</span>
            <button className="px-4 py-2.5 bg-navy text-white text-xs font-semibold">Copy</button>
          </div>
        </div>
      )}

      {tab === "rewards" && (
        <div className="max-w-md rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
          <Gift size={36} className="text-emerald mx-auto mb-3" />
          <p className="font-display font-bold text-xl">240 points</p>
          <p className="text-sm text-ink-soft dark:text-slate-400 mt-1">60 more points unlocks a free visit fee waiver</p>
          <div className="h-2 rounded-full bg-line dark:bg-slate-800 mt-4 overflow-hidden"><div className="h-full bg-emerald" style={{ width: "80%" }} /></div>
        </div>
      )}

      {tab === "support" && (
        <div className="max-w-lg space-y-6">
          <div className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-5 h-64 flex flex-col justify-end gap-3 overflow-y-auto">
            <div className="self-start bg-mist dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-2 text-sm max-w-[80%]">Hi Aditi, how can we help today?</div>
            <div className="self-end bg-navy text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm max-w-[80%]">My electrician is running late</div>
            <div className="self-start bg-mist dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-2 text-sm max-w-[80%]">Checking now — they&apos;re 10 minutes away.</div>
          </div>
          <div className="flex gap-2">
            <input placeholder="Type a message" className="flex-1 h-11 px-4 rounded-full border border-line dark:border-slate-700 bg-transparent text-sm outline-none" />
            <Button className="!px-5">Send</Button>
          </div>
          <div>
            <p className="font-display font-semibold mb-3">Raise a complaint</p>
            <ComplaintForm />
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
