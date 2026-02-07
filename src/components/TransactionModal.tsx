"use client";

import { useEffect, useState } from "react";
import type { Category, PaymentMethod, TransactionType } from "@/lib/types";
import { MoneyInput } from "@/components/MoneyInput";
import { Modal } from "@/components/Modal";
import { InstallmentForm } from "@/components/InstallmentForm";
import { getTodayISO, isValidISODate } from "@/lib/date";
import { useToast } from "@/components/ToastProvider";

interface TransactionModalProps {
  open: boolean;
  type: TransactionType;
  categories: Category[];
  defaultCategoryId?: string;
  initialAmountCents?: number;
  onClose: () => void;
  onSave: (payload: {
    type: TransactionType;
    amountCents: number;
    dateISO: string;
    categoryId: string;
    paymentMethod: PaymentMethod;
    note?: string;
    installment?: {
      installmentCount: number;
      firstDateISO: string;
      intervalMonths: number;
    };
  }) => void;
}

export function TransactionModal({
  open,
  type,
  categories,
  defaultCategoryId,
  initialAmountCents,
  onClose,
  onSave,
}: TransactionModalProps) {
  const { push } = useToast();
  const [amountCents, setAmountCents] = useState(0);
  const [dateISO, setDateISO] = useState(getTodayISO());
  const [categoryId, setCategoryId] = useState<string>(
    defaultCategoryId ?? categories[0]?.id ?? ""
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [note, setNote] = useState("");
  const [installmentCount, setInstallmentCount] = useState(0);
  const intervalMonths = 1;
  const [firstDateISO, setFirstDateISO] = useState(getTodayISO());

  useEffect(() => {
    if (open) {
      setAmountCents(initialAmountCents ?? 0);
      setDateISO(getTodayISO());
      setCategoryId(defaultCategoryId ?? categories[0]?.id ?? "");
      setPaymentMethod(type === "income" ? "pix" : "debit");
      setNote("");
      setInstallmentCount(0);
      setFirstDateISO(getTodayISO());
    }
  }, [open, type, categories, defaultCategoryId]);

  useEffect(() => {
    if (type !== "expense") return;
    if (installmentCount > 1 && paymentMethod !== "credit") {
      setPaymentMethod("credit");
    }
  }, [installmentCount, paymentMethod, type]);

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
    if (type === "expense" && installmentCount >= 2) {
      if (installmentCount < 2 || installmentCount > 48) {
        push("Parcelas devem ser entre 2 e 48.", "error");
        return;
      }
      onSave({
        type,
        amountCents,
        dateISO,
        categoryId,
        paymentMethod: "credit",
        note,
        installment: {
          installmentCount,
          firstDateISO: dateISO,
          intervalMonths,
        },
      });
      return;
    }

    onSave({
      type,
      amountCents,
      dateISO,
      categoryId,
      paymentMethod,
      note,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={type === "expense" ? "Nova despesa" : "Nova receita"}
    >
      <div className="space-y-4 text-sm">
        <div className="grid gap-3">
          <div>
            <label className="text-xs text-muted">Valor</label>
            <MoneyInput
              valueCents={amountCents}
              onChangeCents={setAmountCents}
              className="h-12 text-base w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Data</label>
            <input
              type="date"
              value={dateISO}
              onChange={(event) => setDateISO(event.target.value)}
              className="h-12 w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Categoria</label>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="h-12 w-full"
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
                setPaymentMethod(event.target.value as PaymentMethod)
              }
              className="h-12 w-full"
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
            className="h-12 w-full"
          />
          </div>
        </div>
        {type === "expense" && (
          <InstallmentForm
            installmentCount={installmentCount}
            intervalMonths={intervalMonths}
            firstDateISO={firstDateISO}
            onChange={(values) => {
              setInstallmentCount(values.installmentCount);
              setFirstDateISO(values.firstDateISO);
            }}
          />
        )}
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
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}
