import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const paginatedFindAllBySessionedUser = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const { user } = await validateIdentity(ctx);
    return ctx.db
      .query("userAlerts")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .paginate(paginationOpts);
  },
});

export const markAllReadBySessionedUser = mutation({
  args: {},
  handler: async (ctx) => {
    const { user } = await validateIdentity(ctx);
    const allUnreadAlerts = ctx.db
      .query("userAlerts")
      .withIndex("by_user_id_read", (q) =>
        q.eq("userId", user._id).eq("read", false)
      )
      .collect();
    await asyncMap(allUnreadAlerts, async (alert) => {
      await ctx.db.patch(alert._id, { read: true });
    });
  },
});
