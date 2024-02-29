import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const findAllPublished = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx);
    const adventureLogs = await ctx.db
      .query("adventureLogs")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    if (!adventureLogs) throw new ConvexError("Adventure logs not found");

    const adventureLogsWithUser = await asyncMap(adventureLogs, async (log) => {
      const user = await ctx.db.get(log.userId);
      if (!user) return log;
      return {
        ...log,
        user: {
          id: user._id,
          name: user.name,
        },
      };
    });
    return adventureLogsWithUser;
  },
});

export const findById = query({
  args: { id: v.id("adventureLogs") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    return ctx.db.get(id);
  },
});

export const createWithLocation = mutation({
  args: {
    location: v.object({
      mapboxId: v.string(),
      type: v.string(),
      latitude: v.number(),
      longitude: v.number(),
      name: v.string(),
      full_address: v.string(),
      poiCategories: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, { location }) => {
    const { user } = await validateIdentity(ctx);
    return ctx.db.insert("adventureLogs", {
      userId: user._id,
      title: "Untitled log",
      location,
      published: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("adventureLogs"),
    title: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, title, published }) => {
    const { user } = await validateIdentity(ctx);
    const existingAdventureLog = await ctx.db.get(id);
    if (!existingAdventureLog) throw new ConvexError("Adventure log not found");

    if (existingAdventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");

    return ctx.db.patch(id, {
      title: title ?? existingAdventureLog.title,
      published: published ?? existingAdventureLog.published,
    });
  },
});
