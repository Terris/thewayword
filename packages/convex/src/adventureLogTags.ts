import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const findAllByAdventureLogId = query({
  args: { adventureLogId: v.id("adventureLogs") },
  handler: async (ctx, { adventureLogId }) => {
    await validateIdentity(ctx);
    const adventureLogTags = await ctx.db
      .query("adventureLogTags")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", adventureLogId)
      )
      .collect();
    if (!adventureLogTags)
      throw new ConvexError("Adventure log tags not found");
    return await asyncMap(adventureLogTags, async (adventureLogTag) => {
      return await ctx.db.get(adventureLogTag.tagId);
    });
  },
});
