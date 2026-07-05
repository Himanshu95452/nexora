"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase mb-4 text-emerald-dark dark:text-emerald">
      <span className="w-6 h-px bg-emerald" />
      {children}
    </div>
  );
}

export const fadeUp = { hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };
export const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
export const revealProps = { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" } } as const;

export function SectionHead({ eyebrow, title, sub, center }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <motion.div variants={fadeUp} className={cn("max-w-2xl mb-16", center && "mx-auto text-center")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl sm:text-[2.5rem] leading-[1.12] font-bold tracking-tight">{title}</h2>
      {sub && <p className="mt-4 leading-relaxed text-ink-soft dark:text-slate-400">{sub}</p>}
    </motion.div>
  );
}
