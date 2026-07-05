"use client";
import { motion } from "framer-motion";

export function Seal({ size = 64, ringDash = true, pop = false }: { size?: number; ringDash?: boolean; pop?: boolean }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 100 100"
      initial={pop ? { scale: 0.4, opacity: 0, rotate: -20 } : false}
      whileInView={pop ? { scale: 1, opacity: 1, rotate: 0 } : undefined}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
    >
      <circle cx="50" cy="50" r="47" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray={ringDash ? "3 4" : "0"} opacity="0.6" />
      <circle cx="50" cy="50" r="39" className="fill-navy dark:fill-navy-light" />
      <path d="M33 51 L44.5 62.5 L69 37" fill="none" stroke="#10B981" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}
