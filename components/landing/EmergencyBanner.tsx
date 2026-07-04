"use client";
import { motion } from "framer-motion";
import { AlarmClock, ArrowRight } from "lucide-react";
import Link from "next/link";

export function EmergencyBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="bg-navy-dark text-white"
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-sm">
          <AlarmClock size={16} className="text-emerald flex-shrink-0" />
          <span><strong className="font-semibold">Emergency booking:</strong> get a verified professional dispatched within the hour.</span>
        </div>
        <Link href="/book?priority=emergency" className="text-sm font-semibold flex items-center gap-1 text-emerald whitespace-nowrap">
          Book now <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
