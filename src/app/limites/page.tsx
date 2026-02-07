"use client";

import { useMemo, useState } from "react";
import { MonthTabs } from "@/components/MonthTabs";
import { MoneyInput } from "@/components/MoneyInput";
import { YearSelect } from "@/components/YearSelect";
import { getYearOptions, yearMonthToLabel } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useToast } from "@/components/ToastProvider";

export default function LimitesPage() {
  const { push } = useToast();
  const data = useFinanceStore((state) => state.data);
  const setMonthlyLimit = useFinanceStore((state) => state.setMonthlyLimit);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());

  const yearMonth = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  const currentLimit = data.settings.monthlyLimitCentsByYearMonth[yearMonth] ?? 0;

  const history = useMemo(() => {
    return Object.entries(data.settings.monthlyLimitCentsByYearMonth)
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .slice(0, 6);
  }, [data.settings.monthlyLimitCentsByYearMonth]);

  return (
    <div className="flex flex-col gap-6">
      <div className="card p-4">
        <p className="text-xs text-muted">Definir limite</p>
        <div className="mt-4 space-y-4">
          <MonthTabs monthIndex={monthIndex} onChange={setMonthIndex} />
          <YearSelect
            year={year}
            onChange={setYear}
            options={getYearOptions(2024, 2027)}
          />
          <div>
            <label className="text-xs text-muted">Limite para {yearMonth}</label>
            <MoneyInput
              valueCents={currentLimit}
              onChangeCents={(value) => setMonthlyLimit(yearMonth, value)}
            />
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => push("Limite atualizado.", "success")}
          >
            Salvar limite
          </button>
        </div>
      </div>

      <div className="card-soft p-4">
        <p className="text-sm font-semibold">Histórico recente</p>
        <div className="mt-3 flex flex-col gap-2">
          {history.length === 0 && (
            <p className="text-xs text-muted">Nenhum limite registrado.</p>
          )}
          {history.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm">{yearMonthToLabel(key)}</span>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}









