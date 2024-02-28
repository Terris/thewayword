import { useMeContext } from "@repo/auth/context";
import { api } from "@repo/convex";
import { useQuery } from "convex/react";

export function useGetMeOrganization() {
  // wait for me to load to ensure the query is sessioned
  const { me } = useMeContext();
  const meOrganizationArgs = !me ? "skip" : {};
  const meOrganization = useQuery(
    api.organizations.sessionedMeOrganization,
    meOrganizationArgs
  );
  const isLoading = meOrganization === undefined;
  return { isLoading, meOrganization };
}
