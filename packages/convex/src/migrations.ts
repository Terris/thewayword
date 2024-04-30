import { asyncMap } from "convex-helpers";
import { mutation } from "./_generated/server";

// TODO
// remove published
// remove public
// make isPublic required

export const migrateLogPublishedValueToIsPublic = mutation({
  args: {},
  handler: async (ctx, {}) => {
    const allLogs = await ctx.db.query("adventureLogs").collect();

    await asyncMap(allLogs, async (log) => {
      await ctx.db.patch(log._id, {
        isPublic: log.published,
      });
    });
  },
});

export const addAdventureStartDateToAllLogs = mutation({
  args: {},
  handler: async (ctx, {}) => {
    const allLogs = await ctx.db.query("adventureLogs").collect();

    await asyncMap(allLogs, async (log) => {
      await ctx.db.patch(log._id, {
        adventureStartDate: new Date(log._creationTime).toISOString(),
      });
    });
  },
});
