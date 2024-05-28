import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const findAllByAdventureLogId = query({
  args: { adventureLogId: v.id("adventureLogs") },
  handler: async (ctx, { adventureLogId }) => {
    await validateIdentity(ctx);
    const adventureLog = await ctx.db.get(adventureLogId);
    if (!adventureLog) throw new ConvexError("Adventure log not found");
    if (!adventureLog.companionUserIds) return [];
    return await asyncMap(
      adventureLog.companionUserIds,
      async (companionUserId) => {
        const user = await ctx.db.get(companionUserId);
        if (!user) throw new ConvexError("User not found");
        return { companionUserId, user };
      }
    );
  },
});
