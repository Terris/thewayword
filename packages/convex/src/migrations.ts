import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const addStripeCustomerIdToAllUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    await asyncMap(allUsers, async (user) => {
      if (user.stripeCustomerId) return;
      await ctx.scheduler.runAfter(
        0,
        internal.userActions.systemCreateAndSyncStripeCustomerToUser,
        {
          userId: user._id,
          email: user.email,
        }
      );
    });
  },
});
