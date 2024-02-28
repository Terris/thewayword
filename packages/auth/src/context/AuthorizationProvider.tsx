"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { MeProvider } from "./MeContext";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "");

export function AuthorizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignInUrl={process.env.NEXT_PUBLIC_DASHBOARD_URL}
      afterSignUpUrl={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/onboard`}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <MeProvider>{children}</MeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
