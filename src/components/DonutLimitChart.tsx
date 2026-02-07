"use client";

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "@/lib/format";
interface DonutLimitChartProps {
  spentCents: number;
  limitCents: number;
  onClick?: () => void;
}

export function DonutLimitChart({
  spentCents,
  limitCents,
  onClick,
}: DonutLimitChartProps) {
  const hasLimit = limitCents > 0;
  const safeSpent = Math.min(spentCents, limitCents);
  const remaining = Math.max(limitCents - spentCents, 0);
  const percent = hasLimit ? Math.round((safeSpent / limitCents) * 100) : 0;

  const data = [
    { name: "Gasto", value: safeSpent },
    { name: "Restante", value: remaining },
  ];

  return (
    <button
      type="button"
      onClick={onClick}
      className="card w-full p-6 text-left transition hover:-translate-y-0.5"
    >
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted">
        <span>Gasto</span>
        <span>Disponível</span>
      </div>
      <div className="mb-4 flex items-center justify-between text-sm font-semibold">
        <span className="text-danger">{formatCurrency(spentCents)}</span>
        <span className="text-success">
          {formatCurrency(Math.max(limitCents - spentCents, 0))}
        </span>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative h-40 w-40">
          {hasLimit ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={56}
                  outerRadius={78}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="var(--color-danger)" />
                  <Cell fill="var(--color-success)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10">
              <span className="text-xs text-primary">Definir limite</span>
            </div>
          )}
          {hasLimit && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold">{percent}%</span>
              <span className="text-[11px] text-muted">Definir limite</span>
            </div>
          )}
        </div>
      </div>

      {!hasLimit && (
        <p className="mt-3 text-xs text-muted">
          Toque para definir o limite do mês.
        </p>
      )}
    </button>
  );
}






