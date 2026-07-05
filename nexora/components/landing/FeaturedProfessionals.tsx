"use client";
import { motion } from "framer-motion";
import { Star, ShieldCheck } from "lucide-react";
import { SectionHead, fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";
import { TierBadge } from "@/components/ui/Badge";
import { FEATURED_PROFESSIONALS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export function FeaturedProfessionals() {
  return (
    <motion.section {...revealProps} variants={stagger} className="py-24 bg-mist dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Featured professionals" title="Highly rated, fully verified, ready in Nagpur." sub="Sample profiles shown for design purposes — live listings will reflect real, verified professionals at launch." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_PROFESSIONALS.map((p) => (
            <motion.div key={p.id} variants={fadeUp} className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-semibold">{p.avatarInitials}</div>
                <TierBadge tier={p.badge} />
              </div>
              <p className="font-display font-semibold mt-4">{p.name}</p>
              <p className="text-xs text-ink-soft dark:text-slate-400">{p.category} · {p.city}</p>
              <div className="flex items-center gap-1 mt-3 text-sm font-semibold">
                <Star size={13} fill="#10B981" stroke="none" /> {p.rating} <span className="text-ink-soft dark:text-slate-400 font-normal">({p.jobsCompleted} jobs)</span>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-line dark:border-slate-800">
                <div className="flex items-center gap-1 text-xs text-emerald-dark dark:text-emerald font-semibold"><ShieldCheck size={13} /> Verified</div>
                <p className="text-sm font-semibold">{formatINR(p.startingPrice)}+</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
