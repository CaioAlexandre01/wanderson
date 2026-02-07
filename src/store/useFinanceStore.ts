import { create } from "zustand";
import { firestoreProvider } from "@/lib/storage/firestoreProvider";
import type {
  Category,
  FinanceData,
  PersistedData,
  PurchaseInstallmentPlan,
  Settings,
  Transaction,
  TransactionType,
  PaymentMethod,
} from "@/lib/types";
import { generateInstallments } from "@/lib/finance/installments";
import { toYearMonth } from "@/lib/date";

const STORAGE_KEY = "app-finance:data";
const STORAGE_VERSION = 1;

const DEFAULT_CATEGORY_ID = "cat-geral";

const defaultCategories: Category[] = [
  { id: DEFAULT_CATEGORY_ID, name: "Geral", icon: "Wallet" },
  { id: "cat-mercado", name: "Mercado", icon: "ShoppingBag" },
  { id: "cat-transporte", name: "Transporte", icon: "Car" },
  { id: "cat-lazer", name: "Lazer", icon: "Sparkles" },
  { id: "cat-conta", name: "Conta", icon: "Receipt" },
  { id: "cat-saude", name: "Saúde", icon: "HeartPulse" },
];

const defaultSettings: Settings = {
  monthlyLimitCentsByYearMonth: {},
  monthlySalaryCents: 0,
  salaryDay: 5,
  defaultCategoryId: DEFAULT_CATEGORY_ID,
};

const seedTransactions: Transaction[] = [];

const seedData: FinanceData = {
  transactions: seedTransactions,
  installmentPlans: [],
  categories: defaultCategories,
  settings: defaultSettings,
};

const storage = firestoreProvider();

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeData = (data: FinanceData): FinanceData => {
  const categories = data.categories?.length ? data.categories : defaultCategories;
  const hasDefault = categories.some((cat) => cat.id === DEFAULT_CATEGORY_ID);
  const nextCategories = hasDefault
    ? categories
    : [{ id: DEFAULT_CATEGORY_ID, name: "Geral" }, ...categories];

  return {
    transactions: data.transactions ?? [],
    installmentPlans: data.installmentPlans ?? [],
    categories: nextCategories,
    settings: {
      monthlyLimitCentsByYearMonth:
        data.settings?.monthlyLimitCentsByYearMonth ?? {},
      monthlySalaryCents: data.settings?.monthlySalaryCents,
      salaryDay: data.settings?.salaryDay,
      defaultCategoryId: data.settings?.defaultCategoryId ?? DEFAULT_CATEGORY_ID,
    },
  };
};

