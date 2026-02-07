"use client";

import clsx from "clsx";
import { MONTHS_SHORT } from "@/lib/date";

interface MonthTabsProps {
  monthIndex: number;
  onChange: (index: number) => void;
}

export function MonthTabs({ monthIndex, onChange }: MonthTabsProps) {
  return (
    <div className="month-tabs flex gap-2 overflow-x-auto pb-2">
      {MONTHS_SHORT.map((month, index) => (
        <button
          key={month}
          type="button"
          onClick={() => onChange(index)}
          className={clsx(
            "rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition",
            monthIndex === index
              ? "bg-foreground text-background shadow-[var(--shadow-soft)]"
              : "bg-card text-muted shadow-[var(--shadow-soft)] hover:text-foreground"
          )}
        >
          {month}
        </button>
      ))}
    </div>
  );
}








