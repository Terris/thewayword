import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";

export const migrateUserAlertsSeen = internalMutation({
  handler: async (ctx) => {
    const allUserAlerts = ctx.db.query("userAlerts").collect();
    await asyncMap(allUserAlerts, async (alert) => {
      await ctx.db.patch(alert._id, { seen: true });
    });
  },
});
