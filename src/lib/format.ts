import { isValidISODate } from "@/lib/date";

export const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

export function formatCurrency(cents: number): string {
  return brlFormatter.format(cents / 100);
}

export function formatCurrencyCompact(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function parseCurrencyToCents(input: string): number {
  const digits = input.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export function formatCentsInput(cents: number): string {
  if (!cents) return "";
  return brlFormatter.format(cents / 100);
}

export function formatDateShort(iso: string): string {
  if (!isValidISODate(iso)) return iso;
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}








