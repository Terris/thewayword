import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { internal } from "./_generated/api";

export const findById = query({
  args: { id: v.id("shopProducts") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    return ctx.db.get(id);
  },
});

export const findAllPublished = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx);
    return ctx.db
      .query("shopProducts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
  },
});

export const findAllAsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    return ctx.db.query("shopProducts").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    priceInCents: v.number(),
    description: v.string(),
    published: v.boolean(),
  },
  handler: async (ctx, { name, priceInCents, description, published }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });

    const newShopProductId = await ctx.db.insert("shopProducts", {
      name,
      priceInCents,
      description,
      published,
    });

    // create the product in stripe and save the stripe product id and stripe price id
    await ctx.scheduler.runAfter(
      0,
      internal.shopProductActions.internalCreateStripeProduct,
      {
        name,
        priceInCents,
        shopProductId: newShopProductId,
      }
    );
    return newShopProductId;
  },
});

export const internalSyncStripeProduct = internalMutation({
  args: {
    id: v.id("shopProducts"),
    stripeProductId: v.string(),
    stripePriceId: v.string(),
  },
  handler: async (ctx, { id, stripeProductId, stripePriceId }) => {
    return ctx.db.patch(id, { stripeProductId, stripePriceId });
  },
});
