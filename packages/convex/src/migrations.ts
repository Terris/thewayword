import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";

export const removeUnusedMapFields = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allAdventureLogs = await ctx.db.query("adventureLogs").collect();

    if (!allAdventureLogs) return;

    await asyncMap(allAdventureLogs, async (adventureLog) => {
      await ctx.db.patch(adventureLog._id, {
        location: {
          name: adventureLog.location?.name ?? "",
          fullAddress: adventureLog.location?.fullAddress ?? "",
          latitude: adventureLog.location?.latitude,
          longitude: adventureLog.location?.longitude,
          mapboxId: undefined,
          type: undefined,
          poiCategories: undefined,
        },
      });
    });

    return true;
  },
});
