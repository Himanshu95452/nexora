"use client";
import { motion } from "framer-motion";
import { Search, UserCheck, CalendarClock, Wallet, Truck, Star } from "lucide-react";
import { SectionHead, fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";

const FLOW = [
  { icon: Search, label: "Search Service" },
  { icon: UserCheck, label: "Select Professional" },
  { icon: CalendarClock, label: "Choose Date & Time" },
  { icon: Wallet, label: "Secure Payment" },
  { icon: Truck, label: "Live Tracking" },
  { icon: Star, label: "Rate & Review" },
];

export function BookingFlowPreview() {
  return (
    <motion.section {...revealProps} variants={stagger} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Booking, simplified" title="A booking flow with no dead ends." sub="Every step is visible — from search to a completed, rated job." />
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {FLOW.map((f, i) => (
            <motion.div key={f.label} variants={fadeUp} className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center">
              <div className="w-11 h-11 mx-auto rounded-xl bg-emerald-soft dark:bg-emerald-400/10 flex items-center justify-center mb-3">
                <f.icon size={19} className="text-navy dark:text-blue-400" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-dark dark:text-emerald">Step {i + 1}</p>
              <p className="font-display text-sm font-semibold mt-1">{f.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
