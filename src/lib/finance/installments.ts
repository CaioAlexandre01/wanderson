import { addMonthsISO, getTodayISO } from "@/lib/date";
import type {
  PurchaseInstallmentPlan,
  Transaction,
} from "@/lib/types";

interface InstallmentInput {
  purchaseId: string;
  totalAmountCents: number;
  installmentCount: number;
  firstDateISO: string;
  intervalMonths?: number;
  categoryId: string;
  note?: string;
}

export function generateInstallments(input: InstallmentInput): {
  plan: PurchaseInstallmentPlan;
  transactions: Transaction[];
} {
  const now = Date.now();
  const {
    purchaseId,
    totalAmountCents,
    installmentCount,
    firstDateISO,
    intervalMonths,
    categoryId,
    note,
  } = input;
  const interval = Math.max(1, intervalMonths ?? 1);

  const base = Math.floor(totalAmountCents / installmentCount);
  let remainder = totalAmountCents % installmentCount;

  const transactions: Transaction[] = Array.from(
    { length: installmentCount },
    (_, index) => {
      const amount = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder -= 1;

      return {
        id: `${purchaseId}-${index + 1}`,
        type: "expense",
        amountCents: amount,
        dateISO: addMonthsISO(firstDateISO, index * interval),
        categoryId,
        paymentMethod: "credit",
        note,
        createdAt: now,
        installment: {
          purchaseId,
          current: index + 1,
          total: installmentCount,
        },
      };
    }
  );

  const plan: PurchaseInstallmentPlan = {
    id: purchaseId,
    totalAmountCents,
    installmentCount,
    firstDateISO: firstDateISO || getTodayISO(),
    intervalMonths: interval,
    paymentMethod: "credit",
    categoryId,
    note,
  };

  return { plan, transactions };
}








