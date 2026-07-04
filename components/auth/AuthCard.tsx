"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Seal } from "@/components/ui/Seal";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mist dark:bg-slate-950 px-6 py-16 grid-bg">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xl p-8 sm:p-10">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <Seal size={28} ringDash={false} />
          <span className="font-display text-lg font-bold text-navy dark:text-white">NEXORA</span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-center">{title}</h1>
        <p className="text-sm text-center mt-2 text-ink-soft dark:text-slate-400">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </motion.div>
    </div>
  );
}

export function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <label className="block mb-4">
      <span className="text-sm font-medium">{label}</span>
      <input type={type} placeholder={placeholder} className="mt-1.5 w-full h-12 px-4 rounded-xl border border-line dark:border-slate-700 bg-transparent text-sm outline-none focus:border-navy" />
    </label>
  );
}
