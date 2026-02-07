import type { Settings, Transaction } from "@/lib/types";

export function getTransactionsForYearMonth(
  transactions: Transaction[],
  yearMonth: string
): Transaction[] {
  return transactions.filter((tx) => tx.dateISO.startsWith(yearMonth));
}

export function sumByType(transactions: Transaction[], type: "expense" | "income") {
  return transactions
    .filter((tx) => tx.type === type)
    .reduce((sum, tx) => sum + tx.amountCents, 0);
}

export function sumInstallments(transactions: Transaction[]): number {
  return transactions
    .filter((tx) => Boolean(tx.installment))
    .reduce((sum, tx) => sum + tx.amountCents, 0);
}

export function getMonthlySummary(transactions: Transaction[]) {
  const expenseCents = sumByType(transactions, "expense");
  const incomeCents = sumByType(transactions, "income");
  return {
    expenseCents,
    incomeCents,
    balanceCents: incomeCents - expenseCents,
    installmentCents: sumInstallments(transactions),
  };
}

export function getMonthlyLimit(settings: Settings, yearMonth: string): number {
  return settings.monthlyLimitCentsByYearMonth[yearMonth] ?? 0;
}








