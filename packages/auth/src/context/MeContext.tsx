"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@repo/convex";
import { LoadingScreen } from "@repo/ui";
import type { UserId } from "../types";

interface User {
  id: UserId;
  name?: string;
  email: string;
  roles?: string[];
  isAuthorizedUser: boolean;
}

interface MeContextProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  me: User | null | undefined;
  hasRole: (role: string) => boolean;
}

const initialProps = {
  isLoading: true,
  error: null,
  isAuthenticated: false,
  isAuthorizedUser: false,
  me: null,
  hasRole: () => false,
};

export const MeContext = createContext<MeContextProps>(initialProps);

interface MeProviderProps {
  children: ReactNode;
}

export function MeProvider({ children }: MeProviderProps) {
  const router = useRouter();

  // Authentication
  const { isLoading: authIsLoading, isAuthenticated } = useConvexAuth();

  const me = useQuery(api.me.sessionedMe);
  const meIsLoading = me === undefined;

  const isLoading = authIsLoading || meIsLoading;

  const hasRole = (role: string) => Boolean(me?.roles?.includes(role));

  useEffect(() => {
    if (!isLoading && isAuthenticated && !me?.name) {
      router.push("/onboard");
    }
  }, [isAuthenticated, isLoading, me?.name, router]);

  return (
    <MeContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        me,
        hasRole,
      }}
    >
      {authIsLoading ? <LoadingScreen /> : children}
    </MeContext.Provider>
  );
}

export const useMeContext = () => {
  const meContext = useContext(MeContext);
  return meContext;
};
