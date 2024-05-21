import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const findFollowBySessionedUserAndFolloweeUserId = query({
  args: { followeeUserId: v.id("users") },
  handler: async (ctx, { followeeUserId }) => {
    const { user } = await validateIdentity(ctx);
    return await ctx.db
      .query("follows")
      .withIndex("by_owner_id_followee_user_id", (q) =>
        q.eq("ownerId", user._id).eq("followeeUserId", followeeUserId)
      )
      .first();
  },
});

export const toggleFollowBySessionedUserAndFolloweeUserId = mutation({
  args: { followeeUserId: v.id("users") },
  handler: async (ctx, { followeeUserId }) => {
    const { user } = await validateIdentity(ctx);
    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_owner_id_followee_user_id", (q) =>
        q.eq("ownerId", user._id).eq("followeeUserId", followeeUserId)
      )
      .first();
    if (existingFollow) {
      // find and delete the related user alert
      const existingUserAlert = await ctx.db
        .query("userAlerts")
        .withIndex("by_reference_id", (q) =>
          q.eq("referenceId", existingFollow._id)
        )
        .first();
      if (existingUserAlert) {
        await ctx.db.delete(existingUserAlert._id);
      }
      // delete the exisiting follow
      await ctx.db.delete(existingFollow._id);
    } else {
      // create a new follow
      const newFollowId = await ctx.db.insert("follows", {
        ownerId: user._id,
        followeeUserId,
      });
      // create a user alert
      await ctx.db.insert("userAlerts", {
        userId: followeeUserId,
        message: `${user.name} is now following you`,
        link: `/user/${user._id}/adventure-logs`,
        read: false,
        seen: false,
        referenceId: newFollowId,
      });
    }
    return true;
  },
});
