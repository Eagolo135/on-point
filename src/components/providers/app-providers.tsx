"use client";

import { AuthProvider } from "@/features/auth/auth-context";
import { GoogleCalendarProvider } from "@/features/google/google-calendar-context";
import { PlannerProvider } from "@/features/planner/planner-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GoogleCalendarProvider>
        <PlannerProvider>{children}</PlannerProvider>
      </GoogleCalendarProvider>
    </AuthProvider>
  );
}
