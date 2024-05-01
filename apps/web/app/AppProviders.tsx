"use client";

import { MeProvider } from "@repo/auth/context";
import { TooltipProvider } from "@repo/ui";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

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
          <TooltipProvider>{children}</TooltipProvider>
        </MeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
