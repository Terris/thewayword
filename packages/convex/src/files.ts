import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";
import { internal } from "./_generated/api";

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
        const newFileId = await ctx.db.insert("files", {
          url,
          originalUrl: url,
          fileName,
          mimeType,
          type,
          size,
          dimensions,
          userId,
        });
        if (type === "image") {
          // optimize in an action
          await ctx.scheduler.runAfter(
            0,
            internal.optimizerActions.optimizeImage,
            {
              fileId: newFileId,
            }
          );
        }
        return newFileId;
      }
    );
    return fileIds;
  },
});

// INTERNAL

export const systemFindAll = internalQuery({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("files").collect();
  },
});

export const systemFindById = internalQuery({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const systemUpdate = internalMutation({
  args: {
    id: v.id("files"),
    url: v.optional(v.string()),
    size: v.optional(v.number()),
    dimensions: v.optional(
      v.object({
        width: v.optional(v.number()),
        height: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, { id, url, size, dimensions }) => {
    const existingFile = await ctx.db.get(id);
    if (!existingFile) throw new ConvexError("File not found");
    return await ctx.db.patch(id, {
      url: url ?? existingFile.url,
      size: size ?? existingFile.size,
      dimensions: dimensions ?? existingFile.dimensions,
    });
  },
});

export const systemDeleteById = internalMutation({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    const existingFile = await ctx.db.get(id);
    if (!existingFile) throw new ConvexError("File not found");
    return ctx.db.delete(id);
  },
});
