import type { UserDoc } from "@repo/auth";
import type { Doc, Id } from "@repo/convex";

export type OrganizationUserId = Id<"organizationUsers">;
export type OrganizationUserDoc = Doc<"organizationUsers">;
export type OrganizationUserWithUserDoc = OrganizationUserDoc & {
  user: UserDoc;
};
