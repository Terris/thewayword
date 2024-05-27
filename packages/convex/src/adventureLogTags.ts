import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";
import { stringToSlug } from "./lib/utils";

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

export const updateByAdventureLogId = mutation({
  args: {
    adventureLogId: v.id("adventureLogs"),
    tagsAsString: v.string(),
  },
  handler: async (ctx, { adventureLogId, tagsAsString }) => {
    await validateIdentity(ctx);

    const newTagsArray = tagsAsString
      .split(",")
      .map((tag) => tag.trim())
      .map((tag) => tag.toLowerCase());

    const existingAdventureLogTags = await ctx.db
      .query("adventureLogTags")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", adventureLogId)
      )
      .collect();

    // Delete all old adventure log tags
    await asyncMap(existingAdventureLogTags, async (adventureLogTag) => {
      await ctx.db.delete(adventureLogTag._id);
    });

    await asyncMap(newTagsArray, async (tagName) => {
      const existingTag = await ctx.db
        .query("tags")
        .withIndex("by_name", (q) => q.eq("name", tagName))
        .first();
      if (existingTag) {
        await ctx.db.insert("adventureLogTags", {
          adventureLogId,
          tagId: existingTag._id,
        });
      } else {
        const newTagId = await ctx.db.insert("tags", {
          name: tagName,
          slug: stringToSlug(tagName),
        });
        await ctx.db.insert("adventureLogTags", {
          adventureLogId,
          tagId: newTagId,
        });
      }
    });

    // reset the indexableContentUpdatedAt on the adventure log
    await ctx.db.patch(adventureLogId, {
      indexableContentUpdatedAt: new Date().toISOString(),
    });
  },
});
