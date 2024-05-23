"use node";

import { ConvexError, v } from "convex/values";
import { internalAction } from "./_generated/server";
import { api } from "./_generated/api";

export const optimizeImage = internalAction({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    const file = await ctx.runQuery(api.files.findById, { id: fileId });
    if (!file) throw new ConvexError("File not found");

    // const res = await fetch();

    // update the file with the new url
    // await ctx.runMutation(api.files.update, {
    //   id: fileId,
    //   url: optimizedUrl,
    // });

    return true;
  },
});
