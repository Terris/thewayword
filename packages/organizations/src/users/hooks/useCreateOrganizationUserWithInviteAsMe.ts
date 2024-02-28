import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@repo/convex";
import { useMeContext } from "@repo/auth/context";
import type { OrganizationInviteId } from "../../invites/types";
import type { OrganizationUserId } from "../types";

interface CreateOrganizationUserArgs {
  inviteToken: OrganizationInviteId;
}

export function useCreateOrganizationUserWithInviteAsMe() {
  const { me } = useMeContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newOrganizationUserId, setNewOrganizationUserId] =
    useState<OrganizationUserId | null>(null);

  const createDBOrganizationUser = useMutation(
    api.organizationUsers.sessionedCreateOneByInviteTokenUserId
  );

  async function createOrganizationUser({
    inviteToken,
  }: CreateOrganizationUserArgs) {
    if (!me || !inviteToken) return;

    try {
      setIsLoading(true);
      const newOrganizationUserId = await createDBOrganizationUser({
        inviteToken,
        userId: me.id,
      });
      setNewOrganizationUserId(newOrganizationUserId);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, createOrganizationUser, newOrganizationUserId };
}
