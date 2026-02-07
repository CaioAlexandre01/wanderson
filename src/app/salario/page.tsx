"use client";

import { useState } from "react";
import { MoneyInput } from "@/components/MoneyInput";
import { useToast } from "@/components/ToastProvider";
import { useFinanceStore } from "@/store/useFinanceStore";

export default function SalarioPage() {
  const { push } = useToast();
  const settings = useFinanceStore((state) => state.data.settings);
  const setSalarySettings = useFinanceStore((state) => state.setSalarySettings);
  const createSalaryIncome = useFinanceStore((state) => state.createSalaryIncome);
  const [autoSuggest, setAutoSuggest] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="card p-4">
        <p className="text-xs text-muted">Salário mensal</p>
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs text-muted">Valor</label>
            <MoneyInput
              valueCents={settings.monthlySalaryCents ?? 0}
              onChangeCents={(value) => setSalarySettings(value, settings.salaryDay)}
            />
          </div>
          <div>
            <label className="text-xs text-muted">Dia do pagamento (1-28)</label>
            <input
              type="number"
              min={1}
              max={28}
              value={settings.salaryDay ?? 5}
              onChange={(event) =>
                setSalarySettings(
                  settings.monthlySalaryCents,
                  Math.min(28, Math.max(1, Number(event.target.value)))
                )
              }
            />
          </div>
        </div>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => {
            createSalaryIncome();
            push("Receita de salário gerada.", "success");
          }}
        >
          Gerar receita do salário para o mês atual
        </button>
      </div>

      <div className="card-soft p-4">
        <p className="text-sm font-semibold">Sugestão automática</p>
        <p className="text-xs text-muted">
          Ao abrir o mês, sugerir gerar automaticamente a receita do salário.
        </p>
        <button
          type="button"
          onClick={() => setAutoSuggest((prev) => !prev)}
          className={autoSuggest ? "btn-primary mt-3" : "btn-secondary mt-3"}
        >
          {autoSuggest ? "Ativado" : "Desativado"}
        </button>
      </div>
    </div>
  );
}