interface FinanceState {
  data: FinanceData;
  hydrated: boolean;
  loadFromStorage: () => Promise<void>;
  resetData: () => Promise<void>;
  importData: (data: FinanceData) => void;
  exportData: () => string;
  addTransaction: (input: {
    type: TransactionType;
    amountCents: number;
    dateISO: string;
    categoryId: string;
    paymentMethod: PaymentMethod;
    note?: string;
  }) => void;
  addInstallmentPurchase: (input: {
    totalAmountCents: number;
    installmentCount: number;
    firstDateISO: string;
    intervalMonths?: number;
    categoryId: string;
    note?: string;
  }) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => void;
  addCategory: (name: string, icon?: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setMonthlyLimit: (yearMonth: string, amountCents: number) => void;
  setSalarySettings: (amountCents?: number, day?: number) => void;
  createSalaryIncome: (yearMonth?: string) => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  data: seedData,
  hydrated: false,
  loadFromStorage: async () => {
    if (get().hydrated) return;
    try {
      const raw = await storage.get(STORAGE_KEY);
      if (!raw) {
        set({ data: seedData, hydrated: true });
        return;
      }
      const parsed = JSON.parse(raw) as PersistedData;
      if (parsed.version !== STORAGE_VERSION) {
        set({ data: seedData, hydrated: true });
        return;
      }
      set({ data: normalizeData(parsed.data), hydrated: true });
    } catch {
      set({ data: seedData, hydrated: true });
    }
  },
  resetData: async () => {
    await storage.clear(STORAGE_KEY);
    set({ data: seedData });
  },
  importData: (data) => set({ data: normalizeData(data) }),
  exportData: () => {
    const payload: PersistedData = {
      version: STORAGE_VERSION,
      data: get().data,
    };
    return JSON.stringify(payload, null, 2);
  },
  addTransaction: (input) =>
    set((state) => ({
      data: {
        ...state.data,
        transactions: [
          {
            id: createId(),
            createdAt: Date.now(),
            ...input,
          },
          ...state.data.transactions,
        ],
      },
    })),
  addInstallmentPurchase: (input) =>
    set((state) => {
      const purchaseId = createId();
      const { plan, transactions } = generateInstallments({
        purchaseId,
        totalAmountCents: input.totalAmountCents,
        installmentCount: input.installmentCount,
        firstDateISO: input.firstDateISO,
        intervalMonths: input.intervalMonths,
        categoryId: input.categoryId,
        note: input.note,
      });

      return {
        data: {
          ...state.data,
          installmentPlans: [plan, ...state.data.installmentPlans],
          transactions: [...transactions, ...state.data.transactions],
        },
      };
    }),
  updateTransaction: (id, patch) =>
    set((state) => ({
      data: {
        ...state.data,
        transactions: state.data.transactions.map((tx) =>
          tx.id === id ? { ...tx, ...patch } : tx
        ),
      },
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        transactions: state.data.transactions.filter((tx) => tx.id !== id),
      },
    })),
  duplicateTransaction: (id) =>
    set((state) => {
      const tx = state.data.transactions.find((item) => item.id === id);
      if (!tx) return state;
      return {
        data: {
          ...state.data,
          transactions: [
            {
              ...tx,
              id: createId(),
              createdAt: Date.now(),
            },
            ...state.data.transactions,
          ],
        },
      };
    }),
  addCategory: (name, icon) =>
    set((state) => ({
      data: {
        ...state.data,
        categories: [
          ...state.data.categories,
          { id: createId(), name, icon },
        ],
      },
    })),
  updateCategory: (id, updates) =>
    set((state) => ({
      data: {
        ...state.data,
        categories: state.data.categories.map((cat) =>
          cat.id === id ? { ...cat, ...updates } : cat
        ),
      },
    })),
  deleteCategory: (id) =>
    set((state) => {
      if (id === DEFAULT_CATEGORY_ID) return state;
      const nextCategories = state.data.categories.filter(
        (cat) => cat.id !== id
      );
      const nextTransactions = state.data.transactions.map((tx) =>
        tx.categoryId === id ? { ...tx, categoryId: DEFAULT_CATEGORY_ID } : tx
      );
      return {
        data: {
          ...state.data,
          categories: nextCategories,
          transactions: nextTransactions,
        },
      };
    }),
  setMonthlyLimit: (yearMonth, amountCents) =>
    set((state) => ({
      data: {
        ...state.data,
        settings: {
          ...state.data.settings,
          monthlyLimitCentsByYearMonth: {
            ...state.data.settings.monthlyLimitCentsByYearMonth,
            [yearMonth]: amountCents,
          },
        },
      },
    })),
  setSalarySettings: (amountCents, day) =>
    set((state) => ({
      data: {
        ...state.data,
        settings: {
          ...state.data.settings,
          monthlySalaryCents: amountCents ?? state.data.settings.monthlySalaryCents,
          salaryDay: day ?? state.data.settings.salaryDay,
        },
      },
    })),
  createSalaryIncome: (yearMonth) =>
    set((state) => {
      const settings = state.data.settings;
      if (!settings.monthlySalaryCents) return state;
      const day = settings.salaryDay ?? 5;
      const target = yearMonth ?? toYearMonth();
      const dateISO = `${target}-${String(day).padStart(2, "0")}`;
      const salaryTx: Transaction = {
        id: createId(),
        type: "income",
        amountCents: settings.monthlySalaryCents,
        dateISO,
        categoryId: settings.defaultCategoryId ?? DEFAULT_CATEGORY_ID,
        paymentMethod: "pix",
        note: "Salário",
        createdAt: Date.now(),
      };
      return {
        data: {
          ...state.data,
          transactions: [salaryTx, ...state.data.transactions],
        },
      };
    }),
}));

const persistState = async (data: FinanceData) => {
  const payload: PersistedData = { version: STORAGE_VERSION, data };
  await storage.set(STORAGE_KEY, JSON.stringify(payload));
};

if (typeof window !== "undefined") {
  const globalKey = "__appFinanceStoreSubscribed";
  const anyWindow = window as unknown as Record<string, boolean>;
  if (!anyWindow[globalKey]) {
    anyWindow[globalKey] = true;
    useFinanceStore.subscribe((state) => {
      if (!state.hydrated) return;
      void persistState(state.data);
    });
  }
}








