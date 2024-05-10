"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { MeProvider } from "@repo/auth/context";
import { TooltipProvider } from "@repo/ui";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "");

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInForceRedirectUrl="/feed"
      signUpForceRedirectUrl="/onboard"
      signInUrl="/signin"
      signUpUrl="/signup"
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <MeProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <TooltipProvider>{children}</TooltipProvider>
          </NextThemesProvider>
        </MeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
