"use client";

import { MoneyInput } from "@/components/MoneyInput";
import { ArrowUpCircle, MinusCircle } from "lucide-react";

interface QuickAddBarProps {
  amountCents: number;
  onAmountChange: (value: number) => void;
  onAddExpense: () => void;
  onAddIncome: () => void;
}

export function QuickAddBar({
  amountCents,
  onAmountChange,
  onAddExpense,
  onAddIncome,
}: QuickAddBarProps) {
  const shortcuts = [10, 50, 100, 200];
  return (
    <div className="card p-6">
      <div className="flex flex-col gap-4">
        <div>
          <label className="sr-only" htmlFor="quick-amount">
            Valor
          </label>
          <MoneyInput
            id="quick-amount"
            valueCents={amountCents}
            onChangeCents={onAmountChange}
            className="h-16 rounded-2xl bg-card text-2xl font-semibold tracking-tight"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {shortcuts.map((value) => {
            const cents = value * 100;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onAmountChange(amountCents + cents)}
                className="rounded-full border border-border bg-card-soft px-3 py-2 text-xs font-semibold text-foreground/80 transition hover:text-foreground"
              >
                + R$ {value}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onAddExpense} className="btn-expense h-14 text-sm">
            <MinusCircle size={18} />
            Despesa
          </button>
          <button type="button" onClick={onAddIncome} className="btn-income h-14 text-sm">
            <ArrowUpCircle size={18} />
            Receita
          </button>
        </div>
      </div>
    </div>
  );
}





