import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const findById = query({
  args: { id: v.id("adventureLogs") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    return ctx.db.get(id);
  },
});

export const findAllPublished = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx);
    const adventureLogs = await ctx.db
      .query("adventureLogs")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
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

export const findAllPublishedBySessionedUser = query({
  args: {},
  handler: async (ctx, {}) => {
    const { user } = await validateIdentity(ctx);
    return ctx.db
      .query("adventureLogs")
      .withIndex("by_user_id_published", (q) =>
        q.eq("userId", user._id).eq("published", true)
      )
      .order("desc")
      .collect();
  },
});

export const findAllDraftsBySessionedUser = query({
  args: {},
  handler: async (ctx, {}) => {
    const { user } = await validateIdentity(ctx);
    return ctx.db
      .query("adventureLogs")
      .withIndex("by_user_id_published", (q) =>
        q.eq("userId", user._id).eq("published", false)
      )
      .order("desc")
      .collect();
  },
});

export const create = mutation({
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
    coverImageFileId: v.id("files"),
    tagsAsString: v.optional(v.string()),
  },
  handler: async (ctx, { location, coverImageFileId, tagsAsString }) => {
    const { user } = await validateIdentity(ctx);
    const newAdventureLogId = await ctx.db.insert("adventureLogs", {
      userId: user._id,
      title: "Untitled log",
      location,
      published: false,
      coverImageFileId,
    });

    if (tagsAsString) {
      // Split the tags by comma, remove any leading/trailing whitespace, and lowercase all tags
      const tags = tagsAsString
        .split(",")
        .map((tag) => tag.trim())
        .map((tag) => tag.toLowerCase());
      // Find or create the tags
      await asyncMap(tags, async (tagName) => {
        const existingTag = await ctx.db
          .query("tags")
          .withIndex("by_name", (q) => q.eq("name", tagName))
          .first();
        if (existingTag) {
          await ctx.db.insert("adventureLogTags", {
            adventureLogId: newAdventureLogId,
            tagId: existingTag._id,
          });
        } else {
          const newTagId = await ctx.db.insert("tags", { name: tagName });
          await ctx.db.insert("adventureLogTags", {
            adventureLogId: newAdventureLogId,
            tagId: newTagId,
          });
        }
      });
    }
    return newAdventureLogId;
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

type BlockType = "text" | "image";

export const addImageBlock = mutation({
  args: { id: v.id("adventureLogs"), fileId: v.id("files") },
  handler: async (ctx, { id, fileId }) => {
    const { user } = await validateIdentity(ctx);
    const existingAdventureLog = await ctx.db.get(id);
    if (!existingAdventureLog) throw new ConvexError("Adventure log not found");
    if (existingAdventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");

    const updatedLogBlocks = [
      ...(existingAdventureLog.blocks ?? []),
      {
        type: "image" as BlockType,
        order: (existingAdventureLog.blocks?.length ?? 0) + 1,
        fileId,
        content: "",
      },
    ];

    return ctx.db.patch(id, {
      blocks: updatedLogBlocks,
    });
  },
});
