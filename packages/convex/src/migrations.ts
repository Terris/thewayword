import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";

export const addClerUserIdToUser = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();

    // for each user take the tokenIdentifier and split it at pipe
    await asyncMap(allUsers, async (user) => {
      const tokenIdentifier = user.tokenIdentifier;
      const splitString = tokenIdentifier.split("|");
      const clerkUserId = splitString[1];
      await ctx.db.patch(user._id, { clerkUserId });
    });
  },
});
