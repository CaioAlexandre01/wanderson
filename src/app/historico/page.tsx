"use client";

import { useMemo, useState } from "react";
import { FiltersBar } from "@/components/FiltersBar";
import { FilterDrawer } from "@/components/FilterDrawer";
import { MonthTabs } from "@/components/MonthTabs";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { TransactionList } from "@/components/TransactionList";
import { YearSelect } from "@/components/YearSelect";
import { useToast } from "@/components/ToastProvider";
import { getMonthlySummary, getTransactionsForYearMonth } from "@/lib/finance/calc";
import { getYearOptions } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import type { TransactionFilters } from "@/lib/types";
import { filterTransactions, sortTransactions } from "@/store/selectors";
import { useFinanceStore } from "@/store/useFinanceStore";

export default function HistoricoPage() {
  const { push } = useToast();
  const data = useFinanceStore((state) => state.data);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [filters, setFilters] = useState<TransactionFilters>({
    sort: "recent",
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const yearMonth = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

  const monthTransactions = useMemo(
    () => getTransactionsForYearMonth(data.transactions, yearMonth),
    [data.transactions, yearMonth]
  );

  const summary = getMonthlySummary(monthTransactions);
  const filtered = sortTransactions(
    filterTransactions(monthTransactions, filters),
    filters.sort
  );
  const editingTransaction = data.transactions.find((tx) => tx.id === editing) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <MonthTabs monthIndex={monthIndex} onChange={setMonthIndex} />
        <YearSelect
          year={year}
          onChange={setYear}
          options={getYearOptions(2024, 2027)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card-soft p-4">
          <p className="text-xs text-muted">Gasto do mês</p>
          <p className="text-lg font-semibold text-danger">
            {formatCurrency(summary.expenseCents)}
          </p>
        </div>
        <div className="card-soft p-4">
          <p className="text-xs text-muted">Recebido</p>
          <p className="text-lg font-semibold text-success">
            {formatCurrency(summary.incomeCents)}
          </p>
        </div>
        <div className="card-soft p-4">
          <p className="text-xs text-muted">Saldo</p>
          <p className="text-lg font-semibold">
            {formatCurrency(summary.balanceCents)}
          </p>
        </div>
        <div className="card-soft p-4">
          <p className="text-xs text-muted">Parcelas do mês</p>
          <p className="text-lg font-semibold text-primary">
            {formatCurrency(summary.installmentCents)}
          </p>
        </div>
      </div>

      <FiltersBar filters={filters} onOpen={() => setFilterOpen(true)} />

      <TransactionList
        transactions={filtered}
        categories={data.categories}
        onEdit={(id) => setEditing(id)}
        onDuplicate={(id) => {
          useFinanceStore.getState().duplicateTransaction(id);
          push("Transação duplicada.", "success");
        }}
        onDelete={(id) => {
          useFinanceStore.getState().deleteTransaction(id);
          push("Transação excluída.", "success");
        }}
      />

      <EditTransactionModal
        open={Boolean(editingTransaction)}
        transaction={editingTransaction}
        categories={data.categories}
        onClose={() => setEditing(null)}
        onSave={(id, patch) => {
          useFinanceStore.getState().updateTransaction(id, patch);
          setEditing(null);
          push("Transação atualizada.", "success");
        }}
      />

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        categories={data.categories}
      />
    </div>
  );
}









