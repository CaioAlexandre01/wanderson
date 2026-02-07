"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import { formatCentsInput, parseCurrencyToCents } from "@/lib/format";

interface MoneyInputProps {
  valueCents: number;
  onChangeCents: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function MoneyInput({
  valueCents,
  onChangeCents,
  placeholder = "R$ 0,00",
  className,
  disabled,
  id,
}: MoneyInputProps) {
  const displayValue = formatCentsInput(valueCents);

  return (
    <div className="relative w-full">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={(event) => {
          const nextCents = parseCurrencyToCents(event.target.value);
          onChangeCents(nextCents);
        }}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx("w-full pr-10", className)}
      />
      {!disabled && valueCents > 0 && (
        <button
          type="button"
          onClick={() => onChangeCents(0)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
          aria-label="Limpar valor"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}








