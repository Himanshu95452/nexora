"use client";
import { motion } from "framer-motion";
import { TrendingUp, Wallet, GraduationCap, Headphones, BarChart3, Trophy, ArrowRight } from "lucide-react";
import { Eyebrow, fadeUp, stagger, revealProps } from "@/components/ui/SectionHead";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const BENEFITS = [
  { icon: TrendingUp, title: "More Customers", desc: "Steady demand from a growing base of verified households." },
  { icon: Wallet, title: "Weekly Payments", desc: "Predictable payouts, straight to your account." },
  { icon: GraduationCap, title: "Training", desc: "Skill and service-quality training to help you earn more." },
  { icon: Headphones, title: "Dedicated Support", desc: "A partner support line that actually picks up." },
  { icon: BarChart3, title: "Business Growth", desc: "Track jobs, earnings, and your rating over time." },
  { icon: Trophy, title: "Performance Rewards", desc: "Top-rated professionals get priority bookings." },
];

export function ProfessionalCTA() {
  return (
    <motion.section {...revealProps} className="py-24" id="partner">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={fadeUp} className="rounded-[2.5rem] p-10 sm:p-16 text-white relative overflow-hidden bg-gradient-to-br from-navy to-navy-dark">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-20 blur-2xl bg-emerald" />
          <div className="relative grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Eyebrow>For professionals</Eyebrow>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Skilled work deserves a platform this good.</h2>
              <p className="mt-4 text-white/70 max-w-md leading-relaxed">Join Nexora and get steady, trustworthy work — plus a reputation that grows with every job you complete well.</p>
              <Link href="/signup/professional"><Button variant="emerald" className="mt-9">Become a Nexora Partner <ArrowRight size={16} /></Button></Link>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              {BENEFITS.map((b) => (
                <motion.div variants={fadeUp} key={b.title} className="rounded-2xl p-5 bg-white/10 border border-white/10">
                  <b.icon size={19} className="text-emerald" />
                  <p className="text-sm font-semibold mt-3">{b.title}</p>
                  <p className="text-xs mt-1 text-white/60 leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
