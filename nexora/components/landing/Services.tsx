"use client";
import { motion } from "framer-motion";
import { Wrench, Zap, Wind, Hammer, Sparkles, Settings, ArrowRight } from "lucide-react";
import { SectionHead, fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";
import { SERVICE_PRICING } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

const ICONS: Record<string, any> = { Plumbing: Wrench, Electrician: Zap, "AC Repair": Wind, Carpenter: Hammer, Cleaning: Sparkles, "Appliance Repair": Settings };
const DESC: Record<string, string> = {
  Plumbing: "Leak fixes, pipe fitting, and full bathroom plumbing.",
  Electrician: "Wiring, switchboards, and certified safety inspections.",
  "AC Repair": "Installation, gas refill, and servicing, any brand.",
  Carpenter: "Furniture repair, modular fittings, custom woodwork.",
  Cleaning: "Deep home cleaning, sofa shampooing, move-in resets.",
  "Appliance Repair": "Washing machines, fridges, kitchen appliances.",
};

export function Services() {
  return (
    <motion.section {...revealProps} variants={stagger} className="py-24" id="services">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Services & pricing" title="Six categories today. Transparent pricing on every one." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_PRICING.map((s) => {
            const Icon = ICONS[s.category];
            return (
              <motion.div key={s.category} variants={fadeUp} whileHover={{ y: -6 }} className="group rounded-2xl border border-line dark:border-slate-800 p-7 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-blue-900/5 transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-soft dark:bg-emerald-400/10">
                    <Icon size={22} className="text-navy dark:text-blue-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-ink-soft dark:text-slate-400">Starting from</p>
                    <p className="font-display font-bold text-lg">{formatINR(s.startingFrom)}</p>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg mt-5">{s.category}</h3>
                <p className="text-sm mt-2 leading-relaxed text-ink-soft dark:text-slate-400">{DESC[s.category]}</p>
                <Link href="/book" className="mt-6 text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all text-navy dark:text-blue-400">
                  Book Now <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
