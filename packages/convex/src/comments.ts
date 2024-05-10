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
      .order("asc")
      .collect();

    const commentsWithUser = await asyncMap(
      adventureLogComments,
      async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: { name: user?.name, avatarUrl: user?.avatarUrl },
        };
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

export const updateByIdAsOwner = mutation({
  args: {
    id: v.id("comments"),
    message: v.string(),
  },
  handler: async (ctx, { id, message }) => {
    const { user } = await validateIdentity(ctx);
    const comment = await ctx.db.get(id);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== user._id) throw new Error("Unauthorized");
    return await ctx.db.patch(id, { message });
  },
});

export const deleteByIdAsOwner = mutation({
  args: { id: v.id("comments") },
  handler: async (ctx, { id }) => {
    const { user } = await validateIdentity(ctx);
    const comment = await ctx.db.get(id);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== user._id) throw new Error("Unauthorized");
    return await ctx.db.delete(id);
  },
});
