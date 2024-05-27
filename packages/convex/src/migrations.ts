import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const indexSearchContentForAllAdventureLogs = internalMutation({
  handler: async (ctx) => {
    const adventureLogs = await ctx.db.query("adventureLogs").collect();
    await asyncMap(adventureLogs, async (adventureLog) => {
      ctx.db.patch(adventureLog._id, {
        indexableContentUpdatedAt: new Date().toISOString(),
      });
    });
    await ctx.scheduler.runAfter(
      0,
      internal.adventureLogs.systemIndexSearchContent,
      {}
    );
  },
});
