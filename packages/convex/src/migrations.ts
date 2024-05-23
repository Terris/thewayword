import { asyncMap } from "convex-helpers";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const fixRotatedImages = internalMutation({
  args: {},
  handler: async (ctx) => {
    const fuckedFileIds = [
      "m175zvrg1nhbbhx641b0kn61a96ry7xt",
      "m17c1a328wbyxjzam8wrswdaas6sdx19",
      "m1749tqf71xgvxe2y0mp6gkmp96rrftc",
      "m17d797vff871tmshv0srrrt5d6rr2n5",
      "m17fr7m57x16t0dhatscv07xbx6rsdw6",
      "m175vxybapcvpczpccjywh2zp96s92xy",
    ];

    const files = await ctx.db.query("files").collect();

    const filesToFix = files.filter((file) => fuckedFileIds.includes(file._id));

    await asyncMap(filesToFix, async (file) => {
      await ctx.scheduler.runAfter(0, internal.optimizerActions.optimizeImage, {
        fileId: file._id,
      });
    });
    return true;
  },
});
