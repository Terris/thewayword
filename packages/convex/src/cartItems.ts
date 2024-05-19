import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { asyncMap } from "convex-helpers";

export const systemFindAllByCartId = internalQuery({
  args: { cartId: v.id("carts") },
  handler: async (ctx, { cartId }) => {
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_cart_id", (q) => q.eq("cartId", cartId))
      .collect();

    return await asyncMap(cartItems, async (item) => {
      const itemProduct = await ctx.db.get(item.shopProductId);
      return { ...item, product: itemProduct };
    });
  },
});
