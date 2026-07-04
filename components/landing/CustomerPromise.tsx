"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Eyebrow, fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";

const PROMISES = ["Verified Professionals", "Transparent Pricing", "Customer Support", "Secure Payments", "Reliable Service", "Easy Rebooking"];

export function CustomerPromise() {
  return (
    <motion.section {...revealProps} className="py-24 text-white bg-navy">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp}>
            <Eyebrow>Our promise</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">What we owe every customer, every time.</h2>
            <p className="mt-4 text-white/70 leading-relaxed max-w-md">No fine print. Just the standard we hold every booking to.</p>
          </motion.div>
          <motion.ul variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-4">
            {PROMISES.map((p) => (
              <motion.li variants={fadeUp} key={p} className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 size={18} className="text-emerald flex-shrink-0" /> {p}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </motion.section>
  );
}
