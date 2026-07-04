"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "emerald" | "danger" };

export function Button({ variant = "primary", className, children, ...props }: Props) {
  const styles = {
    primary: "bg-navy text-white hover:brightness-110",
    emerald: "bg-emerald text-white hover:brightness-110",
    ghost: "border-2 border-navy text-navy dark:text-white dark:border-white bg-transparent",
    danger: "bg-red-600 text-white hover:brightness-110",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn("inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-colors", styles[variant], className)}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
