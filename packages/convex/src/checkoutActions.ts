"use node";

import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { stripe } from "./lib/stripe";
import { validateActionIdentity } from "./lib/authorization";
import { api } from "./_generated/api";

export const createCheckoutSession = action({
  args: {},
  handler: async (ctx) => {
    const { user } = await validateActionIdentity(ctx);

    const cart = await ctx.runQuery(api.carts.findBySessionedUser);
    if (!cart) {
      throw new ConvexError("Cart not found");
    }

    const lineItems = cart.items.map((item) => {
      if (!item.product) throw new ConvexError("Product not found");
      return {
        price: item.product.stripePriceId,
        quantity: 1,
      };
    });

    await stripe.checkout.sessions.create({
      success_url: `${process.env.CLIENT_APP_URL}/checkout/success`,
      line_items: lineItems,
      mode: "payment",
      currency: "usd",
      client_reference_id: cart.userId,
      customer: user.stripeCustomerId ?? undefined,
    });

    return true;
  },
});
