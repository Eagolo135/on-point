"use client";

import { AuthProvider } from "@/features/auth/auth-context";
import { PlannerProvider } from "@/features/planner/planner-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PlannerProvider>{children}</PlannerProvider>
    </AuthProvider>
  );
}
