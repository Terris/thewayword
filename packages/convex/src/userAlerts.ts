import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const paginatedFindAllBySessionedUser = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const { user } = await validateIdentity(ctx);
    return ctx.db
      .query("userAlerts")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate(paginationOpts);
  },
});

export const markOneReadById = mutation({
  args: { id: v.id("userAlerts") },
  handler: async (ctx, { id }) => {
    const { user } = await validateIdentity(ctx);
    const alert = await ctx.db.get(id);
    if (!alert) {
      return;
    }
    if (alert.userId !== user._id) {
      throw new ConvexError("Alert does not belong to user");
    }
    await ctx.db.patch(id, { read: true });
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

export const markAllSeenBySessionedUser = mutation({
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
      await ctx.db.patch(alert._id, { seen: true });
    });
  },
});
