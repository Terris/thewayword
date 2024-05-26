import { asyncMap } from "convex-helpers";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const cleanUpShopProductImages = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allShopProductImages = await ctx.db
      .query("shopProductImages")
      .collect();

    await asyncMap(allShopProductImages, async (shopProductImage) => {
      // look for shop product
      const shopProduct = await ctx.db.get(shopProductImage.shopProductId);

      // if shop product exists do nothing
      if (shopProduct) return;

      // if it doesn't exist, delete the related file and shop product image
      await ctx.scheduler.runAfter(
        100,
        internal.fileActions.systemDeleteFileAndS3ObjectsById,
        {
          id: shopProductImage.fileId,
        }
      );
      await ctx.db.delete(shopProductImage._id);
    });
  },
});
