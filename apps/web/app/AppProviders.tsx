"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthorizationProvider } from "@repo/auth/context";
import { TooltipProvider } from "@repo/ui";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthorizationProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>{children}</TooltipProvider>
      </NextThemesProvider>
    </AuthorizationProvider>
  );
}
