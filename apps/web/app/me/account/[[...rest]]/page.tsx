"use client";

import { UserProfile } from "@clerk/nextjs";
import { LoadingScreen } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";

export default function AccountPage() {
  const { isLoading: authIsLoading, me } = useMeContext();

  if (!me || authIsLoading) return <LoadingScreen />;

  return (
    <div className="mx-auto">
      <UserProfile
        appearance={{
          elements: {
            cardBox: {
              boxShadow: "none",
            },
            navbar: { background: "#ffffff" },
            scrollBox: {
              borderRadius: "0",
              boxShadow: "none",
            },
          },
          variables: {
            colorText: "#586659",
            colorPrimary: "#586659",
            borderRadius: "0.25rem",
            fontSize: "1rem",
          },
        }}
      />
    </div>
  );
}
