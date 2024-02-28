import type { UserId } from "@repo/auth";
import { api } from "@repo/convex";
import { useQuery } from "convex/react";

export function useGetOrganizationByOwnerId({ ownerId }: { ownerId?: UserId }) {
  const orgQueryArgs = ownerId ? { userId: ownerId } : "skip";
  const organization = useQuery(
    api.organizations.sessionedFindByOwnerId,
    orgQueryArgs
  );
  const isLoading = organization === undefined;

  return { isLoading, organization };
}
