import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";
import { internal } from "../_generated/api";

// VALIDATE VIA QUERY/MUTATION CTX
// ==================================================

/**
 * Validate the ownership of an organization found by org id.
 * @param ctx - The query/mutation context.
 * @param userId - The user id.
 * @param organizationId - The organization id.
 */
export const validateOrganizationOwnership = async ({
  ctx,
  userId,
  organizationId,
}: {
  ctx: MutationCtx | QueryCtx;
  userId: Id<"users">;
  organizationId: Id<"organizations">;
}) => {
  const organization = await ctx.db.get(organizationId);
  if (!organization) throw new ConvexError("Organization not found");
  if (organization.ownerId !== userId) throw new ConvexError("Unauthorized");
  return { organization };
};

/**
 * Validate the ownership of an organization found by org slug.
 * @param ctx - The query/mutation context.
 * @param userId - The user id.
 * @param organizationSlug - The organization slug.
 */
export const validateOrganizationByOrgSlugOwnership = async ({
  ctx,
  userId,
  organizationSlug,
}: {
  ctx: MutationCtx | QueryCtx;
  userId: Id<"users">;
  organizationSlug: string;
}) => {
  const organization = await ctx.db
    .query("organizations")
    .withIndex("by_slug", (q) => q.eq("slug", organizationSlug))
    .first();
  if (!organization) throw new ConvexError("Organization not found");
  if (organization.ownerId !== userId) throw new ConvexError("Unauthorized");
  return { organization };
};

/**
 * Validate the ownership of an organization user.
 * @param ctx - The query/mutation context.
 * @param userId - The user id.
 * @param organizationUserId - The organization user id.
 */
export const validateOrganizationUserOwnership = async ({
  ctx,
  userId,
  organizationUserId,
}: {
  ctx: MutationCtx | QueryCtx;
  userId: Id<"users">;
  organizationUserId: Id<"organizationUsers">;
}) => {
  const organizationUser = await ctx.db.get(organizationUserId);
  if (!organizationUser) throw new ConvexError("Organization not found");
  if (organizationUser.userId !== userId) throw new ConvexError("Unauthorized");
  return { organizationUser };
};

// VALIDATE VIA ACTION CTX
// ==================================================

/**
 * Validate the ownership of an organization.
 * @param ctx - The action context.
 * @param userId - The user id.
 * @param organizationId - The organization id.
 */
export const validateActionOrganizationOwnership = async ({
  ctx,
  userId,
  organizationId,
}: {
  ctx: ActionCtx;
  userId: Id<"users">;
  organizationId: Id<"organizations">;
}) => {
  const organization = await ctx.runQuery(
    internal.organizations.systemGetOrganizationById,
    {
      id: organizationId,
    }
  );
  if (!organization) throw new ConvexError("Organization not found");
  if (organization.ownerId !== userId) throw new ConvexError("Unauthorized");
  return { organization };
};
