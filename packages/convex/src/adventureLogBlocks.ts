import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";
import { internal } from "./_generated/api";

// SESSIONED USER FUNCTIONS
// ==================================================
export const findAllByAdventureLogId = query({
  args: {
    adventureLogId: v.id("adventureLogs"),
  },
  handler: async (ctx, { adventureLogId }) => {
    await validateIdentity(ctx);
    const adventureLog = await ctx.db.get(adventureLogId);
    if (!adventureLog) throw new ConvexError("Adventure log not found");

    const adventureLogBlocks = await ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", adventureLogId)
      )
      .collect();

    return adventureLogBlocks.sort((a, b) => a.order - b.order);
  },
});

export const findById = query({
  args: { id: v.id("adventureLogBlocks") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    return ctx.db.get(id);
  },
});

export const findFirstImageBlockByAdventureLogId = query({
  args: {
    adventureLogId: v.id("adventureLogs"),
  },
  handler: async (ctx, { adventureLogId }) => {
    await validateIdentity(ctx);
    const adventureLogBlocks = await ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", adventureLogId)
      )
      .collect();

    const sortedAdventureLogBlocks = adventureLogBlocks.sort(
      (a, b) => a.order - b.order
    );

    return sortedAdventureLogBlocks.find((block) => {
      return block.type === "image";
    });
  },
});

export const findCoverImageByAdventureLogId = query({
  args: {
    adventureLogId: v.id("adventureLogs"),
  },
  handler: async (ctx, { adventureLogId }) => {
    await validateIdentity(ctx);
    const adventureLogBlocks = await ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", adventureLogId)
      )
      .collect();

    const sortedAdventureLogBlocks = adventureLogBlocks.sort(
      (a, b) => a.order - b.order
    );

    const firstImageBlock = sortedAdventureLogBlocks.find((block) => {
      return block.type === "image";
    });

    if (!firstImageBlock || !firstImageBlock.fileId) {
      return null;
    }

    return ctx.db.get(firstImageBlock.fileId);
  },
});

