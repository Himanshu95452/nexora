"use client";
import { motion } from "framer-motion";
import { SectionHead, fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";
import { Seal } from "@/components/ui/Seal";

const TRUST_STEPS = ["Registration", "Identity Verification", "Experience Verification", "Skill Assessment", "Background Check", "Approved by Nexora", "Ready for Bookings"];

export function TrustProcess() {
  return (
    <motion.section {...revealProps} variants={stagger} className="py-24 bg-mist dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="The verification process" title="Seven checkpoints before anyone books them." />
        <div className="overflow-x-auto pb-4">
          <div className="relative flex gap-6 min-w-[880px] lg:min-w-0">
            <motion.div className="absolute top-6 left-6 right-6 h-px bg-emerald origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.3, ease: "easeInOut" }} />
            {TRUST_STEPS.map((s, i) => (
              <motion.div key={s} variants={fadeUp} className="relative flex-1 flex flex-col items-center text-center">
                <div className="bg-mist dark:bg-slate-900 rounded-full z-10"><Seal size={44} ringDash={false} pop /></div>
                <p className="text-[11px] font-semibold uppercase tracking-wide mt-4 text-emerald-dark dark:text-emerald">Checkpoint {i + 1}</p>
                <p className="font-display font-semibold text-sm mt-1 max-w-[9rem]">{s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
