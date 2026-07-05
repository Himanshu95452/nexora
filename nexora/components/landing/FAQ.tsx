"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHead, fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";

const FAQS = [
  { q: "How are professionals verified?", a: "Every professional passes identity verification, experience checks, a skill assessment, and a background check where applicable, before they're approved to accept bookings." },
  { q: "How does pricing work?", a: "You see the full, transparent price for a service before you confirm your booking — no hidden fees added afterward." },
  { q: "How do complaints work?", a: "Every booking has a direct line to customer support. Complaints are reviewed and resolved with both the customer and the professional." },
  { q: "Can I choose the same professional?", a: "Yes. If you've had a good experience, you can rebook the same verified professional directly from your booking history." },
  { q: "Is payment secure?", a: "Yes. All payments, online or in person, are protected under the same secure payment standards." },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <motion.section {...revealProps} variants={stagger} className="py-24 bg-mist dark:bg-slate-900/40">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHead eyebrow="FAQ" title="Good questions." />
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const open = openIdx === i;
            return (
              <motion.div variants={fadeUp} key={f.q} className="rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 overflow-hidden">
                <button className="w-full flex items-center justify-between gap-4 text-left px-6 py-5" onClick={() => setOpenIdx(open ? -1 : i)} aria-expanded={open}>
                  <span className="font-display font-semibold">{f.q}</span>
                  <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}><ChevronDown size={18} className="text-navy dark:text-blue-400" /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft dark:text-slate-400">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
