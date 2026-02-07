"use client";

import type { Category, Transaction } from "@/lib/types";
import { TransactionItem } from "@/components/TransactionItem";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({
  transactions,
  categories,
  onEdit,
  onDuplicate,
  onDelete,
}: TransactionListProps) {
  if (!transactions.length) {
    return (
      <div className="card-soft p-6 text-center text-sm text-muted">
        Nenhuma transação encontrada.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((tx) => (
        <TransactionItem
          key={tx.id}
          transaction={tx}
          category={categories.find((cat) => cat.id === tx.categoryId)}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}








