import { ConvexError, v } from "convex/values";
import { asyncMap } from "convex-helpers";
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

export const search = query({
  args: { queryTerm: v.string() },
  handler: async (ctx, { queryTerm }) => {
    const { user } = await validateIdentity(ctx);
    const results = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => q.search("name", queryTerm))
      .collect();

    return await asyncMap(
      results.filter((result) => result._id !== user._id),
      async (result) => {
        return {
          _id: result._id,
          name: result.name,
          avatarUrl: result.avatarUrl,
          createdAt: result._creationTime,
        };
      }
    );
  },
});

export const sessionedFindPublicUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    const fullUser = await ctx.db.get(id);
    if (!fullUser) throw new ConvexError("User not found for given id");
    // only return values visible to another user
    return {
      _id: fullUser._id,
      name: fullUser.name,
      avatarUrl: fullUser.avatarUrl,
      createdAt: fullUser._creationTime,
    };
  },
});

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
  args: { name: v.optional(v.string()) },
  handler: async (ctx, { name }) => {
    const { user } = await validateIdentity(ctx);
    if (!user) return null;
    await ctx.db.patch(user._id, {
      name: name ?? user.name,
    });
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

export const systemFindByClerkUserId = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    return ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
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
      user._id;
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
        clerkUserId: clerkId,
        roles,
      });

      // add email address to resend audience
      await ctx.scheduler.runAfter(
        0,
        internal.userActions.addEmailToResendAudience,
        {
          email,
        }
      );

      // send new user email to admin
      await ctx.scheduler.runAfter(
        0,
        internal.userActions.sendNewUserEmailToAdmin,
        {
          userEmail: email,
        }
      );

      // Schedule action to create and sync a stripe customer id
      await ctx.scheduler.runAfter(
        0,
        internal.userActions.systemCreateAndSyncStripeCustomerToUser,
        {
          userId: newUserId,
          email,
        }
      );
    }

    return true;
  },
});

export const systemUpdateUserProfile = internalMutation({
  args: {
    userId: v.id("users"),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, { userId, email, name, avatarUrl }) => {
    const existingUser = await ctx.db.get(userId);
    if (!existingUser) {
      throw new ConvexError("User not found");
    }
    await ctx.db.patch(userId, {
      email: email ?? existingUser.email,
      name: name ?? existingUser.name,
      avatarUrl: avatarUrl ?? existingUser.avatarUrl,
    });
  },
});

export const systemFindByStripeCustomerId = internalQuery({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, { stripeCustomerId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_stripe_customer_id", (q) =>
        q.eq("stripeCustomerId", stripeCustomerId)
      )
      .first();
  },
});

export const systemSetStripeCustomerId = internalMutation({
  args: { id: v.id("users"), stripeCustomerId: v.string() },
  handler: async (ctx, { id, stripeCustomerId }) => {
    await ctx.db.patch(id, { stripeCustomerId });
  },
});
