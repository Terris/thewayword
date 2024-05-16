import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { stripe } from "./lib/stripe";
import { internal } from "./_generated/api";

export const internalCreateStripeProduct = internalAction({
  args: {
    name: v.string(),
    priceInCents: v.number(),
    shopProductId: v.id("shopProducts"),
  },
  handler: async (ctx, args) => {
    // create the stripe product
    const stripeProduct = await stripe.products.create({
      name: args.name,
      default_price_data: {
        currency: "usd",
        unit_amount: args.priceInCents,
      },
      statement_descriptor: `The Wayword ${args.name.substring(0, 9)}`,
      metadata: {
        shopProductId: args.shopProductId,
      },
    });

    // update the related product with the stripe product id and price id
    await ctx.runMutation(internal.shopProducts.internalSyncStripeProduct, {
      id: args.shopProductId,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripeProduct.default_price as string,
    });
    return true;
  },
});

export const internalUpdateStripeProduct = internalAction({
  args: {
    shopProductId: v.id("shopProducts"),
    stripeProductId: v.string(),
    stripePriceId: v.string(),
    name: v.optional(v.string()),
    priceInCents: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let stripePriceId = args.stripePriceId;
    if (args.priceInCents) {
      // update the stripe price
      const newStripePrice = await stripe.prices.create({
        currency: "usd",
        unit_amount: args.priceInCents,
        product: args.stripeProductId,
      });
      stripePriceId = newStripePrice.id;
    }

    // update the stripe product
    const stripeProduct = await stripe.products.update(args.stripeProductId, {
      name: args.name,
      default_price: stripePriceId,
    });

    // update the related product with the stripe product id and price id
    await ctx.runMutation(internal.shopProducts.internalSyncStripeProduct, {
      id: args.shopProductId,
      stripeProductId: args.stripeProductId,
      stripePriceId: stripeProduct.default_price as string,
    });

    return true;
  },
});
