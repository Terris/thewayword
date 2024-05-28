import { asyncMap } from "convex-helpers";
import { internalQuery, mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { v } from "convex/values";

export const findBySessionedUser = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await validateIdentity(ctx);

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user_id_has_purchased", (q) =>
        q.eq("userId", user._id).eq("hasPurchased", false)
      )
      .first();

    if (!cart) return null;

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_cart_id", (q) => q.eq("cartId", cart._id))
      .collect();

    if (!cartItems) return null;

    const cartItemsWithProducts = await asyncMap(cartItems, async (item) => {
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
  args: {
    shopProductId: v.id("shopProducts"),
    options: v.optional(
      v.array(
        v.object({
          name: v.string(),
          value: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, { shopProductId, options }) => {
    const { user } = await validateIdentity(ctx);
    const existingCart = await ctx.db
      .query("carts")
      .withIndex("by_user_id_has_purchased", (q) =>
        q.eq("userId", user._id).eq("hasPurchased", false)
      )
      .first();

    let cartId = existingCart?._id;
    if (!existingCart) {
      cartId = await ctx.db.insert("carts", {
        userId: user._id,
        hasPurchased: false,
      });
    }
    if (!cartId) throw new Error("Failed to get or create cart");
    await ctx.db.insert("cartItems", {
      cartId,
      shopProductId,
      options,
    });
  },
});

export const removeCartItemById = mutation({
  args: {
    cartId: v.id("carts"),
    cartItemId: v.id("cartItems"),
  },
  handler: async (ctx, { cartId, cartItemId }) => {
    const { user } = await validateIdentity(ctx);
    const existingCart = await ctx.db.get(cartId);
    if (!existingCart) throw new Error("Cart not found");
    if (existingCart.userId !== user._id) throw new Error("Unauthorized");
    await ctx.db.delete(cartItemId);
  },
});

// INTERNAL ACTIONS

export const systemFindById = internalQuery({
  args: { id: v.id("carts") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
