import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";

export const migrateAdventureLogCoverImageToBlock = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allLogs = await ctx.db.query("adventureLogs").collect();

    await asyncMap(allLogs, async (log) => {
      // take the cover image and create a new block
      if (log.coverImageFileId) {
        await ctx.db.insert("adventureLogBlocks", {
          adventureLogId: log._id,
          type: "image",
          order: 0,
          fileId: log.coverImageFileId,
        });
      }

      // move remaining blocks down by 1
      const allBlocks = await ctx.db
        .query("adventureLogBlocks")
        .withIndex("by_adventure_log_id", (q) =>
          q.eq("adventureLogId", log._id)
        )
        .collect();

      await asyncMap(allBlocks, async (block) => {
        await ctx.db.patch(block._id, {
          order: block.order + 1,
        });
      });
    });
  },
});

export const deleteAdventureLogCoverImage = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allLogs = await ctx.db.query("adventureLogs").collect();
    await asyncMap(allLogs, async (log) => {
      await ctx.db.patch(log._id, {
        coverImageFileId: undefined,
      });
    });
  },
});
