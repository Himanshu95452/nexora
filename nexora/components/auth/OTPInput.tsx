"use client";
import { useRef } from "react";

export function OTPInput({ length = 4 }: { length?: number }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          maxLength={1}
          inputMode="numeric"
          className="w-12 h-14 text-center text-lg font-semibold rounded-xl border border-line dark:border-slate-700 bg-transparent outline-none focus:border-navy"
          onChange={(e) => { if (e.target.value && refs.current[i + 1]) refs.current[i + 1]?.focus(); }}
        />
      ))}
    </div>
  );
}
