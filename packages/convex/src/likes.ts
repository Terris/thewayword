import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const create = mutation({
  args: { adventureLogId: v.id("adventureLogs") },
  handler: async (ctx, { adventureLogId }) => {
    const { user } = await validateIdentity(ctx);
    return ctx.db.insert("likes", {
      adventureLogId,
      userId: user._id,
    });
  },
});

export const findBySessionedUserAndAdventureLogId = query({
  args: {
    adventureLogId: v.id("adventureLogs"),
  },
  handler: async (ctx, { adventureLogId }) => {
    const { user } = await validateIdentity(ctx);
    return ctx.db
      .query("likes")
      .withIndex("by_user_id_adventure_log_id", (q) =>
        q.eq("userId", user._id).eq("adventureLogId", adventureLogId)
      )
      .first();
  },
});
