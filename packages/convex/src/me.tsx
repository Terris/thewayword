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

    const me = {
      id: meUser._id,
      name: meUser.name,
      avatarUrl: meUser.avatarUrl,
      email: meUser.email,
      roles: meUser.roles,
      isAuthorizedUser: Boolean(meUser.roles?.includes("user")),
    };
    return me;
  },
});
