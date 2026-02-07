"use client";

import { Menu } from "lucide-react";

interface HamburgerMenuProps {
  onClick: () => void;
}

export function HamburgerMenu({ onClick }: HamburgerMenuProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition hover:bg-card-soft"
      aria-label="Abrir menu"
    >
      <Menu size={18} />
    </button>
  );
}





