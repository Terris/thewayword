import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";

export const migrateAddSlugToAllTags = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allTags = await ctx.db.query("tags").collect();

    await asyncMap(allTags, async (tag) => {
      await ctx.db.patch(tag._id, {
        slug: tag.name.toLowerCase().replace(/\s/g, "-"),
      });
    });
  },
});
