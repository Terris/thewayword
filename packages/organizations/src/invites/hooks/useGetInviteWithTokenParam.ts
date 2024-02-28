import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@repo/convex";
import type { OrganizationInviteId } from "../types";

export function useGetInviteWithTokenParam() {
  const { inviteToken } = useParams();

  const invite = useQuery(api.organizationInvites.publicFindOneByInviteToken, {
    inviteToken: inviteToken as OrganizationInviteId,
  });
  const isLoading = invite === undefined;

  return { inviteToken, invite, isLoading };
}
