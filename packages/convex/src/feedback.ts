import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { internal } from "./_generated/api";
import { asyncMap } from "convex-helpers";

export const findAllUndoneAsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const allFeedback = await ctx.db
      .query("feedback")
      .withIndex("by_is_done", (q) => q.eq("isDone", false))
      .order("desc")
      .collect();

    return asyncMap(allFeedback, async (feedback) => {
      const user = await ctx.db.get(feedback.userId);
      return { ...feedback, user };
    });
  },
});

export const findAllDoneAsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const allFeedback = await ctx.db
      .query("feedback")
      .withIndex("by_is_done", (q) => q.eq("isDone", true))
      .order("desc")
      .collect();

    return asyncMap(allFeedback, async (feedback) => {
      const user = await ctx.db.get(feedback.userId);
      return { ...feedback, user };
    });
  },
});

export const create = mutation({
  args: { message: v.string() },
  handler: async (ctx, { message }) => {
    const { user } = await validateIdentity(ctx);
    await ctx.db.insert("feedback", {
      userId: user._id,
      message,
      isDone: false,
    });

    // send new feedback email to admin
    await ctx.scheduler.runAfter(
      0,
      internal.feedbackActions.sendNewFeedbackEmailToAdmin,
      {
        userEmail: user.email,
        message,
      }
    );
    return true;
  },
});

export const updateById = mutation({
  args: { id: v.id("feedback"), isDone: v.boolean() },
  handler: async (ctx, { id, isDone }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const feedbackRecord = await ctx.db.get(id);
    if (!feedbackRecord)
      throw new ConvexError("Feedback not found with that ID");

    await ctx.db.patch(id, {
      isDone: isDone ?? feedbackRecord.isDone,
    });
  },
});
