"use client";

import { useEffect, useState } from "react";
import type { Category, Transaction } from "@/lib/types";
import { MoneyInput } from "@/components/MoneyInput";
import { Modal } from "@/components/Modal";
import { isValidISODate } from "@/lib/date";
import { useToast } from "@/components/ToastProvider";

interface EditTransactionModalProps {
  open: boolean;
  transaction: Transaction | null;
  categories: Category[];
  onClose: () => void;
  onSave: (id: string, patch: Partial<Transaction>) => void;
}

export function EditTransactionModal({
  open,
  transaction,
  categories,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  const { push } = useToast();
  const [amountCents, setAmountCents] = useState(0);
  const [dateISO, setDateISO] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<Transaction["paymentMethod"]>("pix");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open && transaction) {
      setAmountCents(transaction.amountCents);
      setDateISO(transaction.dateISO);
      setCategoryId(transaction.categoryId);
      setPaymentMethod(transaction.paymentMethod);
      setNote(transaction.note ?? "");
    }
  }, [open, transaction]);

  if (!transaction) return null;

  const handleSave = () => {
    if (!amountCents || amountCents <= 0) {
      push("Informe um valor válido.", "error");
      return;
    }
    if (!categoryId) {
      push("Selecione uma categoria.", "error");
      return;
    }
    if (!isValidISODate(dateISO)) {
      push("Data inválida.", "error");
      return;
    }
    onSave(transaction.id, {
      amountCents,
      dateISO,
      categoryId,
      paymentMethod,
      note,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar transação">
      <div className="space-y-3 text-sm">
        {transaction.installment && (
          <p className="text-xs text-muted">
            Esta transação faz parte de um parcelamento (
            {transaction.installment.current}/{transaction.installment.total}).
          </p>
        )}
        <div>
          <label className="text-xs text-muted">Valor</label>
          <MoneyInput
            valueCents={amountCents}
            onChangeCents={setAmountCents}
            className="h-12 text-base"
          />
        </div>
        <div>
          <label className="text-xs text-muted">Data</label>
          <input
            type="date"
            value={dateISO}
            onChange={(event) => setDateISO(event.target.value)}
            className="h-12"
          />
        </div>
        <div>
          <label className="text-xs text-muted">Categoria</label>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="h-12"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted">Pagamento</label>
          <select
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(event.target.value as Transaction["paymentMethod"])
            }
            className="h-12"
          >
            <option value="pix">Pix</option>
            <option value="debit">Débito</option>
            <option value="credit">Crédito</option>
            <option value="cash">Dinheiro</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted">Nota</label>
          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ex: Uber, Mercado, Farmácia"
            className="h-12"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary w-full h-11 text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary w-full h-11 text-sm"
          >
            Atualizar
          </button>
        </div>
      </div>
    </Modal>
  );
}








