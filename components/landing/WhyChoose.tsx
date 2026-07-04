"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Zap, Headphones } from "lucide-react";
import { SectionHead, fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";

const PILLARS = [
  { icon: ShieldCheck, title: "Trust", desc: "Every professional clears a seven-checkpoint verification before they can accept a single booking." },
  { icon: Eye, title: "Transparency", desc: "The price you see before booking is the price you pay. No vague estimates." },
  { icon: Zap, title: "Speed", desc: "Most requests are matched with a confirmed professional in minutes." },
  { icon: Headphones, title: "Customer Support", desc: "A real person is reachable if something needs attention, from booking to completion." },
];

export function WhyChoose() {
  return (
    <motion.section {...revealProps} variants={stagger} className="py-24 bg-mist dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Why Nexora" title="Trust isn't a feature here. It's the product." center />
        <div className="space-y-4 max-w-4xl mx-auto">
          {PILLARS.map((p, i) => (
            <motion.div key={p.title} variants={fadeUp} className={`flex flex-col sm:flex-row ${i % 2 === 1 ? "sm:flex-row-reverse" : ""} items-center gap-8 rounded-3xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 p-8 sm:p-10`}>
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-navy to-navy-light">
                <p.icon size={30} className="text-white" />
              </div>
              <div className={i % 2 === 1 ? "sm:text-right" : ""}>
                <h3 className="font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft dark:text-slate-400">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
