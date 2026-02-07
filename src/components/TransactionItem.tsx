"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Copy, Trash2 } from "lucide-react";
import type { Category, Transaction } from "@/lib/types";
import { formatCurrency, formatDateShort } from "@/lib/format";
import { getIcon } from "@/components/icons";

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const paymentLabels: Record<Transaction["paymentMethod"], string> = {
  pix: "Pix",
  debit: "Débito",
  credit: "Crédito",
  cash: "Dinheiro",
};

export function TransactionItem({
  transaction,
  category,
  onEdit,
  onDuplicate,
  onDelete,
}: TransactionItemProps) {
  const [open, setOpen] = useState(false);
  const Icon = getIcon(category?.icon);

  return (
    <div className="card-soft flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold">
            {category?.name ?? "Sem categoria"}
          </p>
          <p className="text-xs text-muted">
            {formatDateShort(transaction.dateISO)} -{" "}
            {paymentLabels[transaction.paymentMethod]}
            {transaction.installment
              ? ` - ${transaction.installment.current}/${transaction.installment.total}`
              : ""}
          </p>
          {transaction.note && (
            <p className="text-xs text-muted">{transaction.note}</p>
          )}
        </div>
      </div>
      <div className="relative flex items-center gap-3">
        <span
          className={
            transaction.type === "expense"
              ? "text-sm font-semibold text-danger"
              : "text-sm font-semibold text-success"
          }
        >
          {transaction.type === "expense" ? "-" : "+"}
          {formatCurrency(transaction.amountCents)}
        </span>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full p-2 hover:bg-card-soft"
        >
          <MoreVertical size={18} />
        </button>
        {open && (
          <div className="absolute right-0 top-10 z-20 w-40 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]">
            <button
              type="button"
              onClick={() => {
                onEdit(transaction.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-card-soft"
            >
              <Pencil size={14} />
              Editar
            </button>
            <button
              type="button"
              onClick={() => {
                onDuplicate(transaction.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-card-soft"
            >
              <Copy size={14} />
              Duplicar
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(transaction.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-danger hover:bg-danger/10"
            >
              <Trash2 size={14} />
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}








