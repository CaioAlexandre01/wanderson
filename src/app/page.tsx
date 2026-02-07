"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DonutLimitChart } from "@/components/DonutLimitChart";
import { QuickAddBar } from "@/components/QuickAddBar";
import { TransactionModal } from "@/components/TransactionModal";
import { useToast } from "@/components/ToastProvider";
import {
  getMonthlyLimit,
  getMonthlySummary,
  getTransactionsForYearMonth,
} from "@/lib/finance/calc";
import { toYearMonth } from "@/lib/date";
import { useFinanceStore } from "@/store/useFinanceStore";

export default function HomePage() {
  const router = useRouter();
  const { push } = useToast();
  const data = useFinanceStore((state) => state.data);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const addInstallmentPurchase = useFinanceStore(
    (state) => state.addInstallmentPurchase
  );

  const [amountCents, setAmountCents] = useState(0);
  const [modalType, setModalType] = useState<"expense" | "income" | null>(null);

  const yearMonth = toYearMonth();
  const monthTransactions = useMemo(
    () => getTransactionsForYearMonth(data.transactions, yearMonth),
    [data.transactions, yearMonth]
  );
  const summary = getMonthlySummary(monthTransactions);
  const limitCents = getMonthlyLimit(data.settings, yearMonth);

  const handleSave = (
    payload: Parameters<typeof addTransaction>[0] & {
      installment?: {
        installmentCount: number;
        firstDateISO: string;
        intervalMonths: number;
      };
    }
  ) => {
    if (payload.installment) {
      addInstallmentPurchase({
        totalAmountCents: payload.amountCents,
        installmentCount: payload.installment.installmentCount,
        firstDateISO: payload.installment.firstDateISO,
        intervalMonths: payload.installment.intervalMonths,
        categoryId: payload.categoryId,
        note: payload.note,
      });
    } else {
      addTransaction(payload);
    }
    setAmountCents(0);
    setModalType(null);
    push("Transação salva!", "success");
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="w-full max-w-2xl space-y-1 mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <img
              src="/logo2.png"
              alt="Logo"
              className="logo-image logo-light h-36 w-auto object-contain"
            />
            <img
              src="/logo.png"
              alt="Logo"
              className="logo-image logo-dark h-36 w-auto object-contain"
            />
          </div>
        </div>

        <QuickAddBar
          amountCents={amountCents}
          onAmountChange={setAmountCents}
          onAddExpense={() => setModalType("expense")}
          onAddIncome={() => setModalType("income")}
        />

        <DonutLimitChart
          spentCents={summary.expenseCents}
          limitCents={limitCents}
          onClick={() => router.push("/limites")}
        />
      </div>

      <TransactionModal
        open={modalType === "expense"}
        type="expense"
        categories={data.categories}
        defaultCategoryId={data.settings.defaultCategoryId}
        initialAmountCents={amountCents}
        onClose={() => setModalType(null)}
        onSave={handleSave}
      />
      <TransactionModal
        open={modalType === "income"}
        type="income"
        categories={data.categories}
        defaultCategoryId={data.settings.defaultCategoryId}
        initialAmountCents={amountCents}
        onClose={() => setModalType(null)}
        onSave={handleSave}
      />
    </div>
  );
}
