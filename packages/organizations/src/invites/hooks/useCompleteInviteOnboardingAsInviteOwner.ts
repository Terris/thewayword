import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@repo/convex";
import { useMeContext } from "@repo/auth/context";
import type { OrganizationInviteId } from "../types";

export function useCompleteInviteOnboardingAsInviteOwner() {
  const { me } = useMeContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const completeDBOnboarding = useMutation(
    api.organizationInvites.sessionedCompleteInviteOnboardingAsEmailOwner
  );

  async function completeInviteOnboarding({
    inviteToken,
    onSuccess,
  }: {
    inviteToken: OrganizationInviteId;
    onSuccess?: () => void;
  }) {
    setIsLoading(true);
    try {
      if (!me) throw new Error("No user found in session.");
      if (!inviteToken) throw new Error("No invite token provided.");
      await completeDBOnboarding({ inviteToken, email: me.email });
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, completeInviteOnboarding };
}
