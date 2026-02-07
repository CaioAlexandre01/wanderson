"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "app-finance:theme";

interface ThemeToggleProps {
  variant?: "icon" | "full";
  className?: string;
}

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
};

export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  const isDark = theme === "dark";
  const toggle = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label="Alternar tema"
      className={clsx(
        "relative h-10 w-[72px] rounded-full border border-border bg-card-soft shadow-[var(--shadow-soft)] transition-colors",
        variant === "full" ? undefined : className
      )}
    >
      <Sun
        size={15}
        className={clsx(
          "absolute left-2 top-1/2 z-10 -translate-y-1/2",
          isDark ? "text-muted" : "text-warning"
        )}
      />
      <Moon
        size={15}
        className={clsx(
          "absolute right-2 top-1/2 z-10 -translate-y-1/2",
          isDark ? "text-primary" : "text-muted"
        )}
      />
      <span
        className={clsx(
          "absolute left-1 top-1 h-8 w-8 rounded-full bg-foreground shadow-[var(--shadow-soft)] transition-transform duration-200",
          isDark && "translate-x-8"
        )}
      />
    </button>
  );

  if (variant === "full") {
    return (
      <div
        className={clsx(
          "flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-3 py-2 shadow-[var(--shadow-soft)]",
          className
        )}
      >
        <span className="text-sm font-semibold">Tema</span>
        {toggle}
      </div>
    );
  }

  return toggle;
}
