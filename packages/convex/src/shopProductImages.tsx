import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";
import { internal } from "./_generated/api";

export const findAllByShopProductId = query({
  args: {
    shopProductId: v.id("shopProducts"),
  },
  handler: async (ctx, { shopProductId }) => {
    await validateIdentity(ctx);
    const shopProductImages = await ctx.db
      .query("shopProductImages")
      .withIndex("by_shop_product_id", (q) =>
        q.eq("shopProductId", shopProductId)
      )
      .collect();
    if (!shopProductImages) return;
    return await asyncMap(shopProductImages, async (image) => {
      const file = await ctx.db.get(image.fileId);
      return { ...image, file };
    });
  },
});

export const findFirstByShopProductId = query({
  args: {
    shopProductId: v.id("shopProducts"),
  },
  handler: async (ctx, { shopProductId }) => {
    await validateIdentity(ctx);
    const productImage = await ctx.db
      .query("shopProductImages")
      .withIndex("by_shop_product_id", (q) =>
        q.eq("shopProductId", shopProductId)
      )
      .first();
    if (!productImage) return;
    const productImageFile = await ctx.db.get(productImage.fileId);
    return { ...productImage, file: productImageFile };
  },
});

export const createByShopProductId = mutation({
  args: {
    shopProductId: v.id("shopProducts"),
    fileId: v.id("files"),
  },
  handler: async (ctx, { shopProductId, fileId }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const existingShopImages = await ctx.db
      .query("shopProductImages")
      .withIndex("by_shop_product_id", (q) =>
        q.eq("shopProductId", shopProductId)
      )
      .collect();
    return ctx.db.insert("shopProductImages", {
      fileId,
      shopProductId,
      order: existingShopImages.length ?? 0,
    });
  },
});

export const deleteById = mutation({
  args: { id: v.id("shopProductImages") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const existingShopImage = await ctx.db.get(id);
    if (!existingShopImage) throw new Error("Shop product image not found");

    // delete the file
    // schedule delete old associated file
    await ctx.scheduler.runAfter(
      0,
      internal.fileActions.systemDeleteFileAndS3ObjectsById,
      {
        id: existingShopImage.fileId,
      }
    );

    // delete the shop product image
    return ctx.db.delete(id);
  },
});

// INTERNAL
export const systemFindByFileId = internalQuery({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    return ctx.db
      .query("shopProductImages")
      .withIndex("by_file_id", (q) => q.eq("fileId", fileId))
      .first();
  },
});
