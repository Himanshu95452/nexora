"use client";
import { motion } from "framer-motion";
import { fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";
import { TRUST_STATS_PLACEHOLDER } from "@/lib/mock-data";

export function TrustStats() {
  return (
    <motion.section {...revealProps} variants={stagger} className="py-16 border-y border-line dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_STATS_PLACEHOLDER.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center">
              <p className="font-display text-3xl font-bold text-navy dark:text-blue-400">{s.value}</p>
              <p className="text-xs mt-1 text-ink-soft dark:text-slate-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-[11px] mt-6 text-ink-soft dark:text-slate-500">*Illustrative placeholder figures for design purposes, not verified company statistics.</p>
      </div>
    </motion.section>
  );
}
