"use client";
import { motion } from "framer-motion";
import { SectionHead, fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";
import { Seal } from "@/components/ui/Seal";

const STEPS = ["Choose Service", "Select Professional", "Book", "Professional Arrives", "Service Completed", "Review"];

export function HowItWorks() {
  return (
    <motion.section {...revealProps} variants={stagger} className="py-24" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="How it works" title="From request to review, in one flow." />
        <div className="relative">
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-line dark:bg-slate-800" />
          <motion.div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-emerald origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeInOut" }} />
          <div className="grid lg:grid-cols-6 gap-10 lg:gap-4">
            {STEPS.map((s, i) => (
              <motion.div key={s} variants={fadeUp} className="relative flex lg:flex-col items-center lg:items-start gap-4 lg:gap-0">
                <div className="relative z-10 flex-shrink-0 bg-white dark:bg-slate-950 rounded-full"><Seal size={48} ringDash={false} pop /></div>
                <div className="lg:mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-dark dark:text-emerald">Step {i + 1}</p>
                  <p className="font-display font-semibold mt-1">{s}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
