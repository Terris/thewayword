import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const findAllByAdventureLogId = query({
  args: { adventureLogId: v.id("adventureLogs") },
  handler: async (ctx, { adventureLogId }) => {
    await validateIdentity(ctx);

    const adventureLogComments = ctx.db
      .query("comments")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", adventureLogId)
      )
      .collect();

    const commentsWithUser = await asyncMap(
      adventureLogComments,
      async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return { ...comment, user: { name: user?.name } };
      }
    );

    return commentsWithUser;
  },
});

export const create = mutation({
  args: {
    adventureLogId: v.id("adventureLogs"),
    message: v.string(),
  },
  handler: async (ctx, { adventureLogId, message }) => {
    await validateIdentity(ctx);

    const { user } = await validateIdentity(ctx);

    return ctx.db.insert("comments", {
      adventureLogId,
      userId: user._id,
      message,
    });
  },
});
