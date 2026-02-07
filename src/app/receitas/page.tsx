"use client";

import { useMemo, useState } from "react";
import { TransactionList } from "@/components/TransactionList";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { TransactionModal } from "@/components/TransactionModal";
import { useToast } from "@/components/ToastProvider";
import { formatCurrency } from "@/lib/format";
import { sortTransactions } from "@/store/selectors";
import { useFinanceStore } from "@/store/useFinanceStore";

export default function ReceitasPage() {
  const { push } = useToast();
  const data = useFinanceStore((state) => state.data);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const incomes = useMemo(
    () =>
      sortTransactions(
        data.transactions.filter((tx) => tx.type === "income"),
        "recent"
      ),
    [data.transactions]
  );

  const total = incomes.reduce((sum, tx) => sum + tx.amountCents, 0);
  const editingTransaction = data.transactions.find((tx) => tx.id === editing) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="card p-4">
        <p className="text-xs text-muted">Total de receitas</p>
        <p className="text-2xl font-semibold text-success">
          {formatCurrency(total)}
        </p>
        <button type="button" onClick={() => setOpen(true)} className="btn-income mt-4">
          Adicionar receita
        </button>
      </div>

      <TransactionList
        transactions={incomes}
        categories={data.categories}
        onEdit={(id) => setEditing(id)}
        onDuplicate={(id) => {
          useFinanceStore.getState().duplicateTransaction(id);
          push("Receita duplicada.", "success");
        }}
        onDelete={(id) => {
          useFinanceStore.getState().deleteTransaction(id);
          push("Receita excluída.", "success");
        }}
      />

      <EditTransactionModal
        open={Boolean(editingTransaction)}
        transaction={editingTransaction}
        categories={data.categories}
        onClose={() => setEditing(null)}
        onSave={(id, patch) => {
          updateTransaction(id, patch);
          setEditing(null);
          push("Receita atualizada.", "success");
        }}
      />

      <TransactionModal
        open={open}
        type="income"
        categories={data.categories}
        defaultCategoryId={data.settings.defaultCategoryId}
        onClose={() => setOpen(false)}
        onSave={(payload) => {
          addTransaction(payload);
          setOpen(false);
          push("Receita salva!", "success");
        }}
      />
    </div>
  );
}









