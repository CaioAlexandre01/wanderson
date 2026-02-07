"use client";

import { useMemo, useState } from "react";
import { MonthTabs } from "@/components/MonthTabs";
import { YearSelect } from "@/components/YearSelect";
import { useFinanceStore } from "@/store/useFinanceStore";
import { getTransactionsForYearMonth } from "@/lib/finance/calc";
import { getYearOptions } from "@/lib/date";
import { formatCurrency } from "@/lib/format";

export default function ResumosPage() {
  const data = useFinanceStore((state) => state.data);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());

  const yearMonth = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  const monthTransactions = useMemo(
    () => getTransactionsForYearMonth(data.transactions, yearMonth),
    [data.transactions, yearMonth]
  );

  const expensesByCategory = useMemo(() => {
    const map = new Map<string, number>();
    monthTransactions.forEach((tx) => {
      if (tx.type !== "expense") return;
      map.set(tx.categoryId, (map.get(tx.categoryId) ?? 0) + tx.amountCents);
    });
    return Array.from(map.entries())
      .map(([categoryId, amountCents]) => ({
        categoryId,
        amountCents,
      }))
      .sort((a, b) => b.amountCents - a.amountCents);
  }, [monthTransactions]);

  const categoryMap = useMemo(
    () => new Map(data.categories.map((cat) => [cat.id, cat.name])),
    [data.categories]
  );

  const yearOptions = getYearOptions(now.getFullYear() - 1, now.getFullYear() + 2);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <MonthTabs monthIndex={monthIndex} onChange={setMonthIndex} />
        <YearSelect year={year} onChange={setYear} options={yearOptions} />
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Gastos por categoria</h3>
          <span className="text-xs text-muted">{yearMonth}</span>
        </div>

        {expensesByCategory.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-4 text-center text-sm text-muted">
            Nenhum gasto registrado neste mês.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {expensesByCategory.map((item) => (
              <div
                key={item.categoryId}
                className="card-soft flex items-center justify-between p-4"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {categoryMap.get(item.categoryId) ?? "Sem categoria"}
                  </p>
                  <p className="text-xs text-muted">Total</p>
                </div>
                <span className="text-sm font-semibold text-danger">
                  {formatCurrency(item.amountCents)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
