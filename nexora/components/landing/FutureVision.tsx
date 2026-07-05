"use client";
import { motion } from "framer-motion";
import { Truck, Briefcase, Package, Stethoscope, GraduationCap, PartyPopper, HardHat, Scissors, PawPrint, Building2 } from "lucide-react";
import { Eyebrow, fadeUp, revealProps } from "@/components/ui/SectionHead";

const FUTURE = [
  { icon: Truck, label: "Drivers" }, { icon: Briefcase, label: "Business Staffing" },
  { icon: Package, label: "Delivery Partners" }, { icon: Stethoscope, label: "Healthcare Professionals" },
  { icon: GraduationCap, label: "Tutors" }, { icon: PartyPopper, label: "Event Staff" },
  { icon: HardHat, label: "Construction" }, { icon: Scissors, label: "Beauty" },
  { icon: PawPrint, label: "Pet Care" }, { icon: Building2, label: "Business Services" },
];

export function FutureVision() {
  const loop = [...FUTURE, ...FUTURE];
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...revealProps} variants={fadeUp} className="max-w-xl mb-12">
          <Eyebrow>What&apos;s next</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Home services are the start, not the ceiling.</h2>
          <p className="mt-4 leading-relaxed text-ink-soft dark:text-slate-400">Nexora&apos;s architecture supports unlimited categories — the same verification standard, extended to every kind of trusted professional India needs.</p>
        </motion.div>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-3 w-max animate-marquee">
          {loop.map((f, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-full border border-line dark:border-slate-700 bg-white dark:bg-slate-900">
              <f.icon size={16} className="text-navy dark:text-blue-400" />
              <span className="text-sm font-medium whitespace-nowrap">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
