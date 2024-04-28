import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const addEmailToWaitlist = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const existingWaitlistEntry = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingWaitlistEntry) {
      await ctx.db.patch(existingWaitlistEntry._id, {
        email: existingWaitlistEntry.email,
        submitCount: (existingWaitlistEntry.submitCount ?? 0) + 1,
      });
    } else {
      await ctx.db.insert("waitlist", { email, submitCount: 1 });
    }

    // send new waitlist entry email to admin
    await ctx.scheduler.runAfter(
      0,
      internal.waitlistActions.sendNewWatlistEntryEmailToAdmin,
      {
        waitlistEmail: email,
      }
    );
  },
});
