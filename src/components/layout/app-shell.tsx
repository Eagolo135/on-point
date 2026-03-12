"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { ReactNode } from "react";

import { APP_NAV_ITEMS } from "@/config/navigation";
import { useAuth } from "@/features/auth/auth-context";

import { AppNav } from "./app-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { user, isReady, signOut } = useAuth();

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/auth/sign-in");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <div className="onpoint-shell flex min-h-screen items-center justify-center px-4 text-sm text-zinc-300">
        Loading secure workspace...
      </div>
    );
  }

  return (
    <div className="onpoint-shell min-h-screen text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-6 px-4 pb-24 pt-5 md:px-6 md:pb-8">
        <aside className="onpoint-card hidden w-60 flex-col p-4 md:flex md:max-h-[calc(100vh-3.25rem)] md:sticky md:top-5">
          <div className="min-h-0 flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">On Point</p>
            <h2 className="mt-1 text-xl font-semibold">Command Center</h2>
            <p className="mt-1 text-xs text-zinc-300 break-all">{user.email}</p>
            <div className="mt-5 max-h-full overflow-y-auto pr-1">
              <AppNav items={APP_NAV_ITEMS} />
            </div>
          </div>
          <button
            onClick={() => {
              signOut();
              router.push("/auth/sign-in");
            }}
            className="mt-4 w-full rounded-md border border-surface-border px-2.5 py-2 text-sm text-zinc-200"
          >
            Log out
          </button>
        </aside>

        <main className="flex-1">{children}</main>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-surface-border bg-background/95 px-3 py-3 backdrop-blur md:hidden">
        <AppNav items={APP_NAV_ITEMS} mobile />
      </div>
    </div>
  );
}
