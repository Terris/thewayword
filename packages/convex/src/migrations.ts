// import { asyncMap } from "convex-helpers";
// import { api, internal } from "./_generated/api";
// import { internalMutation } from "./_generated/server";

// export const optimizePreviousImages = internalMutation({
//   args: {},
//   handler: async (ctx) => {
//     const files = await ctx.db.query("files").collect();
//     await asyncMap(files, async (file) => {
//       await ctx.scheduler.runAfter(0, internal.optimizerActions.optimizeImage, {
//         fileId: file._id,
//       });
//     });
//     return true;
//   },
// });
