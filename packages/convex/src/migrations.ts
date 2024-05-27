import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const indexLogSearchContent = internalMutation({
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(
      0,
      internal.adventureLogs.systemIndexSearchContent,
      {}
    );
    return true;
  },
});
