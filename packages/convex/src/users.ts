import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { internal } from "./_generated/api";

// SESSIONED USER FUNCTIONS
// ==================================================

/**
 * Get the user for the current session.
 * Auth Requirements: Sessioned
 */
export const sessionedFindByContextIdentity = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();
  },
});

export const updateUserAsUserOwner = mutation({
  args: { name: v.optional(v.string()), email: v.optional(v.string()) },
  handler: async (ctx, { name, email }) => {
    const { user } = await validateIdentity(ctx);
    if (!user) return null;
    await ctx.db.patch(user._id, {
      name: name ?? user.name,
      email: email ?? user.email,
    });
    if (email) {
      // update clerk
    }
  },
});

// INTERNAL FUNCTIONS
// ==================================================

/**
 * Find a user by its id.
 * Auth Requirements: Internal
 * @param id - The user id.
 */
export const systemFindById = internalQuery({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

/**
 * Find a user by its token identifier.
 * Auth Requirements: Internal
 * @param tokenIdentifier - The token identifier.
 */
export const systemFindByTokenIdentifier = internalQuery({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, { tokenIdentifier }) => {
    return ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .first();
  },
});

/**
 * Create a new db user based on new clerk user via webhook
 * Auth Requirements: Internal
 * @param clerkId - The clerk id.
 * @param email - The email of the user.
 * @param name - The name of the user.
 * @param roles - The roles of the user.
 */
export const systemSaveNewClerkUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    roles: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { clerkId, email, name, avatarUrl, roles }) => {
    const tokenIdentifier = `${process.env.CLERK_JWT_ISSUER_DOMAIN}|${clerkId}`;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    // If we've seen this identity before but the name has changed, patch the value.
    if (user !== null) {
      if (user.name !== name) {
        await ctx.db.patch(user._id, { name });
      }
    } else {
      // If it's a new identity, create a new `User`.
      const newUserId = await ctx.db.insert("users", {
        name,
        email,
        avatarUrl,
        tokenIdentifier,
        roles,
      });
    }

    // send new user email to admin
    await ctx.scheduler.runAfter(
      0,
      internal.userActions.sendNewUserEmailToAdmin,
      {
        userEmail: email,
      }
    );

    return true;
  },
});
