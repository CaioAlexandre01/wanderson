import type { Transaction, TransactionFilters } from "@/lib/types";

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  return transactions.filter((tx) => {
    if (filters.type && filters.type !== "all" && tx.type !== filters.type) {
      return false;
    }
    if (
      filters.paymentMethod &&
      filters.paymentMethod !== "all" &&
      tx.paymentMethod !== filters.paymentMethod
    ) {
      return false;
    }
    if (
      filters.categoryId &&
      filters.categoryId !== "all" &&
      tx.categoryId !== filters.categoryId
    ) {
      return false;
    }
    if (filters.onlyInstallments && !tx.installment) {
      return false;
    }
    if (filters.minCents && tx.amountCents < filters.minCents) {
      return false;
    }
    if (filters.maxCents && tx.amountCents > filters.maxCents) {
      return false;
    }
    if (filters.search && filters.search.trim().length > 0) {
      const value = filters.search.trim().toLowerCase();
      if (!tx.note?.toLowerCase().includes(value)) {
        return false;
      }
    }
    return true;
  });
}

export function sortTransactions(
  transactions: Transaction[],
  order: TransactionFilters["sort"]
): Transaction[] {
  if (order === "amount") {
    return [...transactions].sort((a, b) => b.amountCents - a.amountCents);
  }
  return [...transactions].sort((a, b) => b.createdAt - a.createdAt);
}








