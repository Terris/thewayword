"use client";

import { AuthorizationProvider } from "@repo/auth/context";
import { TooltipProvider } from "@repo/ui";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthorizationProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </AuthorizationProvider>
  );
}
