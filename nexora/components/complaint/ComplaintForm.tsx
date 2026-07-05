"use client";
import { Button } from "@/components/ui/Button";

export function ComplaintForm() {
  return (
    <form className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Related booking</span>
        <select className="mt-1.5 w-full h-11 px-3 rounded-xl border border-line dark:border-slate-700 bg-transparent text-sm">
          <option>AC Repair — 6 Jul 2026</option>
          <option>Deep Cleaning — 9 Jul 2026</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium">What went wrong?</span>
        <textarea className="mt-1.5 w-full h-28 p-3 rounded-xl border border-line dark:border-slate-700 bg-transparent text-sm" placeholder="Describe the issue" />
      </label>
      <Button type="button" className="w-full">Submit Complaint</Button>
    </form>
  );
}
