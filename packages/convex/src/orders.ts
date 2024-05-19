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

export const findByIdAsOwner = query({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    const { user } = await validateIdentity(ctx);
    const order = await ctx.db.get(id);
    if (!order) throw new ConvexError("Order not found");
    if (order.userId !== user._id)
      throw new ConvexError("Order does not belong to current user");

    const orderItems = await ctx.db
      .query("orderItems")
      .withIndex("by_order_id", (q) => q.eq("orderId", order._id))
      .collect();

    if (!orderItems) return null;

    const orderItemsWithProducts = await asyncMap(orderItems, async (item) => {
      const product = await ctx.db.get(item.shopProductId);
      return { ...item, product };
    });

    return {
      ...order,
      items: orderItemsWithProducts,
    };
  },
});

export const findAllAsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const orders = await ctx.db.query("orders").collect();

    const ordersWithUsers = await asyncMap(orders, async (order) => {
      const user = await ctx.db.get(order.userId);
      if (!user) throw new ConvexError("User not found");
      return { ...order, user };
    });

    return ordersWithUsers;
  },
});

export const findByIdAsAdmin = query({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const order = await ctx.db.get(id);
    if (!order) throw new ConvexError("Order not found");

    const orderPayments = await ctx.db
      .query("payments")
      .withIndex("by_order_id", (q) => q.eq("orderId", id))
      .collect();

    const orderItems = await ctx.db
      .query("orderItems")
      .withIndex("by_order_id", (q) => q.eq("orderId", order._id))
      .collect();

    if (!orderItems) return null;

    const orderItemsWithProducts = await asyncMap(orderItems, async (item) => {
      const product = await ctx.db.get(item.shopProductId);
      return { ...item, product };
    });

    return {
      ...order,
      payments: orderPayments,
      items: orderItemsWithProducts,
    };
  },
});

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

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_cart_id", (q) => q.eq("cartId", cart._id))
      .collect();

    if (!cartItems.length) throw new ConvexError("Cart is empty");

    const newOrderId = await ctx.db.insert("orders", {
      status: "processing payment",
      paymentStatus: "created",
      userId: user._id,
      cartId: cart._id,
      shippingAddress,
    });

    // Add all cart items to the order
    await asyncMap(cartItems, async (cartItem) => {
      await ctx.db.insert("orderItems", {
        orderId: newOrderId,
        shopProductId: cartItem.shopProductId,
        options: cartItem.options,
      });
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

export const systemUpdateStripePaymentIntent = internalMutation({
  args: { id: v.id("orders"), stripePaymentIntentId: v.string() },
  handler: async (ctx, { id, stripePaymentIntentId }) => {
    return await ctx.db.patch(id, { stripePaymentIntentId });
  },
});

export const systemHandleSuccessfulPayment = internalMutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    const order = await ctx.db.get(orderId);
    if (!order) throw new ConvexError("Order not found");
    await ctx.db.patch(orderId, {
      paymentStatus: "succeeded",
      status: "fulfilling",
    });

    // Reset the cart
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user_id_has_purchased", (q) =>
        q.eq("userId", order.userId).eq("hasPurchased", false)
      )
      .first();

    if (!cart) throw new ConvexError("No cart found");
    await ctx.db.patch(cart._id, { hasPurchased: true });

    const orderUser = await ctx.db.get(order.userId);
    if (!orderUser) throw new ConvexError("Order user not found");

    // send a new order email to admin
    await ctx.scheduler.runAfter(
      0,
      internal.orderActions.sendCompletedOrderEmailToAdmin,
      {
        userEmail: orderUser.email,
        orderId: order._id,
      }
    );

    // send a new order email to admin
    await ctx.scheduler.runAfter(
      0,
      internal.orderActions.sendOrderConfirmationEmailToUser,
      {
        userEmail: orderUser.email,
        orderId: order._id,
      }
    );
  },
});
