"use client";

import { UserProfile } from "@clerk/nextjs";
import { LoadingScreen } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";
import { useMediaQuery } from "@repo/hooks";

export default function AccountPage() {
  const { isLoading: authIsLoading, me } = useMeContext();
  const isLargeWidth = useMediaQuery("(min-width: 768px)");

  if (!me || authIsLoading) return <LoadingScreen />;

  return (
    <div className="w-full mx-auto">
      <UserProfile
        appearance={{
          elements: {
            rootBox: {
              width: "100%",
            },
            cardBox: {
              width: "100%",
              maxWidth: "100%",
              boxShadow: "none",
            },
            navbar: {
              background: "#ffffff",
              width: isLargeWidth ? "25%" : "100%",
              maxWidth: isLargeWidth ? "25%" : "100%",
              flex: isLargeWidth ? "0 0 25%" : "0 0 100%",
            },
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
