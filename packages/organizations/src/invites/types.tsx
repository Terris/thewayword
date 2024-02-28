import type { Doc, Id } from "@repo/convex";

export type OrganizationInviteId = Id<"organizationInvites">;
export type OrganizationInviteDoc = Doc<"organizationInvites">;
export type OrganizationInviteWithOrgDoc = Doc<"organizationInvites"> & {
  organization: Doc<"organizations">;
};
