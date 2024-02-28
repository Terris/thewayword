import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { validateOrganizationUserOwnership } from "./lib/ownership";

// SESSIONED USER FUNCTIONS
// ==================================================

/**
 * Find an organization user by its organization and user id.
 * Auth Requirements: Sessioned
 * @param organizationId - The organization id.
 * @param userId - The user id.
 */
export const sessionedFindOneByOrgIdUserId = query({
  args: { organizationId: v.id("organizations"), userId: v.id("users") },
  handler: async (ctx, { organizationId, userId }) => {
    await validateIdentity(ctx);
    return ctx.db
      .query("organizationUsers")
      .withIndex("by_organization_id_user_id", (q) =>
        q.eq("organizationId", organizationId).eq("userId", userId)
      )
      .first();
  },
});

/**
 * Create a new organization user.
 * Auth Requirements: Sessioned, Ownership via matching email
 * TODO: we should really be validating ownership via sessioned user's email
 * @param organizationId - The organization id.
 * @param userId - The user id.
 */
export const sessionedCreateOneByInviteTokenUserId = mutation({
  args: { inviteToken: v.id("organizationInvites"), userId: v.id("users") },
  handler: async (ctx, { inviteToken, userId }) => {
    await validateIdentity(ctx);

    const invite = await ctx.db.get(inviteToken);
    if (!invite) throw new Error("Invite not found");

    const org = await ctx.db.get(invite.organizationId);
    if (!org) throw new Error("Organization not found");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    if (user.email !== invite.email)
      throw new Error("User email does not match invite");

    return ctx.db.insert("organizationUsers", {
      userId: user._id,
      organizationId: invite.organizationId,
      onboardingComplete: false,
    });
  },
});

/**
 * Update an organization user as the owner.
 * Auth Requirements: Sessioned, Ownership
 * @param organizationUserId - The organization user id.
 * @param onboardingComplete - Whether the onboarding is complete.
 */
export const sessionedUpdateOrganizationUserAsOwner = mutation({
  args: {
    organizationUserId: v.id("organizationUsers"),
    onboardingComplete: v.optional(v.boolean()),
  },
  handler: async (ctx, { organizationUserId, onboardingComplete }) => {
    const { user } = await validateIdentity(ctx);
    await validateOrganizationUserOwnership({
      ctx,
      userId: user._id,
      organizationUserId,
    });
    return ctx.db.patch(organizationUserId, { onboardingComplete });
  },
});
