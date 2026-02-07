"use client";

import { HamburgerMenu } from "@/components/HamburgerMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface HeaderProps {
  onMenu: () => void;
  navItems: Array<{ href: string; label: string }>;
}

export function Header({ onMenu, navItems }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <HamburgerMenu onClick={onMenu} />
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "nav-pill",
                  pathname === item.href && "nav-pill-active"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
