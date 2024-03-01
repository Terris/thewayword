import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const findById = query({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    return ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    uploads: v.array(
      v.object({
        url: v.string(),
        fileName: v.string(),
        mimeType: v.string(),
        type: v.string(),
        size: v.number(),
        dimensions: v.optional(
          v.object({
            width: v.optional(v.number()),
            height: v.optional(v.number()),
          })
        ),
        userId: v.id("users"),
      })
    ),
  },
  handler: async (ctx, { uploads }) => {
    await validateIdentity(ctx);
    // save a file record for each upload
    const fileIds = await asyncMap(
      uploads,
      async ({ url, fileName, mimeType, type, size, dimensions, userId }) => {
        if (!url) throw new Error("Storage file url not found");
        return await ctx.db.insert("files", {
          url,
          fileName,
          mimeType,
          type,
          size,
          dimensions,
          userId,
        });
      }
    );
    return fileIds;
  },
});
