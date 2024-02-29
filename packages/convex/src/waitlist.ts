import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addEmailToWaitlist = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const existingWaitlistEntry = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingWaitlistEntry) {
      return ctx.db.patch(existingWaitlistEntry._id, {
        email: existingWaitlistEntry.email,
        submitCount: (existingWaitlistEntry.submitCount ?? 0) + 1,
      });
    } else {
      return ctx.db.insert("waitlist", { email, submitCount: 1 });
    }
  },
});
