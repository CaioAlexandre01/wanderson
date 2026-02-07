"use client";

import { useMemo, useState } from "react";
import { MonthTabs } from "@/components/MonthTabs";
import { YearSelect } from "@/components/YearSelect";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { useToast } from "@/components/ToastProvider";
import { Pencil, Trash2 } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { getMonthlySummary, getTransactionsForYearMonth } from "@/lib/finance/calc";
import { getYearOptions } from "@/lib/date";
import { formatCurrency, formatDateShort } from "@/lib/format";
import type { Transaction } from "@/lib/types";

export default function DashboardPage() {
  const { push } = useToast();
  const data = useFinanceStore((state) => state.data);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [editing, setEditing] = useState<Transaction | null>(null);

  const yearMonth = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  const monthTransactions = useMemo(
    () => getTransactionsForYearMonth(data.transactions, yearMonth),
    [data.transactions, yearMonth]
  );
  const summary = getMonthlySummary(monthTransactions);
  const history = useMemo(
    () => [...monthTransactions].sort((a, b) => b.createdAt - a.createdAt),
    [monthTransactions]
  );
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

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="card-soft p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Gastos</p>
          <p className="text-lg font-semibold text-danger">
            {formatCurrency(summary.expenseCents)}
          </p>
        </div>
        <div className="card-soft p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Receitas
          </p>
          <p className="text-lg font-semibold text-success">
            {formatCurrency(summary.incomeCents)}
          </p>
        </div>
        <div className="card-soft p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Saldo</p>
          <p
            className={
              summary.balanceCents >= 0
                ? "text-lg font-semibold text-foreground"
                : "text-lg font-semibold text-danger"
            }
          >
            {formatCurrency(summary.balanceCents)}
          </p>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Histórico</h3>
          <span className="text-xs text-muted">{history.length} itens</span>
        </div>
        <div className="mt-4 space-y-3 max-w-2xl mx-auto w-full">
          {history.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-4 text-center text-sm text-muted">
              Nada registrado neste mês.
            </div>
          )}
          {history.map((tx) => (
            <div
              key={tx.id}
              className="w-full rounded-2xl border border-border/70 bg-card-soft/80 px-4 py-3"
            >
              <div className="grid grid-cols-[1fr_100px_auto] items-center gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {categoryMap.get(tx.categoryId) ?? "Sem categoria"}
                  </p>
                  <p className="text-xs text-muted">
                    {formatDateShort(tx.dateISO)}
                    {tx.note ? ` - ${tx.note}` : ""}
                  </p>
                </div>
                <div className="flex items-center justify-center text-center">
                  <span
                    className={
                      tx.type === "expense"
                        ? "text-sm font-semibold text-danger"
                        : "text-sm font-semibold text-success"
                    }
                  >
                    {tx.type === "expense" ? "-" : "+"}
                    {formatCurrency(tx.amountCents)}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(tx)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/60 text-foreground/80 transition hover:text-foreground"
                    aria-label="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      useFinanceStore.getState().deleteTransaction(tx.id);
                      push("Transacao excluida.", "success");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/60 text-danger transition hover:text-danger"
                    aria-label="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <EditTransactionModal
        open={Boolean(editing)}
        transaction={editing}
        categories={data.categories}
        onClose={() => setEditing(null)}
        onSave={(id, patch) => {
          updateTransaction(id, patch);
          setEditing(null);
          push("Transacao atualizada.", "success");
        }}
      />
    </div>
  );
}
