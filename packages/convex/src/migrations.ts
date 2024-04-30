import { asyncMap } from "convex-helpers";
import { mutation } from "./_generated/server";

export const migrateLogPublishedValueToPublic = mutation({
  args: {},
  handler: async (ctx, {}) => {
    const allLogs = await ctx.db.query("adventureLogs").collect();

    await asyncMap(allLogs, async (log) => {
      await ctx.db.patch(log._id, {
        public: log.published,
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
