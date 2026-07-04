import Link from "next/link";
import { Instagram, Linkedin, Twitter, Mail } from "lucide-react";
import { Seal } from "@/components/ui/Seal";

export function Footer() {
  return (
    <footer className="pt-20 pb-10 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy to-emerald" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-line dark:border-slate-800">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Seal size={26} ringDash={false} />
              <span className="font-display text-lg font-bold text-navy dark:text-white">NEXORA</span>
            </div>
            <p className="text-sm max-w-xs leading-relaxed text-ink-soft dark:text-slate-400">
              Building India&apos;s trusted platform for verified professionals — starting in Nagpur.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-line dark:border-slate-700 flex items-center justify-center">
                  <Icon size={15} className="text-ink-soft dark:text-slate-400" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="font-display font-semibold text-sm mb-4">Company</p>
            <ul className="space-y-2.5 text-sm text-ink-soft dark:text-slate-400">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display font-semibold text-sm mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm text-ink-soft dark:text-slate-400">
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Terms</Link></li>
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display font-semibold text-sm mb-4">Stay updated</p>
            <div className="flex items-center rounded-full border border-line dark:border-slate-700 overflow-hidden">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2.5 text-sm outline-none min-w-0 bg-transparent" />
              <button className="px-3.5 py-2.5 flex-shrink-0 bg-navy" aria-label="Subscribe"><Mail size={15} className="text-white" /></button>
            </div>
          </div>
        </div>
        <div className="mt-6 text-xs text-ink-soft dark:text-slate-400">© 2026 Nexora. All rights reserved.</div>
      </div>
    </footer>
  );
}
