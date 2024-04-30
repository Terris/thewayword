import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { internal } from "./_generated/api";

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
