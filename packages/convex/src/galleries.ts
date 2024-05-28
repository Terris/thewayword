import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const findById = query({
  args: {
    id: v.id("galleries"),
  },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    const gallery = await ctx.db.get(id);
    if (!gallery) throw new ConvexError("Gallery not found.");
    return {
      ...gallery,
      images: gallery.images?.sort((a, b) => a.order - b.order),
    };
  },
});

export const findByIdAsOwner = query({
  args: {
    id: v.id("galleries"),
  },
  handler: async (ctx, { id }) => {
    const { user } = await validateIdentity(ctx);
    const gallery = await ctx.db.get(id);
    if (!gallery) throw new ConvexError("Gallery not found.");
    if (gallery.userId !== user._id) {
      throw new ConvexError("You do not have permission to edit this gallery.");
    }
    return {
      ...gallery,
      images: gallery.images?.sort((a, b) => a.order - b.order),
    };
  },
});

export const createAsAdventureLogOwner = mutation({
  args: {
    adventureLogId: v.id("adventureLogs"),
  },
  handler: async (ctx, { adventureLogId }) => {
    const { user } = await validateIdentity(ctx);

    const existingAdventureLog = await ctx.db.get(adventureLogId);
    if (!existingAdventureLog) {
      throw new ConvexError("Adventure log not found.");
    }
    if (existingAdventureLog.userId !== user._id) {
      throw new ConvexError(
        "You do not have permission to edit this adventure log."
      );
    }

    const existingLogBlocks = await ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_adventure_log_id", (q) =>
        q.eq("adventureLogId", adventureLogId)
      )
      .collect();

    const newGalleryId = await ctx.db.insert("galleries", {
      userId: user._id,
      layout: "1x2",
    });

    const newAdventureLogBlock = await ctx.db.insert("adventureLogBlocks", {
      adventureLogId,
      galleryId: newGalleryId,
      type: "gallery",
      order: existingLogBlocks.length,
    });

    return newAdventureLogBlock;
  },
});

export const updateAsOwner = mutation({
  args: {
    galleryId: v.id("galleries"),
    layout: v.union(v.literal("1x2"), v.literal("2x1"), v.literal("row")),
  },
  handler: async (ctx, { galleryId, layout }) => {
    const { user } = await validateIdentity(ctx);
    const existingGallery = await ctx.db.get(galleryId);
    if (!existingGallery) {
      throw new ConvexError("Gallery not found.");
    }
    if (existingGallery.userId !== user._id) {
      throw new ConvexError("You do not have permission to edit this gallery.");
    }

    return ctx.db.patch(galleryId, {
      layout: layout ?? existingGallery.layout,
    });
  },
});

export const updateGalleryImageAsOwner = mutation({
  args: {
    galleryId: v.id("galleries"),
    fileId: v.id("files"),
    order: v.number(),
  },
  handler: async (ctx, { galleryId, fileId, order }) => {
    const { user } = await validateIdentity(ctx);
    const existingGallery = await ctx.db.get(galleryId);
    if (!existingGallery) {
      throw new ConvexError("Gallery not found.");
    }
    if (existingGallery.userId !== user._id) {
      throw new ConvexError("You do not have permission to edit this gallery.");
    }

    // replace or insert new image
    const existingImageAtOrder = existingGallery.images?.find(
      (image) => image.order === order
    );
    let updatedImages = existingGallery.images;
    if (existingImageAtOrder) {
      updatedImages = updatedImages?.map((image) => {
        if (image.order === order) {
          return { ...image, fileId, order };
        }
        return image;
      });
    } else {
      updatedImages = [...(existingGallery.images ?? []), { fileId, order }];
    }

    await ctx.db.patch(galleryId, { images: updatedImages });
  },
});
