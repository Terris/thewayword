import type { Doc, Id } from "@repo/convex";

export type OrganizationId = Id<"organizations">;
export type OrganizationDoc = Doc<"organizations">;
export type MeOrganizationDoc = Pick<
  OrganizationDoc,
  "_id" | "name" | "slug" | "ownerId"
> & {
  meIsOwner: boolean;
};
