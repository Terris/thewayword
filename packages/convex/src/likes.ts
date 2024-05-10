import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const toggleLikeBySessionedUserAndAdventureLogId = mutation({
  args: { adventureLogId: v.id("adventureLogs") },
  handler: async (ctx, { adventureLogId }) => {
    const { user } = await validateIdentity(ctx);
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_id_adventure_log_id", (q) =>
        q.eq("userId", user._id).eq("adventureLogId", adventureLogId)
      )
      .first();
    if (existingLike) {
      await ctx.db.delete(existingLike._id);
    } else {
      await ctx.db.insert("likes", {
        adventureLogId,
        userId: user._id,
      });
    }
  },
});

export const findOneBySessionedUserAndAdventureLogId = query({
  args: {
    adventureLogId: v.id("adventureLogs"),
  },
  handler: async (ctx, { adventureLogId }) => {
    const { user } = await validateIdentity(ctx);
    return ctx.db
      .query("likes")
      .withIndex("by_user_id_adventure_log_id", (q) =>
        q.eq("userId", user._id).eq("adventureLogId", adventureLogId)
      )
      .first();
  },
});

export const findAllByAdventureLogId = query({
  args: {
    adventureLogId: v.id("adventureLogs"),
  },
  handler: async (ctx, { adventureLogId }) => {
    const allLikes = await ctx.db
      .query("likes")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", adventureLogId)
      )
      .collect();
    const allLikesWithUser = await asyncMap(allLikes, async (like) => {
      const user = await ctx.db.get(like.userId);
      if (!user) throw new ConvexError("User not found");
      return {
        ...like,
        user: {
          _id: user._id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      };
    });
    return allLikesWithUser;
  },
});
