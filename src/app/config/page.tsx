"use client";

import { useRef } from "react";
import { useToast } from "@/components/ToastProvider";
import type { FinanceData, PersistedData } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { useFinanceStore } from "@/store/useFinanceStore";

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export default function ConfigPage() {
  const { push } = useToast();
  const exportData = useFinanceStore((state) => state.exportData);
  const importData = useFinanceStore((state) => state.importData);
  const resetData = useFinanceStore((state) => state.resetData);
  const data = useFinanceStore((state) => state.data);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (file: File) => {
    const text = await file.text();
    try {
      const parsed = JSON.parse(text) as PersistedData | FinanceData;
      const nextData = "data" in parsed ? parsed.data : parsed;
      if (!nextData.transactions || !nextData.categories) {
        throw new Error("Formato inválido");
      }
      importData(nextData);
      push("Dados importados.", "success");
    } catch {
      push("Arquivo inválido.", "error");
    }
  };

  const exportCsv = () => {
    const header = [
      "id",
      "type",
      "amount",
      "date",
      "categoryId",
      "paymentMethod",
      "note",
    ];
    const rows = data.transactions.map((tx) => [
      tx.id,
      tx.type,
      formatCurrency(tx.amountCents),
      tx.dateISO,
      tx.categoryId,
      tx.paymentMethod,
      tx.note ?? "",
    ]);
    const csv = [header, ...rows].map((row) => row.join(";"))
      .join("\n");
    downloadFile(csv, "app-finance.csv", "text/csv");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="card p-4">
        <p className="text-sm font-semibold">Backup</p>
        <div className="mt-3 flex flex-col gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => downloadFile(exportData(), "app-finance.json", "application/json")}
          >
            Exportar JSON
          </button>
          <button type="button" className="btn-secondary" onClick={exportCsv}>
            Exportar CSV
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleImport(file);
              }
            }}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => fileRef.current?.click()}
          >
            Importar JSON
          </button>
        </div>
      </div>

      <div className="card-soft p-4">
        <p className="text-sm font-semibold">Resetar dados</p>
        <p className="text-xs text-muted">
          Essa ação remove todas as transações e configurações locais.
        </p>
        <button
          type="button"
          className="btn-secondary mt-4"
          onClick={() => {
            if (confirm("Tem certeza que deseja resetar os dados?")) {
              resetData();
              push("Dados resetados.", "success");
            }
          }}
        >
          Resetar dados
        </button>
      </div>
    </div>
  );
}









