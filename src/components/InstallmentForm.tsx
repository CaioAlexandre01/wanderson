"use client";

interface InstallmentFormProps {
  installmentCount: number;
  firstDateISO: string;
  intervalMonths: number;
  onChange: (values: {
    installmentCount: number;
    firstDateISO: string;
    intervalMonths: number;
  }) => void;
}

export function InstallmentForm({
  installmentCount,
  firstDateISO,
  intervalMonths,
  onChange,
}: InstallmentFormProps) {
  return (
    <div className="card-soft space-y-3 p-3 text-sm">
      <p className="text-sm font-semibold">Parcelamento</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs text-muted">Parcelas</label>
          <select
            value={installmentCount}
            onChange={(event) =>
              onChange({
                installmentCount: Number(event.target.value),
                firstDateISO,
                intervalMonths,
              })
            }
            className="h-11 w-full"
          >
            <option value={0}>Sem parcelamento</option>
            {Array.from({ length: 47 }, (_, index) => index + 2).map((value) => (
              <option key={value} value={value}>
                {value}x
              </option>
            ))}
          </select>
        </div>
        {installmentCount >= 2 && (
          <input type="hidden" value={firstDateISO} readOnly />
        )}
      </div>
    </div>
  );
}








