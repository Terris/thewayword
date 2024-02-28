import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

// INTERNAL FUNCTIONS
// ==================================================

/**
 * Find a whitelisted user by email.
 * Auth Requirements: Internal
 * @param email - The email of the user.
 */
export const publicFindByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return ctx.db
      .query("userWhitelist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});
