"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHead, fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";
import { SUCCESS_STORIES } from "@/lib/mock-data";

const COLORS = ["bg-navy", "bg-emerald", "bg-navy-light"];

export function SuccessStories() {
  return (
    <motion.section {...revealProps} variants={stagger} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead eyebrow="Sample content" title="What early users are saying." sub="Placeholder testimonials for design purposes — to be replaced with real customer reviews at launch." center />
        <div className="grid md:grid-cols-3 gap-6">
          {SUCCESS_STORIES.map((t, i) => (
            <motion.div key={t.name} variants={fadeUp} whileHover={{ y: -5 }} className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-7">
              <div className="flex gap-0.5 mb-4">{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} fill="#10B981" stroke="none" />)}</div>
              <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${COLORS[i % 3]}`}>
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-ink-soft dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
