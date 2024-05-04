import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";

export const resetAllBlockOdersToStartAtZero = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allLogs = await ctx.db.query("adventureLogs").collect();
    await asyncMap(allLogs, async (log) => {
      const allBlocks = await ctx.db
        .query("adventureLogBlocks")
        .withIndex("by_adventure_log_id", (q) =>
          q.eq("adventureLogId", log._id)
        )
        .collect();
      const sortedAllBlocks = allBlocks.sort((a, b) => a.order - b.order);
      await asyncMap(sortedAllBlocks, async (block, index) => {
        await ctx.db.patch(block._id, {
          order: index,
        });
      });
    });
  },
});
