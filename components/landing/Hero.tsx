"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Search, ShieldCheck, Lock, Clock, CheckCircle2, Star, MapPin } from "lucide-react";
import { Eyebrow, fadeUp, stagger } from "@/components/ui/SectionHead";
import { Button } from "@/components/ui/Button";
import { Seal } from "@/components/ui/Seal";
import { CITIES, LAUNCH_CITY, SERVICE_PRICING } from "@/lib/mock-data";
import Link from "next/link";

function FloatCard({ children, className = "", delay = 0, y = 10 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: [0, -y, 0] }}
      transition={{ opacity: { duration: 0.6, delay }, scale: { duration: 0.6, delay }, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 } }}
      className={`absolute rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-700 shadow-xl px-4 py-3 flex items-center gap-3 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function CityAndSearch() {
  const [city, setCity] = useState<string>(LAUNCH_CITY);
  const [query, setQuery] = useState("");
  return (
    <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
      <div className="relative">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="appearance-none h-14 pl-4 pr-9 rounded-full border border-line dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold"
          aria-label="Select city"
        >
          {CITIES.map((c) => (
            <option key={c} value={c} disabled={c !== LAUNCH_CITY}>{c}{c !== LAUNCH_CITY ? " (coming soon)" : ""}</option>
          ))}
        </select>
        <MapPin size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-soft" />
      </div>
      <div className="relative flex-1">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What service do you need?"
          className="w-full h-14 pl-11 pr-32 rounded-full border border-line dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-navy"
        />
        <Link href="/book" className="absolute right-1.5 top-1.5">
          <Button className="!py-2.5 !px-5">Search</Button>
        </Link>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden grid-bg">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-white/0 to-white dark:from-slate-950 dark:via-slate-950/0 dark:to-slate-950" />
      <div className="max-w-6xl mx-auto px-6 relative pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}><Eyebrow>Now live in Nagpur</Eyebrow></motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-[2.75rem] leading-[1.05] sm:text-[3.4rem] sm:leading-[1.03] font-bold tracking-tight">
              Home services you don&apos;t have to <span className="text-navy dark:text-blue-400">worry about.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed max-w-lg text-ink-soft dark:text-slate-400">
              Every Nexora professional is identity-verified, background-checked, and rated by real customers.
            </motion.p>
            <CityAndSearch />
            <motion.div variants={fadeUp} className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link href="/book"><Button>Book a Service <ArrowRight size={16} /></Button></Link>
              <Link href="/signup/professional"><Button variant="ghost">Become a Partner</Button></Link>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft dark:text-slate-400">
              <div className="flex items-center gap-2"><ShieldCheck size={17} className="text-emerald" /> Identity verified</div>
              <div className="flex items-center gap-2"><Lock size={17} className="text-emerald" /> Secure payments</div>
              <div className="flex items-center gap-2"><Clock size={17} className="text-emerald" /> Fast response</div>
            </motion.div>
          </motion.div>
        </div>
        <div className="relative h-[420px] hidden sm:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="rounded-[2rem] border border-line dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-12">
              <Seal size={130} pop />
              <p className="font-display mt-6 text-center font-semibold text-navy dark:text-blue-400">Verified &amp; Approved</p>
            </motion.div>
          </div>
          <FloatCard className="top-2 left-2" delay={0.5} y={12}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-soft dark:bg-emerald-400/10"><ShieldCheck size={16} className="text-navy dark:text-blue-400" /></div>
            <div><p className="text-xs font-semibold">Verified Electrician</p><p className="text-[11px] text-ink-soft dark:text-slate-400">Anil V. · Nagpur</p></div>
          </FloatCard>
          <FloatCard className="bottom-8 right-0" delay={0.75} y={14}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-soft dark:bg-emerald-400/10"><CheckCircle2 size={16} className="text-emerald-dark" /></div>
            <div><p className="text-xs font-semibold">Booking confirmed</p><p className="text-[11px] text-ink-soft dark:text-slate-400">AC Repair · 4:00 PM</p></div>
          </FloatCard>
          <FloatCard className="top-24 right-4" delay={1} y={10}>
            <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="#10B981" stroke="none" />)}</div>
            <p className="text-xs font-semibold">4.9 rating</p>
          </FloatCard>
        </div>
      </div>
    </section>
  );
}
