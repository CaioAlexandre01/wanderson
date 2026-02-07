"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Drawer } from "@/components/Drawer";
import { Header } from "@/components/Header";
import { useFinanceStore } from "@/store/useFinanceStore";
import { PinGate } from "@/components/PinGate";
import { firestoreProvider } from "@/lib/storage/firestoreProvider";
import { DEVICE_KEY, PIN_KEY } from "@/lib/pin";

interface AppShellProps {
  children: React.ReactNode;
}

const headerNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resumos", label: "Resumos" },
];

const drawerNavItems = [{ href: "/", label: "Home" }, ...headerNavItems];

export function AppShell({ children }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const pathname = usePathname();
  const loadFromStorage = useFinanceStore((state) => state.loadFromStorage);
  const resetData = useFinanceStore((state) => state.resetData);

  useEffect(() => {
    if (!verified) return;
    void loadFromStorage();
  }, [loadFromStorage, verified]);

  const navLinks = useMemo(
    () =>
      drawerNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={clsx(
              "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition",
              isActive
                ? "bg-foreground text-background"
                : "bg-card-soft text-foreground hover:bg-card"
            )}
          >
            {item.label}
          </Link>
        );
      }),
    [pathname]
  );

  if (!verified) {
    return <PinGate onVerified={() => setVerified(true)} />;
  }

  return (
    <div className="min-h-screen text-foreground">
      <Header navItems={headerNavItems} onMenu={() => setOpen(true)} />
      <Drawer open={open} onClose={() => setOpen(false)} title="Menu">
        <div className="flex h-full flex-col gap-4">
          <nav className="flex flex-col gap-3">{navLinks}</nav>
          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={async () => {
                const ok = window.confirm(
                  "Tem certeza que deseja resetar tudo?"
                );
                if (!ok) return;
                await resetData();
                await firestoreProvider().clear(PIN_KEY);
                window.localStorage.removeItem(DEVICE_KEY);
                setVerified(false);
                setOpen(false);
              }}
              className="w-full rounded-2xl bg-danger px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:brightness-110"
            >
              Resetar tudo
            </button>
          </div>
        </div>
      </Drawer>
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6">
        {children}
      </main>
    </div>
  );
}





