"use client";

import { SlidersHorizontal } from "lucide-react";
import type { TransactionFilters } from "@/lib/types";

interface FiltersBarProps {
  filters: TransactionFilters;
  onOpen: () => void;
}

export function FiltersBar({ filters, onOpen }: FiltersBarProps) {
  const activeCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "sort") return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value > 0;
    if (typeof value === "string") return value !== "" && value !== "all";
    return false;
  }).length;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="chip">
        <span>Filtros ativos</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
          {activeCount}
        </span>
      </div>
      <button type="button" onClick={onOpen} className="btn-secondary">
        <SlidersHorizontal size={16} />
        Filtrar
      </button>
    </div>
  );
}








