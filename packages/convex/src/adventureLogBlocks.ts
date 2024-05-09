import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

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
  },
  handler: async (ctx, { id, content, fileId }) => {
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

    return ctx.db.patch(id, {
      fileId: fileId ?? existingAdventureLogBlock.fileId,
      content: content ?? existingAdventureLogBlock.content,
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
      console.log("block is already at top");
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

// export const updateOrder = mutation({
//   args: {
//     idsInOrder: v.array(v.id("adventureLogBlocks")),
//   },
//   handler: async (ctx, { idsInOrder }) => {
//     await validateIdentity(ctx);
//     await asyncMap(idsInOrder, async (adventureLogBlockId, index) =>
//       ctx.db.patch(adventureLogBlockId, {
//         order: index + 1,
//       })
//     );
//     return true;
//   },
// });

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

    await ctx.db.delete(id);
    return true;
  },
});
