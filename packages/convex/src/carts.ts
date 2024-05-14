import { asyncMap } from "convex-helpers";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { v } from "convex/values";

export const findBySessionedUser = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await validateIdentity(ctx);

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();

    if (!cart || !cart.items) return null;

    const cartItemsWithProducts = await asyncMap(cart.items, async (item) => {
      const product = await ctx.db.get(item.shopProductId);
      return { ...item, product };
    });

    return {
      ...cart,
      items: cartItemsWithProducts,
    };
  },
});

export const addShopProductToCartBySessionedUser = mutation({
  args: { shopProductId: v.id("shopProducts"), quantity: v.number() },
  handler: async (ctx, { shopProductId, quantity }) => {
    const { user } = await validateIdentity(ctx);
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();

    if (!cart) {
      return await ctx.db.insert("carts", {
        userId: user._id,
        items: [{ shopProductId, quantity }],
      });
    } else {
      const itemAlreadyExists = cart?.items?.find(
        (item) => item.shopProductId === shopProductId
      );

      let updatedItems;
      if (itemAlreadyExists) {
        updatedItems = cart.items.map((item) =>
          item.shopProductId === shopProductId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...cart.items, { shopProductId, quantity }];
      }
      await ctx.db.patch(cart._id, { items: updatedItems });
    }
  },
});
