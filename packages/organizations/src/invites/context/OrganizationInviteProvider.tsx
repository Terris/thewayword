"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";
import {
  useGetOrganizationUserAsMe,
  useCreateOrganizationUserWithInviteAsMe,
} from "../../users/hooks";
import type {
  OrganizationInviteId,
  OrganizationInviteWithOrgDoc,
} from "../types";
import {
  useGetInviteWithTokenParam,
  useCompleteInviteOnboardingAsInviteOwner,
} from "../hooks";

interface OrganizationInviteContextProps {
  inviteToken?: OrganizationInviteId;
  isLoading: boolean;
  isMutating: boolean;
  invite?: OrganizationInviteWithOrgDoc | null;
  completeOnboarding: () => void;
}

const initialProps = {
  inviteToken: undefined,
  isLoading: true,
  isMutating: false,
  invite: undefined,
  orgUserId: undefined,
  completeOnboarding: () => null,
};

export const OrganizationInviteContext =
  createContext<OrganizationInviteContextProps>(initialProps);

interface OrganizationInviteProviderProps {
  children: ReactNode;
}

export function OrganizationInviteProvider({
  children,
}: OrganizationInviteProviderProps) {
  const router = useRouter();
  const { me } = useMeContext();

  // GET INVITE
  const {
    inviteToken,
    invite,
    isLoading: inviteIsLoading,
  } = useGetInviteWithTokenParam();

  // PUSH TO HOME IF NO DB INVITE
  useEffect(() => {
    if (inviteIsLoading) return;
    if (!invite) {
      router.push(process.env.NEXT_PUBLIC_SITE_URL ?? "/");
    }
  }, [invite, inviteIsLoading, router]);

  const { isLoading: organizationUserIsLoading, organizationUser } =
    useGetOrganizationUserAsMe({
      organizationId: invite?.organizationId,
    });

  // CREATE ORG USER
  const { isLoading: createOrganizationUserIsLoading, createOrganizationUser } =
    useCreateOrganizationUserWithInviteAsMe();

  // SYNC INVITE TO ORGANIZATION USER
  useEffect(() => {
    const canCreateOrgUser =
      Boolean(me) &&
      Boolean(inviteToken) &&
      Boolean(invite) &&
      !organizationUserIsLoading &&
      !organizationUser &&
      !createOrganizationUserIsLoading;
    if (!canCreateOrgUser) return;
    void createOrganizationUser({
      inviteToken: inviteToken as OrganizationInviteId,
    });
  }, [
    createOrganizationUser,
    createOrganizationUserIsLoading,
    invite,
    inviteToken,
    me,
    organizationUser,
    organizationUserIsLoading,
  ]);

  // COMPLETE ONBOARDING
  const { completeInviteOnboarding, isLoading: completeOnboardingIsLoading } =
    useCompleteInviteOnboardingAsInviteOwner();

  async function completeOnboarding() {
    if (!organizationUser || !invite) return;
    await completeInviteOnboarding({
      inviteToken: inviteToken as OrganizationInviteId,
      onSuccess: () => {
        router.push(`/org/${invite.organization.slug}`);
      },
    });
  }

  const isLoading = inviteIsLoading || organizationUserIsLoading;
  const isMutating =
    createOrganizationUserIsLoading || completeOnboardingIsLoading;

  return (
    <OrganizationInviteContext.Provider
      value={{
        isLoading,
        isMutating,
        invite,
        completeOnboarding,
      }}
    >
      {isLoading || !invite ? <LoadingScreen /> : children}
    </OrganizationInviteContext.Provider>
  );
}

export const useOrganizationInviteContext = () => {
  const organizationInviteContext = useContext(OrganizationInviteContext);
  return organizationInviteContext;
};
