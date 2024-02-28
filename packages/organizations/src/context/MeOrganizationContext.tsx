"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { LoadingScreen } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useGetMeOrganization } from "../hooks/useGetMeOrganization";
import type { MeOrganizationDoc } from "../types";

interface OrganizationContextProps {
  isLoading: boolean;
  meOrganization: MeOrganizationDoc | undefined | null;
}

const initialProps = {
  isLoading: true,
  meOrganization: undefined,
};

export const OrganizationContext =
  createContext<OrganizationContextProps>(initialProps);

interface OrganizationProviderProps {
  children: ReactNode;
}

export function MeOrganizationProvider({
  children,
}: OrganizationProviderProps) {
  const { isLoading: meOrganizationIsLoading, meOrganization } =
    useGetMeOrganization();

  return (
    <OrganizationContext.Provider
      value={{
        isLoading: meOrganizationIsLoading,
        meOrganization,
      }}
    >
      {meOrganizationIsLoading ? <LoadingScreen /> : children}
    </OrganizationContext.Provider>
  );
}

export const useMeOrganizationContext = () => {
  const organizationContext = useContext(OrganizationContext);
  return organizationContext;
};

export function useRedirectIfNotMeOrgOwner({ toHref }: { toHref: string }) {
  const router = useRouter();
  const { meOrganization, isLoading } = useMeOrganizationContext();
  useEffect(() => {
    if (isLoading) return;
    if (!meOrganization || !meOrganization.meIsOwner) {
      router.replace(toHref);
    }
  }, [isLoading, meOrganization, router, toHref]);
}
