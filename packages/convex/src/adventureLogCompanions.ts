import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

// SESSIONED USER FUNCTIONS
// ==================================================
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

// OWNER FUNCTIONS
// ==================================================
export const updateAdventureLogCompanionsAsOwner = mutation({
  args: {
    adventureLogId: v.id("adventureLogs"),
    companionUserIds: v.array(v.id("users")),
  },
  handler: async (ctx, { adventureLogId, companionUserIds }) => {
    const { user } = await validateIdentity(ctx);
    const existingAdventureLog = await ctx.db.get(adventureLogId);
    if (!existingAdventureLog) throw new ConvexError("Adventure log not found");
    if (existingAdventureLog.userId !== user._id)
      throw new ConvexError("Not authorized");

    const newCompanionUserIds = companionUserIds.filter(
      (userId) => !existingAdventureLog.companionUserIds?.includes(userId)
    );

    await ctx.db.patch(adventureLogId, { companionUserIds });

    if (existingAdventureLog.isPublic) {
      // create a user alert for every new companion user id
      await asyncMap(newCompanionUserIds, async (companionUserId) => {
        await ctx.db.insert("userAlerts", {
          userId: companionUserId,
          message: `${user.name} added you as a companion to ${existingAdventureLog.title}`,
          link: `/adventure-logs/${adventureLogId}`,
          read: false,
          seen: false,
          referenceId: adventureLogId,
        });
      });
    }

    return true;
  },
});
