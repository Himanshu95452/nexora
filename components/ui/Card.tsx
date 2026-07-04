import { cn } from "@/lib/utils";
import React from "react";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900", className)}>
      {children}
    </div>
  );
}
