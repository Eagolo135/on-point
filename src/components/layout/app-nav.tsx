"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/config/navigation";

type AppNavProps = {
  items: NavItem[];
  mobile?: boolean;
};

export function AppNav({ items, mobile = false }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav className={mobile ? "grid grid-cols-5 gap-2" : "space-y-2"}>
      {items.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              active
                ? "border-gold bg-gold/15 text-gold-strong"
                : "border-surface-border bg-surface/70 text-zinc-300 hover:border-gold/50 hover:text-zinc-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
