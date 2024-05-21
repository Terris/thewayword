import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const toggleLikeBySessionedUserAndAdventureLogId = mutation({
  args: { adventureLogId: v.id("adventureLogs") },
  handler: async (ctx, { adventureLogId }) => {
    const { user } = await validateIdentity(ctx);

    const adventureLog = await ctx.db.get(adventureLogId);
    if (!adventureLog) throw new ConvexError("Adventure log not found");

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_id_adventure_log_id", (q) =>
        q.eq("userId", user._id).eq("adventureLogId", adventureLogId)
      )
      .first();
    if (existingLike) {
      // look for a related userAlert and delete it
      const relatedUserAlert = await ctx.db
        .query("userAlerts")
        .withIndex("by_reference_id", (q) =>
          q.eq("referenceId", existingLike._id)
        )
        .first();
      if (relatedUserAlert) {
        await ctx.db.delete(relatedUserAlert._id);
      }
      // delete the like
      await ctx.db.delete(existingLike._id);
    } else {
      // create a new like
      const newLikeId = await ctx.db.insert("likes", {
        adventureLogId,
        userId: user._id,
      });
      // create a userAlert if the user is not the owner of the adventure log
      if (user._id !== adventureLog.userId) {
        await ctx.db.insert("userAlerts", {
          userId: adventureLog?.userId,
          message: `${user.name} liked "${adventureLog?.title}".`,
          link: `/adventure-logs/${adventureLogId}#likes`,
          read: false,
          seen: false,
          referenceId: newLikeId,
        });
      }
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
