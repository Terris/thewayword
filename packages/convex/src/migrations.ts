import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";

export const migrateFullAddressField = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allLogs = await ctx.db.query("adventureLogs").collect();

    await asyncMap(allLogs, async (log) => {
      if (log.location?.full_address) {
        await ctx.db.patch(log._id, {
          location: {
            ...log.location,
            fullAddress: log.location.full_address,
            full_address: undefined,
          },
        });
      }
    });
  },
});
