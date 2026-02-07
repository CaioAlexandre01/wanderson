export type TransactionType = "expense" | "income";
export type PaymentMethod = "pix" | "debit" | "credit" | "cash";

export type YearMonth = `${number}-${string}`;

export interface Transaction {
  id: string;
  type: TransactionType;
  amountCents: number;
  dateISO: string;
  categoryId: string;
  paymentMethod: PaymentMethod;
  note?: string;
  createdAt: number;
  installment?: {
    purchaseId: string;
    current: number;
    total: number;
  };
}

export interface PurchaseInstallmentPlan {
  id: string;
  totalAmountCents: number;
  installmentCount: number;
  firstDateISO: string;
  intervalMonths?: number;
  paymentMethod: "credit";
  categoryId: string;
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Settings {
  monthlyLimitCentsByYearMonth: Record<string, number>;
  monthlySalaryCents?: number;
  salaryDay?: number;
  defaultCategoryId?: string;
}

export interface FinanceData {
  transactions: Transaction[];
  installmentPlans: PurchaseInstallmentPlan[];
  categories: Category[];
  settings: Settings;
}

export interface PersistedData {
  version: number;
  data: FinanceData;
}

export type SortOrder = "recent" | "amount";

export interface TransactionFilters {
  type?: TransactionType | "all";
  paymentMethod?: PaymentMethod | "all";
  categoryId?: string | "all";
  onlyInstallments?: boolean;
  minCents?: number;
  maxCents?: number;
  search?: string;
  sort?: SortOrder;
}








