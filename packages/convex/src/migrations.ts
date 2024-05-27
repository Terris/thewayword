import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const indexSearchContentForAllAdventureLogs = internalMutation({
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(
      0,
      internal.adventureLogs.systemIndexSearchContent,
      {}
    );
  },
});
