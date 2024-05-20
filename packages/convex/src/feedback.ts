import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { internal } from "./_generated/api";
import { asyncMap } from "convex-helpers";

export const findAllAsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const allFeedback = await ctx.db.query("feedback").order("desc").collect();

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
    await ctx.db.insert("feedback", { userId: user._id, message });

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
