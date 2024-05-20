import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { asyncMap } from "convex-helpers";

export const findAdventureLogByIdAsMachine = query({
  args: { id: v.id("adventureLogs") },
  handler: async (ctx, { id }) => {
    const adventureLog = await ctx.db.get(id);
    if (!adventureLog) throw new ConvexError("Adventure log not found");
    const adventureLogUser = await ctx.db.get(adventureLog.userId);

    const adventureLogBlocks = await ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_adventure_log_id", (q) => q.eq("adventureLogId", id))
      .collect();

    adventureLogBlocks.sort((a, b) => a.order - b.order);

    const blocksWithFiles = await asyncMap(
      adventureLogBlocks,
      async (block) => {
        const blockFile = block.fileId
          ? await ctx.db.get(block.fileId)
          : undefined;

        return {
          ...block,
          file: blockFile,
        };
      }
    );

    return {
      ...adventureLog,
      user: adventureLogUser,
      blocks: blocksWithFiles,
    };
  },
});
