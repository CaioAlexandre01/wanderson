"use client";

import { Drawer } from "@/components/Drawer";
import { MoneyInput } from "@/components/MoneyInput";
import type { Category, TransactionFilters } from "@/lib/types";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  categories: Category[];
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  categories,
}: FilterDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} title="Filtros">
      <div className="space-y-4">
        <label className="text-xs text-muted">Tipo</label>
        <select
          value={filters.type ?? "all"}
          onChange={(event) =>
            onChange({ ...filters, type: event.target.value as TransactionFilters["type"] })
          }
        >
          <option value="all">Todos</option>
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>

        <label className="text-xs text-muted">Pagamento</label>
        <select
          value={filters.paymentMethod ?? "all"}
          onChange={(event) =>
            onChange({
              ...filters,
              paymentMethod: event.target.value as TransactionFilters["paymentMethod"],
            })
          }
        >
          <option value="all">Todos</option>
          <option value="pix">Pix</option>
          <option value="debit">Débito</option>
          <option value="credit">Crédito</option>
          <option value="cash">Dinheiro</option>
        </select>

        <label className="text-xs text-muted">Categoria</label>
        <select
          value={filters.categoryId ?? "all"}
          onChange={(event) =>
            onChange({
              ...filters,
              categoryId: event.target.value as TransactionFilters["categoryId"],
            })
          }
        >
          <option value="all">Todas</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="text-xs text-muted">Somente parcelados</label>
        <button
          type="button"
          onClick={() =>
            onChange({ ...filters, onlyInstallments: !filters.onlyInstallments })
          }
          className={filters.onlyInstallments ? "btn-primary" : "btn-secondary"}
        >
          {filters.onlyInstallments ? "Ativo" : "Desativado"}
        </button>

        <label className="text-xs text-muted">Valor mínimo</label>
        <MoneyInput
          valueCents={filters.minCents ?? 0}
          onChangeCents={(value) =>
            onChange({ ...filters, minCents: value > 0 ? value : undefined })
          }
        />

        <label className="text-xs text-muted">Valor máximo</label>
        <MoneyInput
          valueCents={filters.maxCents ?? 0}
          onChangeCents={(value) =>
            onChange({ ...filters, maxCents: value > 0 ? value : undefined })
          }
        />

        <label className="text-xs text-muted">Buscar nota</label>
        <input
          type="text"
          value={filters.search ?? ""}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Ex: mercado"
        />

        <label className="text-xs text-muted">Ordenação</label>
        <select
          value={filters.sort ?? "recent"}
          onChange={(event) =>
            onChange({ ...filters, sort: event.target.value as TransactionFilters["sort"] })
          }
        >
          <option value="recent">Mais recente</option>
          <option value="amount">Maior valor</option>
        </select>

        <button
          type="button"
          onClick={() => onChange({})}
          className="btn-secondary w-full"
        >
          Limpar filtros
        </button>
      </div>
    </Drawer>
  );
}








