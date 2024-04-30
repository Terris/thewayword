import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";

export const migrateFileURLs = internalMutation({
  args: {},
  handler: async (ctx, {}) => {
    const allFiles = await ctx.db.query("files").collect();

    await asyncMap(allFiles, async (file) => {
      const oldUrl = file.url;
      const newUrl = oldUrl.replace("bittybrella", "thewayword");
      await ctx.db.patch(file._id, { url: newUrl });
    });

    return true;
  },
});
