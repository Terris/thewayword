import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const findById = query({
  args: { id: v.id("shopProductOptions") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    return ctx.db.get(id);
  },
});

export const findAllByShopProductId = query({
  args: { shopProductId: v.id("shopProducts") },
  handler: async (ctx, { shopProductId }) => {
    await validateIdentity(ctx);
    return ctx.db
      .query("shopProductOptions")
      .withIndex("by_shop_product_id", (q) =>
        q.eq("shopProductId", shopProductId)
      )
      .collect();
  },
});

export const createByShopProductId = mutation({
  args: { shopProductId: v.id("shopProducts") },
  handler: async (ctx, { shopProductId }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    return ctx.db.insert("shopProductOptions", {
      shopProductId,
      name: "Untitled option",
      values: ["option one"],
    });
  },
});

export const editById = mutation({
  args: {
    id: v.id("shopProductOptions"),
    name: v.string(),
    values: v.string(),
  },
  handler: async (ctx, { id, name, values }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    const valuesArray = values.split(",");
    return ctx.db.patch(id, { name, values: valuesArray });
  },
});

export const deleteById = mutation({
  args: { id: v.id("shopProductOptions") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });
    return ctx.db.delete(id);
  },
});
