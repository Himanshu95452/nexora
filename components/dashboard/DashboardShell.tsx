"use client";
import { motion } from "framer-motion";
import { LogOut, Search, Bell } from "lucide-react";
import { Seal } from "@/components/ui/Seal";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface NavItem { key: string; label: string; icon: any }

export function DashboardShell({
  navItems, active, onSelect, roleLabel, topbarTitle, topbarSubtitle, children,
}: {
  navItems: NavItem[]; active: string; onSelect: (key: string) => void; roleLabel: string;
  topbarTitle: string; topbarSubtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-mist dark:bg-slate-950">
      <aside className="w-64 flex-shrink-0 border-r border-line dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col">
        <Link href="/" className="h-[72px] flex items-center gap-2 px-6 border-b border-line dark:border-slate-800">
          <Seal size={26} ringDash={false} />
          <span className="font-display font-bold text-navy dark:text-white">NEXORA</span>
        </Link>
        <div className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-slate-400">{roleLabel}</div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((it) => (
            <button key={it.key} onClick={() => onSelect(it.key)}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors",
                active === it.key ? "bg-emerald-soft dark:bg-emerald-400/10 text-navy dark:text-emerald" : "text-ink dark:text-slate-300 hover:bg-mist dark:hover:bg-slate-800")}>
              <it.icon size={17} /> {it.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-line dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-ink-soft dark:text-slate-400"><LogOut size={16} /> Sign out</div>
          <ThemeToggle />
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-[72px] flex-shrink-0 flex items-center justify-between px-6 sm:px-8 border-b border-line dark:border-slate-800 bg-white dark:bg-slate-900">
          <div>
            <p className="font-display font-bold text-lg">{topbarTitle}</p>
            <p className="text-xs text-ink-soft dark:text-slate-400">{topbarSubtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <Search size={18} className="text-ink-soft dark:text-slate-400" />
            <Bell size={18} className="text-ink-soft dark:text-slate-400" />
            <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold">N</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, sub, delay = 0 }: { icon: any; label: string; value: string; sub?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }} className="rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-emerald-soft dark:bg-emerald-400/10 flex items-center justify-center"><Icon size={18} className="text-navy dark:text-blue-400" /></div>
        {sub && <span className="text-xs font-semibold text-emerald-dark dark:text-emerald">{sub}</span>}
      </div>
      <p className="font-display text-2xl font-bold mt-4">{value}</p>
      <p className="text-sm text-ink-soft dark:text-slate-400">{label}</p>
    </motion.div>
  );
}
