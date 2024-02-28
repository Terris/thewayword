import { query } from "./_generated/server";

// SESSIONED USER FUNCTIONS
// ==================================================

/**
 * Get the current user via session.
 * Auth Requirements: Sessioned
 */
export const sessionedMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const meUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();
    if (!meUser) return null;

    const meOrgUser = await ctx.db
      .query("organizationUsers")
      .withIndex("by_user_id", (q) => q.eq("userId", meUser._id))
      .first();

    let meOrganization = null;
    if (meOrgUser) {
      meOrganization = await ctx.db.get(meOrgUser.organizationId);
    }

    const me = {
      id: meUser._id,
      name: meUser.name,
      email: meUser.email,
      roles: meUser.roles,
      isAuthorizedUser: Boolean(meUser.roles?.includes("user")),
      orgUserId: meOrgUser?._id,
      organization: meOrganization
        ? {
            id: meOrganization._id,
            name: meOrganization.name,
            slug: meOrganization.slug,
            isOwner: meOrganization.ownerId === meUser._id,
          }
        : null,
    };
    return me;
  },
});
