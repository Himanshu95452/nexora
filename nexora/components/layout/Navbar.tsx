"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Seal } from "@/components/ui/Seal";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Become a Partner", href: "#partner" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-line dark:border-slate-800 transition-shadow"
      style={{ boxShadow: scrolled ? "0 8px 30px -20px rgba(15,23,42,.25)" : "none" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-[76px]">
        <Link href="/" className="flex items-center gap-2.5">
          <Seal size={30} ringDash={false} />
          <span className="font-display text-xl font-bold tracking-tight text-navy dark:text-white">NEXORA</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-9">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="relative text-sm font-medium group">
              {l.label}
              <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-emerald group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login/customer" className="text-sm font-semibold px-4 py-2 text-navy dark:text-white">Login</Link>
          <Link href="/signup/customer"><Button className="!px-5 !py-2.5">Sign Up</Button></Link>
        </div>
        <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden border-t border-line dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-5 flex flex-col gap-4">
              {LINKS.map((l) => <a key={l.label} href={l.href} className="text-sm font-medium">{l.label}</a>)}
              <div className="flex gap-3 pt-2">
                <Link href="/login/customer" className="flex-1"><Button variant="ghost" className="w-full">Login</Button></Link>
                <Link href="/signup/customer" className="flex-1"><Button className="w-full">Sign Up</Button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
