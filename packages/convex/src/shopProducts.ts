import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { internal } from "./_generated/api";
import { asyncMap } from "convex-helpers";

export const findById = query({
  args: { id: v.id("shopProducts") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    return ctx.db.get(id);
  },
});

export const findPublishedById = query({
  args: { id: v.id("shopProducts") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const shopProduct = await ctx.db.get(id);
    if (!shopProduct || !shopProduct.published)
      throw new ConvexError("Product not found");

    const shopProductOptions = await ctx.db
      .query("shopProductOptions")
      .withIndex("by_shop_product_id", (q) => q.eq("shopProductId", id))
      .collect();

    return {
      ...shopProduct,
      options: shopProductOptions,
    };
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

export const editById = mutation({
  args: {
    id: v.id("shopProducts"),
    name: v.optional(v.string()),
    priceInCents: v.optional(v.number()),
    description: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, name, priceInCents, description, published }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const existingProduct = await ctx.db.get(id);
    if (!existingProduct) throw new ConvexError("Product not found");
    await ctx.db.patch(id, {
      name: name ?? existingProduct.name,
      priceInCents: priceInCents ?? existingProduct.priceInCents,
      description: description ?? existingProduct.description,
      published: published ?? existingProduct.published,
    });

    // update the product in stripe
    if (!existingProduct.stripeProductId || !existingProduct.stripePriceId) {
      throw new ConvexError(
        "Product does not have a stripe product id or price id"
      );
    }

    await ctx.scheduler.runAfter(
      0,
      internal.shopProductActions.internalUpdateStripeProduct,
      {
        shopProductId: id,
        stripeProductId: existingProduct.stripeProductId,
        stripePriceId: existingProduct.stripePriceId,
        name: name !== existingProduct.name ? name : undefined,
        priceInCents:
          priceInCents !== existingProduct.priceInCents
            ? priceInCents
            : undefined,
      }
    );
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
