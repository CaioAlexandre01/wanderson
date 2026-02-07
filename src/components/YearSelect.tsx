"use client";

interface YearSelectProps {
  year: number;
  onChange: (year: number) => void;
  options: number[];
}

export function YearSelect({ year, onChange, options }: YearSelectProps) {
  return (
    <select
      value={year}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-full h-12"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}








