import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const AddCurrentUsersToResendAudience = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();

    await asyncMap(allUsers, async (user) => {
      await ctx.scheduler.runAfter(
        0,
        internal.userActions.addEmailToResendAudience,
        {
          email: user.email,
        }
      );
    });

    return true;
  },
});
