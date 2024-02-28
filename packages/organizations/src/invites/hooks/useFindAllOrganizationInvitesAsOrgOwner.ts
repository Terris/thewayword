import { api } from "@repo/convex";
import { useQuery } from "convex/react";

export function useFindAllOrganizationInvitesAsOrgOwner({
  organizationSlug,
}: {
  organizationSlug: string;
}) {
  const invitesQueryArgs = organizationSlug ? { organizationSlug } : "skip";
  const invites = useQuery(
    api.organizationInvites.sessionedFindAllByOrganizationSlugAsOrgOwner,
    invitesQueryArgs
  );
  const isLoading = invites === undefined;

  return { invites, isLoading };
}
