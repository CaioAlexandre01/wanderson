"use client";

import { useMemo, useState } from "react";
import { getIcon, iconMap } from "@/components/icons";
import { useToast } from "@/components/ToastProvider";
import { useFinanceStore } from "@/store/useFinanceStore";

export default function CategoriasPage() {
  const { push } = useToast();
  const data = useFinanceStore((state) => state.data);
  const addCategory = useFinanceStore((state) => state.addCategory);
  const updateCategory = useFinanceStore((state) => state.updateCategory);
  const deleteCategory = useFinanceStore((state) => state.deleteCategory);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Wallet");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const iconOptions = useMemo(() => Object.keys(iconMap), []);

  return (
    <div className="flex flex-col gap-6">
      <div className="card p-4">
        <p className="text-xs text-muted">Nova categoria</p>
        <div className="mt-3 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nome da categoria"
          />
          <select value={icon} onChange={(event) => setIcon(event.target.value)}>
            {iconOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              if (!name.trim()) return;
              addCategory(name.trim(), icon);
              setName("");
              push("Categoria criada.", "success");
            }}
          >
            Adicionar categoria
          </button>
        </div>
      </div>

      <div className="card-soft p-4">
        <p className="text-sm font-semibold">Categorias cadastradas</p>
        <div className="mt-3 flex flex-col gap-3">
          {data.categories.map((category) => {
            const Icon = getIcon(category.icon);
            return (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-2xl bg-card-soft px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={18} />
                  </span>
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                    />
                  ) : (
                    <span className="text-sm font-semibold">{category.name}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingId === category.id ? (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        updateCategory(category.id, { name: editingName });
                        setEditingId(null);
                        push("Categoria atualizada.", "success");
                      }}
                    >
                      Salvar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setEditingId(category.id);
                        setEditingName(category.name);
                      }}
                    >
                      Editar
                    </button>
                  )}
                  {category.id !== data.settings.defaultCategoryId && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        deleteCategory(category.id);
                        push("Categoria removida.", "success");
                      }}
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}









