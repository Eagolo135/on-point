import type { ReactNode } from "react";

import { APP_NAV_ITEMS } from "@/config/navigation";

import { AppNav } from "./app-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="onpoint-shell min-h-screen text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-6 px-4 pb-24 pt-5 md:px-6 md:pb-8">
        <aside className="onpoint-card hidden h-fit w-60 p-4 md:block">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">On Point</p>
          <h2 className="mt-1 text-xl font-semibold">Command Center</h2>
          <div className="mt-5">
            <AppNav items={APP_NAV_ITEMS} />
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-surface-border bg-background/95 px-3 py-3 backdrop-blur md:hidden">
        <AppNav items={APP_NAV_ITEMS} mobile />
      </div>
    </div>
  );
}
