"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Wrench, Zap, Wind, Hammer, Sparkles, Settings, Star, ShieldCheck, Calendar, Clock, CheckCircle2, Truck, ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { CITIES, LAUNCH_CITY, FEATURED_PROFESSIONALS } from "@/lib/mock-data";
import { formatINR, cn } from "@/lib/utils";

// Fallback, rupee-denominated catalog shown until the real API responds (or
// if it can't be reached) — keeps the wizard fully demoable without a DB.
const FALLBACK_SERVICES = [
  { id: null as string | null, name: "Plumbing", icon: Wrench, price: 199 },
  { id: null as string | null, name: "Electrician", icon: Zap, price: 149 },
  { id: null as string | null, name: "AC Repair", icon: Wind, price: 349 },
  { id: null as string | null, name: "Carpenter", icon: Hammer, price: 249 },
  { id: null as string | null, name: "Cleaning", icon: Sparkles, price: 399 },
  { id: null as string | null, name: "Appliance Repair", icon: Settings, price: 299 },
];
const CATEGORY_ICONS: Record<string, any> = { Plumbing: Wrench, Electrician: Zap, "AC Repair": Wind, Carpenter: Hammer, Cleaning: Sparkles, "Appliance Repair": Settings };

type ServiceOption = { id: string | null; name: string; icon: any; price: number };
type ProOption = { id: string; name: string; avatarInitials: string; rating: number; jobsCompleted: number; startingPrice: number };

const STEP_LABELS = ["City", "Service", "Professional", "Date, Time & Address", "Estimate", "Confirm", "Payment", "Tracking", "Completed", "Review"];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/** Opens the real Razorpay Checkout widget and verifies the payment server-side on success. */
async function openRazorpayCheckout(order: { orderId: string; amount: number; currency: string; keyId: string }, bookingId: string): Promise<boolean> {
  const loaded = await loadRazorpayScript();
  if (!loaded) return false;

  return new Promise((resolve) => {
    const rzp = new (window as any).Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "Nexora",
      description: "Home service booking payment",
      theme: { color: "#1E3A8A" },
      handler: async (response: any) => {
        const verifyRes = await fetch("/api/payments/razorpay/verify", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, ...response }),
        });
        resolve(verifyRes.ok);
      },
      modal: { ondismiss: () => resolve(false) },
    });
    rzp.open();
  });
}

