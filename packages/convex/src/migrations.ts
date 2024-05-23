import { asyncMap } from "convex-helpers";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const optimizeAllImages = internalMutation({
  args: {},
  handler: async (ctx) => {
    const files = await ctx.db.query("files").collect();
    await asyncMap(files, async (file) => {
      if (!file.originalUrl || file.originalUrl === file.url) {
        if (!file.originalUrl) {
          await ctx.db.patch(file._id, {
            originalUrl: file.url,
          });
        }
        await ctx.scheduler.runAfter(
          0,
          internal.optimizerActions.optimizeImage,
          {
            fileId: file._id,
          }
        );
      }
    });
    return true;
  },
});
