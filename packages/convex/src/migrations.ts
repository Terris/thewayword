import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";

export const addIsDoneToFeedback = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allFeedback = await ctx.db.query("feedback").collect();
    asyncMap(allFeedback, async (feedback) => {
      await ctx.db.patch(feedback._id, { isDone: false });
    });
  },
});