export default function BookPage() {
  const { data: authSession } = useSession();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState(LAUNCH_CITY);
  const [cityId, setCityId] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceOption[]>(FALLBACK_SERVICES);
  const [professionals, setProfessionals] = useState<ProOption[]>(FEATURED_PROFESSIONALS as any);
  const [service, setService] = useState<ServiceOption | null>(null);
  const [pro, setPro] = useState<ProOption | null>(null);
  const [date, setDate] = useState("6 Jul 2026");
  const [time, setTime] = useState("4:00 PM");
  const [address, setAddress] = useState("");
  const [emergency] = useState(false);
  const [estimate, setEstimate] = useState({ basePrice: 0, visitFee: 49, total: 0 });
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Load the real catalog + city IDs once, falling back silently to the
  // rupee-denominated mock data above if there's no reachable API/DB.
  useEffect(() => {
    fetch("/api/cities").then((r) => r.json()).then((cities: Array<{ id: string; name: string }>) => {
      const match = cities.find((c) => c.name === LAUNCH_CITY);
      if (match) setCityId(match.id);
    }).catch(() => {});

    fetch("/api/services").then((r) => r.json()).then((list: Array<{ id: string; name: string; basePrice: number }>) => {
      if (Array.isArray(list) && list.length) {
        setServices(list.map((s) => ({ id: s.id, name: s.name, icon: CATEGORY_ICONS[s.name] ?? Settings, price: Math.round(s.basePrice / 100) })));
      }
    }).catch(() => {});
  }, []);

  // Real professionals for the selected city, once we know its ID.
  useEffect(() => {
    if (!cityId) return;
    fetch(`/api/professionals?cityId=${cityId}`).then((r) => r.json()).then((list: any[]) => {
      if (Array.isArray(list) && list.length) {
        setProfessionals(list.map((p) => ({
          id: p.id,
          name: p.user?.name ?? "Nexora Professional",
          avatarInitials: (p.user?.name ?? "NP").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
          rating: p.ratingAvg || 4.8,
          jobsCompleted: p.jobsCompleted,
          startingPrice: service ? service.price : 199,
        })));
      }
    }).catch(() => {});
  }, [cityId, service]);

  const next = async () => {
    setError(null);

    // Leaving "Date, Time & Address" -> fetch the real price estimate.
    if (step === 3) {
      if (service?.id) {
        try {
          setBusy(true);
          const res = await fetch("/api/bookings/estimate", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serviceId: service.id, emergency }),
          });
          const data = await res.json();
          if (res.ok) setEstimate({ basePrice: data.basePrice / 100, visitFee: data.visitFee / 100, total: data.total / 100 });
          else setEstimate({ basePrice: service?.price ?? 0, visitFee: 49, total: (service?.price ?? 0) + 49 });
        } catch { setEstimate({ basePrice: service?.price ?? 0, visitFee: 49, total: (service?.price ?? 0) + 49 }); }
        finally { setBusy(false); }
      } else {
        setEstimate({ basePrice: service?.price ?? 0, visitFee: 49, total: (service?.price ?? 0) + 49 });
      }
    }

    // Leaving "Confirm" -> create the real booking (Booking Confirmation step).
    if (step === 5) {
      if (service?.id && cityId && authSession?.user) {
        try {
          setBusy(true);
          const scheduledAt = new Date(`${date} ${time}`);
          const res = await fetch("/api/bookings", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serviceId: service.id,
              professionalId: pro?.id ?? null,
              cityId,
              scheduledAt: isNaN(scheduledAt.getTime()) ? new Date(Date.now() + 86400000).toISOString() : scheduledAt.toISOString(),
              address: address || "Address not provided",
              emergency,
            }),
          });
          const data = await res.json();
          if (res.ok) setBookingId(data.id);
          else setError(data.error ?? "Could not create booking.");
        } catch { setError("Could not reach the booking service."); }
        finally { setBusy(false); }
      }
    }

    // Leaving "Payment" -> charge via the method the customer picked.
    if (step === 6 && bookingId) {
      setBusy(true);
      try {
        if (paymentMethod === "cash") {
          await fetch("/api/payments", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId }),
          });
        } else if (paymentMethod === "wallet") {
          const res = await fetch("/api/payments/wallet", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId }),
          });
          if (!res.ok) { const d = await res.json(); setError(d.error ?? "Wallet payment failed."); setBusy(false); return; }
        } else {
          // upi / card / netbanking — via Razorpay.
          const orderRes = await fetch("/api/payments/razorpay/order", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId, method: paymentMethod.toUpperCase() }),
          });
          const order = await orderRes.json();
          if (!orderRes.ok) { setError(order.error ?? "Could not start payment."); setBusy(false); return; }

          if (order.mock) {
            // No real Razorpay account configured — simulate a successful
            // charge without opening the Checkout widget (see lib/razorpay.ts).
            await fetch("/api/payments/razorpay/verify", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bookingId, razorpay_order_id: order.orderId, razorpay_payment_id: `pay_mock_${Date.now()}`, razorpay_signature: "mock" }),
            });
          } else {
            const paid = await openRazorpayCheckout(order, bookingId);
            if (!paid) { setError("Payment was not completed."); setBusy(false); return; }
          }
        }
      } catch { setError("Could not reach the payment service."); setBusy(false); return; }
      finally { setBusy(false); }
    }

    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Lightweight live-status poll while on Tracking/Completed — reflects real
  // updates once a professional (on their own dashboard) accepts, travels,
  // starts, and completes the job. Doesn't block the wizard's own animation.
  useEffect(() => {
    if (!bookingId || (step !== 7 && step !== 8)) return;
    const id = setInterval(() => {
      fetch(`/api/bookings/${bookingId}`).then((r) => r.json()).then((b) => { if (b?.status) setLiveStatus(b.status); }).catch(() => {});
    }, 5000);
    return () => clearInterval(id);
  }, [bookingId, step]);

  async function submitReview() {
    if (!bookingId) { setStep((s) => s); return; }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Could not submit review.");
    } catch { setError("Could not reach the review service."); }
    finally { setBusy(false); }
  }

  const { basePrice, visitFee, total } = estimate;

  return (
    <div className="min-h-screen bg-mist dark:bg-slate-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* progress */}
        <div className="flex items-center gap-1.5 mb-10 overflow-x-auto pb-2">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5 flex-shrink-0">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold", i <= step ? "bg-navy text-white" : "bg-white dark:bg-slate-800 text-ink-soft dark:text-slate-500 border border-line dark:border-slate-700")}>
                {i < step ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              {i < STEP_LABELS.length - 1 && <div className={cn("w-5 h-px", i < step ? "bg-navy" : "bg-line dark:bg-slate-700")} />}
            </div>
          ))}
        </div>

        {!authSession?.user && (
          <div className="mb-6 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-400/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
            You&apos;re browsing the booking flow without being signed in — you can preview every step, but creating a real booking requires a customer account.
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 p-7 sm:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-dark dark:text-emerald mb-1">Step {step + 1} of {STEP_LABELS.length}</p>
            <h1 className="font-display text-2xl font-bold mb-6">{STEP_LABELS[step]}</h1>
            {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-400/10 rounded-lg px-3 py-2 mb-4">{error}</p>}

            {step === 0 && (
              <div className="grid grid-cols-2 gap-3">
                {CITIES.map((c) => (
                  <button key={c} disabled={c !== LAUNCH_CITY} onClick={() => setCity(c)}
                    className={cn("p-4 rounded-2xl border text-left flex items-center gap-3 disabled:opacity-40",
                      city === c ? "border-navy bg-navy/5 dark:bg-blue-400/10" : "border-line dark:border-slate-800")}>
                    <MapPin size={16} /> <span className="font-semibold text-sm">{c}</span>
                    {c !== LAUNCH_CITY && <span className="text-[10px] text-ink-soft ml-auto">Soon</span>}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map((s) => (
                  <button key={s.name} onClick={() => setService(s)}
                    className={cn("p-4 rounded-2xl border text-left flex items-center gap-3",
                      service?.name === s.name ? "border-navy bg-navy/5 dark:bg-blue-400/10" : "border-line dark:border-slate-800")}>
                    <s.icon size={18} className="text-navy dark:text-blue-400" />
                    <div><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-ink-soft dark:text-slate-400">From {formatINR(s.price)}</p></div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {professionals.map((p) => (
                  <button key={p.id} onClick={() => setPro(p)}
                    className={cn("w-full p-4 rounded-2xl border flex items-center gap-4 text-left",
                      pro?.id === p.id ? "border-navy bg-navy/5 dark:bg-blue-400/10" : "border-line dark:border-slate-800")}>
                    <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center font-semibold flex-shrink-0">{p.avatarInitials}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm flex items-center gap-1.5">{p.name} <ShieldCheck size={13} className="text-emerald" /></p>
                      <p className="text-xs text-ink-soft dark:text-slate-400 flex items-center gap-1"><Star size={11} fill="#10B981" stroke="none" /> {p.rating} · {p.jobsCompleted} jobs</p>
                    </div>
                    <p className="text-sm font-semibold">{formatINR(p.startingPrice)}+</p>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid sm:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-sm font-medium flex items-center gap-1.5 mb-2"><Calendar size={14} /> Date</span>
                  <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-line dark:border-slate-700 bg-transparent text-sm outline-none focus:border-navy" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium flex items-center gap-1.5 mb-2"><Clock size={14} /> Time</span>
                  <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-line dark:border-slate-700 bg-transparent text-sm outline-none focus:border-navy" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium flex items-center gap-1.5 mb-2"><Home size={14} /> Address</span>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Flat, street, area" className="w-full h-12 px-4 rounded-xl border border-line dark:border-slate-700 bg-transparent text-sm outline-none focus:border-navy" />
                </label>
              </div>
            )}

            {step === 4 && (
              <div className="rounded-2xl border border-line dark:border-slate-800 divide-y divide-line dark:divide-slate-800">
                <div className="flex justify-between p-4 text-sm"><span className="text-ink-soft dark:text-slate-400">{service?.name ?? "Service"} charge</span><span className="font-semibold">{formatINR(basePrice)}</span></div>
                <div className="flex justify-between p-4 text-sm"><span className="text-ink-soft dark:text-slate-400">Visit fee</span><span className="font-semibold">{formatINR(visitFee)}</span></div>
                <div className="flex justify-between p-4 text-sm font-bold"><span>Estimated total</span><span>{formatINR(total)}</span></div>
                <p className="text-xs text-ink-soft dark:text-slate-400 p-4">Final price may vary slightly based on the actual work required, always confirmed with you before it begins.</p>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-line dark:border-slate-800 p-5 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-ink-soft dark:text-slate-400">City</span><span className="font-semibold">{city}</span></div>
                  <div className="flex justify-between"><span className="text-ink-soft dark:text-slate-400">Service</span><span className="font-semibold">{service?.name ?? "—"}</span></div>
                  <div className="flex justify-between"><span className="text-ink-soft dark:text-slate-400">Professional</span><span className="font-semibold">{pro?.name ?? "—"}</span></div>
                  <div className="flex justify-between"><span className="text-ink-soft dark:text-slate-400">Date & time</span><span className="font-semibold">{date}, {time}</span></div>
                  <div className="flex justify-between"><span className="text-ink-soft dark:text-slate-400">Address</span><span className="font-semibold">{address || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-ink-soft dark:text-slate-400">Total</span><span className="font-semibold">{formatINR(total)}</span></div>
                </div>
              </div>
            )}

            {step === 6 && <PaymentMethodSelector onSelect={setPaymentMethod} />}

            {step === 7 && (
              <div className="text-center py-6">
                <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="inline-flex w-16 h-16 rounded-full bg-emerald-soft dark:bg-emerald-400/10 items-center justify-center mb-4">
                  <Truck size={26} className="text-navy dark:text-blue-400" />
                </motion.div>
                <p className="font-semibold">{pro?.name ?? "Your professional"} is on the way</p>
                <p className="text-sm text-ink-soft dark:text-slate-400 mt-1">Estimated arrival in 18 minutes</p>
                <div className="mt-6 h-2 rounded-full bg-line dark:bg-slate-800 overflow-hidden">
                  <motion.div initial={{ width: "10%" }} animate={{ width: "65%" }} transition={{ duration: 1.2 }} className="h-full bg-emerald" />
                </div>
                {liveStatus && <p className="text-[11px] text-ink-soft dark:text-slate-500 mt-4">Live status: {liveStatus.replaceAll("_", " ").toLowerCase()}</p>}
              </div>
            )}

            {step === 8 && (
              <div className="text-center py-6">
                <CheckCircle2 size={48} className="text-emerald mx-auto mb-4" />
                <p className="font-semibold text-lg">Service completed</p>
                <p className="text-sm text-ink-soft dark:text-slate-400 mt-1">{bookingId ? `Booking #${bookingId.slice(-6)}` : "Invoice #NX-20260706-042"} · {formatINR(total)}</p>
                {bookingId && (
                  <a href={`/invoice/${bookingId}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" className="mt-6">Download Invoice</Button>
                  </a>
                )}
              </div>
            )}

            {step === 9 && (
              <div className="text-center py-4">
                <p className="text-sm text-ink-soft dark:text-slate-400 mb-4">How was your experience with {pro?.name ?? "your professional"}?</p>
                <div className="flex justify-center gap-2 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} onClick={() => setRating(i + 1)}>
                      <Star size={30} fill={i < rating ? "#10B981" : "none"} stroke={i < rating ? "#10B981" : "#94A3B8"} />
                    </button>
                  ))}
                </div>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us more (optional)" className="w-full h-24 p-4 rounded-xl border border-line dark:border-slate-700 bg-transparent text-sm outline-none focus:border-navy" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={back} disabled={step === 0} className={step === 0 ? "opacity-0 pointer-events-none" : ""}><ArrowLeft size={16} /> Back</Button>
          {step < STEP_LABELS.length - 1 ? (
            <Button onClick={next} disabled={busy}>{busy ? "Please wait…" : step === 6 ? "Pay & Confirm" : "Continue"} <ArrowRight size={16} /></Button>
          ) : (
            <Button onClick={submitReview} disabled={busy}>{busy ? "Submitting…" : "Submit Review"}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