// OWNER FUNCTIONS
// ==================================================
export const create = mutation({
  args: {
    adventureLogId: v.id("adventureLogs"),
    type: v.union(v.literal("text"), v.literal("image")),
    fileId: v.optional(v.id("files")),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { adventureLogId, type, fileId, content }) => {
    const { user } = await validateIdentity(ctx);
    const existingAdventureLog = await ctx.db.get(adventureLogId);
    if (!existingAdventureLog) throw new ConvexError("Adventure log not found");
    if (existingAdventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");

    const existingAdventureLogBlocks = await ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", adventureLogId)
      )
      .collect();

    return ctx.db.insert("adventureLogBlocks", {
      adventureLogId,
      order: existingAdventureLogBlocks?.length ?? 0,
      type,
      fileId,
      content: content ?? "",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("adventureLogBlocks"),
    fileId: v.optional(v.id("files")),
    content: v.optional(v.string()),
    displaySize: v.optional(
      v.union(v.literal("small"), v.literal("medium"), v.literal("large"))
    ),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, { id, content, fileId, displaySize, caption }) => {
    const { user } = await validateIdentity(ctx);
    const existingAdventureLogBlock = await ctx.db.get(id);
    if (!existingAdventureLogBlock)
      throw new ConvexError("Adventure log block not found");
    const existingAdventureLog = await ctx.db.get(
      existingAdventureLogBlock.adventureLogId
    );
    if (!existingAdventureLog) throw new ConvexError("Adventure log not found");
    if (existingAdventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");

    if (fileId && existingAdventureLogBlock.fileId) {
      // schedule delete old associated file
      const existingFileId = existingAdventureLogBlock.fileId;
      await ctx.scheduler.runAfter(
        100,
        internal.fileActions.systemDeleteFileAndS3ObjectsById,
        {
          id: existingFileId,
        }
      );
    }

    // reset the indexableContentUpdatedAt on the adventure log
    await ctx.db.patch(existingAdventureLogBlock.adventureLogId, {
      indexableContentUpdatedAt: new Date().toISOString(),
    });

    return await ctx.db.patch(id, {
      fileId: fileId ?? existingAdventureLogBlock.fileId,
      content: content ?? existingAdventureLogBlock.content,
      displaySize: displaySize ?? existingAdventureLogBlock.displaySize,
      caption: caption ?? existingAdventureLogBlock.caption,
    });
  },
});

export const moveBlockOrderUp = mutation({
  args: {
    id: v.id("adventureLogBlocks"),
  },
  handler: async (ctx, { id }) => {
    const { user } = await validateIdentity(ctx);
    const adventureLogBlock = await ctx.db.get(id);
    if (!adventureLogBlock)
      throw new ConvexError("Adventure log block not found");
    if (adventureLogBlock.order === 0) {
      return true;
    }
    const adventureLog = await ctx.db.get(adventureLogBlock.adventureLogId);
    if (!adventureLog) throw new ConvexError("Adventure log not found");
    if (adventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");

    const blockToSwapDown = await ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_adventure_log_id_order", (q) =>
        q
          .eq("adventureLogId", adventureLogBlock.adventureLogId)
          .eq("order", adventureLogBlock.order - 1)
      )
      .first();

    if (!blockToSwapDown) return true;

    await ctx.db.patch(blockToSwapDown._id, {
      order: blockToSwapDown.order + 1,
    });

    await ctx.db.patch(id, {
      order: adventureLogBlock.order - 1,
    });

    return true;
  },
});

export const moveBlockOrderDown = mutation({
  args: {
    id: v.id("adventureLogBlocks"),
  },
  handler: async (ctx, { id }) => {
    const { user } = await validateIdentity(ctx);
    const adventureLogBlock = await ctx.db.get(id);
    if (!adventureLogBlock)
      throw new ConvexError("Adventure log block not found");
    const adventureLog = await ctx.db.get(adventureLogBlock.adventureLogId);
    if (!adventureLog) throw new ConvexError("Adventure log not found");
    if (adventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");

    const existingAdventureLogBlocks = await ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", adventureLogBlock.adventureLogId)
      )
      .collect();

    if (adventureLogBlock.order === existingAdventureLogBlocks.length - 1) {
      return true;
    }
    const blockToSwapUp = existingAdventureLogBlocks.find(
      (block) => block.order === adventureLogBlock.order + 1
    );
    if (!blockToSwapUp) return true;

    await ctx.db.patch(blockToSwapUp._id, {
      order: blockToSwapUp.order - 1,
    });

    await ctx.db.patch(id, {
      order: adventureLogBlock.order + 1,
    });

    return true;
  },
});

export const destroy = mutation({
  args: {
    id: v.id("adventureLogBlocks"),
  },
  handler: async (ctx, { id }) => {
    const { user } = await validateIdentity(ctx);
    const existingAdventureLogBlock = await ctx.db.get(id);
    if (!existingAdventureLogBlock)
      throw new ConvexError("Adventure log block not found");
    const existingAdventureLog = await ctx.db.get(
      existingAdventureLogBlock.adventureLogId
    );
    if (!existingAdventureLog) throw new ConvexError("Adventure log not found");
    if (existingAdventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");

    // schedule delete associated file
    if (existingAdventureLogBlock.fileId) {
      await ctx.scheduler.runAfter(
        0,
        internal.fileActions.systemDeleteFileAndS3ObjectsById,
        {
          id: existingAdventureLogBlock.fileId,
        }
      );
    }

    // schedule delete of all associated galleries
    if (existingAdventureLogBlock.galleryId) {
      const existingGallery = await ctx.db.get(
        existingAdventureLogBlock.galleryId
      );
      if (existingGallery && existingGallery.images) {
        await asyncMap(existingGallery.images, async (image) => {
          if (image.fileId) {
            await ctx.scheduler.runAfter(
              0,
              internal.fileActions.systemDeleteFileAndS3ObjectsById,
              {
                id: image.fileId,
              }
            );
          }
        });
      }
      // delete gallery
      await ctx.db.delete(existingAdventureLogBlock.galleryId);
    }

    // reorder all blocks after this one
    const existingAdventureLogBlocks = await ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", existingAdventureLogBlock.adventureLogId)
      )
      .collect();

    await asyncMap(
      existingAdventureLogBlocks.filter(
        (b) => b.order > existingAdventureLogBlock.order
      ),
      async (b) => {
        await ctx.db.patch(b._id, {
          order: b.order - 1,
        });
      }
    );

    // delete block
    await ctx.db.delete(id);
    return true;
  },
});

// INTERNAL SYSTEM FUNCTIONS
// ==================================================
export const systemFindByFileId = internalQuery({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    return ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_file_id", (q) => q.eq("fileId", fileId))
      .first();
  },
});
