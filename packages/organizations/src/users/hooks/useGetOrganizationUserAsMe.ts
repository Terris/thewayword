import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { useMeContext } from "@repo/auth/context";
import type { OrganizationId } from "../../types";

export function useGetOrganizationUserAsMe({
  organizationId,
}: {
  organizationId?: OrganizationId;
}) {
  const { me } = useMeContext();

  const organizationUserArgs =
    me && organizationId ? { organizationId, userId: me.id } : "skip";

  const organizationUser = useQuery(
    api.organizationUsers.sessionedFindOneByOrgIdUserId,
    organizationUserArgs
  );

  const isLoading =
    organizationUserArgs !== "skip" && organizationUser === undefined;

  return { organizationUser, isLoading };
}
