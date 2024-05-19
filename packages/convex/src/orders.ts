import { ConvexError, v } from "convex/values";
import { internalQuery, mutation } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const createOrderWithCartIdAndShippingAddress = mutation({
  args: {
    shippingAddress: v.object({
      addressLine1: v.string(),
      addressLine2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    }),
  },
  handler: async (ctx, { shippingAddress }) => {
    const { user } = await validateIdentity(ctx);

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user_id_has_purchased", (q) =>
        q.eq("userId", user._id).eq("hasPurchased", false)
      )
      .first();

    if (!cart) throw new ConvexError("No cart found");

    const newOrderId = await ctx.db.insert("orders", {
      status: "created",
      userId: user._id,
      cartId: cart._id,
      shippingAddress,
    });
    return newOrderId;
  },
});

// INTERNAL ACTIONS

export const systemFindById = internalQuery({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
