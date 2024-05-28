"use node";

import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";
import { stripe } from "./lib/stripe";
import { validateActionIdentity } from "./lib/authorization";

export const createPaymentIntent = action({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    const { user } = await validateActionIdentity(ctx);

    const order = await ctx.runQuery(internal.orders.systemFindById, {
      id: orderId,
    });

    if (!order || !order.cartId) {
      throw new ConvexError("Order not found");
    }

    const cartItems = await ctx.runQuery(
      internal.cartItems.systemFindAllByCartId,
      {
        cartId: order.cartId,
      }
    );

    if (!cartItems.length) throw new ConvexError("No cart items found");

    const taxCalculation = await stripe.tax.calculations.create({
      currency: "usd",
      customer_details: {
        address: {
          line1: order.shippingAddress.addressLine1,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postal_code: order.shippingAddress.zip,
          country: "US",
        },
        address_source: "shipping",
      },
      line_items: cartItems.map((item) => ({
        amount: item.product?.priceInCents || 0,
        reference: item._id,
      })),
    });

    const subtotal = cartItems.reduce((acc, currentItem) => {
      return acc + (currentItem.product?.priceInCents ?? 0);
    }, 0);

    const totalAmount = subtotal + taxCalculation.tax_amount_exclusive;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      customer: user.stripeCustomerId,
      currency: "usd",
      metadata: {
        orderId: order._id,
        tax_calculation: taxCalculation.id,
      },
    });

    // update the order with the payment intent id
    await ctx.runMutation(internal.orders.systemUpdateStripePaymentIntent, {
      id: order._id,
      stripePaymentIntentId: paymentIntent.id,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      taxAmount: taxCalculation.tax_amount_inclusive,
      totalAmount: taxCalculation.amount_total,
    };
  },
});
