"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Wrench, Zap, Wind, Hammer, Sparkles, Settings, Star, ShieldCheck, Calendar, Clock, CheckCircle2, Truck, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { CITIES, LAUNCH_CITY, FEATURED_PROFESSIONALS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

const SERVICES = [
  { name: "Plumbing", icon: Wrench, price: 199 }, { name: "Electrician", icon: Zap, price: 149 },
  { name: "AC Repair", icon: Wind, price: 349 }, { name: "Carpenter", icon: Hammer, price: 249 },
  { name: "Cleaning", icon: Sparkles, price: 399 }, { name: "Appliance Repair", icon: Settings, price: 299 },
];

const STEP_LABELS = ["City", "Service", "Professional", "Date & Time", "Estimate", "Confirm", "Payment", "Tracking", "Completed", "Review"];

export default function BookPage() {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState(LAUNCH_CITY);
  const [service, setService] = useState<typeof SERVICES[number] | null>(null);
  const [pro, setPro] = useState<typeof FEATURED_PROFESSIONALS[number] | null>(null);
  const [date, setDate] = useState("6 Jul 2026");
  const [time, setTime] = useState("4:00 PM");
  const [rating, setRating] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const basePrice = service?.price ?? 0;
  const visitFee = 49;
  const total = basePrice + visitFee;

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

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 p-7 sm:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-dark dark:text-emerald mb-1">Step {step + 1} of {STEP_LABELS.length}</p>
            <h1 className="font-display text-2xl font-bold mb-6">{STEP_LABELS[step]}</h1>

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
                {SERVICES.map((s) => (
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
                {FEATURED_PROFESSIONALS.map((p) => (
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
                  <div className="flex justify-between"><span className="text-ink-soft dark:text-slate-400">Total</span><span className="font-semibold">{formatINR(total)}</span></div>
                </div>
              </div>
            )}

            {step === 6 && <PaymentMethodSelector />}

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
              </div>
            )}

            {step === 8 && (
              <div className="text-center py-6">
                <CheckCircle2 size={48} className="text-emerald mx-auto mb-4" />
                <p className="font-semibold text-lg">Service completed</p>
                <p className="text-sm text-ink-soft dark:text-slate-400 mt-1">Invoice #NX-20260706-042 · {formatINR(total)}</p>
                <Button variant="ghost" className="mt-6">Download Invoice</Button>
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
                <textarea placeholder="Tell us more (optional)" className="w-full h-24 p-4 rounded-xl border border-line dark:border-slate-700 bg-transparent text-sm outline-none focus:border-navy" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={back} disabled={step === 0} className={step === 0 ? "opacity-0 pointer-events-none" : ""}><ArrowLeft size={16} /> Back</Button>
          {step < STEP_LABELS.length - 1 ? (
            <Button onClick={next}>{step === 6 ? "Pay & Confirm" : "Continue"} <ArrowRight size={16} /></Button>
          ) : (
            <Button>Submit Review</Button>
          )}
        </div>
      </div>
    </div>
  );
}
