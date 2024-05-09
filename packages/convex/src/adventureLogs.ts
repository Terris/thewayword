import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";
import { paginationOptsValidator } from "convex/server";

export const findById = query({
  args: { id: v.id("adventureLogs") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    const adventureLog = await ctx.db.get(id);
    if (!adventureLog) throw new ConvexError("Adventure log not found");
    const adventureLogWithUser = {
      ...adventureLog,
      user: await ctx.db.get(adventureLog.userId),
    };
    return adventureLogWithUser;
  },
});

export const findByIdAsOwner = query({
  args: { id: v.id("adventureLogs") },
  handler: async (ctx, { id }) => {
    const { user } = await validateIdentity(ctx);
    const adventureLog = await ctx.db.get(id);
    if (!adventureLog) throw new ConvexError("Adventure log not found");
    if (adventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");
    const adventureLogWithUser = {
      ...adventureLog,
      user: await ctx.db.get(adventureLog.userId),
    };
    return adventureLogWithUser;
  },
});

export const findAllPublic = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    await validateIdentity(ctx);
    const paginatedAdventureLogs = await ctx.db
      .query("adventureLogs")
      .withIndex("by_is_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .paginate(paginationOpts);

    const adventureLogsWithUser = await asyncMap(
      paginatedAdventureLogs.page,
      async (log) => {
        const user = await ctx.db.get(log.userId);
        if (!user) throw new ConvexError("Adventure log user not found");
        return {
          ...log,
          user: {
            id: user?._id,
            name: user?.name,
            avatarUrl: user?.avatarUrl,
          },
        };
      }
    );
    return { ...paginatedAdventureLogs, page: adventureLogsWithUser };
  },
});

export const findAllPublicBySessionedUser = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const { user } = await validateIdentity(ctx);
    const paginatedAdventureLogs = await ctx.db
      .query("adventureLogs")
      .withIndex("by_user_id_is_public", (q) =>
        q.eq("userId", user._id).eq("isPublic", true)
      )
      .order("desc")
      .paginate(paginationOpts);

    const adventureLogsWithUser = await asyncMap(
      paginatedAdventureLogs.page,
      async (log) => {
        const user = await ctx.db.get(log.userId);
        if (!user) throw new ConvexError("Adventure log user not found");
        return {
          ...log,
          user: {
            id: user?._id,
            name: user?.name,
            avatarUrl: user?.avatarUrl,
          },
        };
      }
    );
    return { ...paginatedAdventureLogs, page: adventureLogsWithUser };
  },
});

export const findAllPrivateBySessionedUser = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const { user } = await validateIdentity(ctx);
    const paginatedAdventureLogs = await ctx.db
      .query("adventureLogs")
      .withIndex("by_user_id_is_public", (q) =>
        q.eq("userId", user._id).eq("isPublic", false)
      )
      .order("desc")
      .paginate(paginationOpts);

    const adventureLogsWithUser = await asyncMap(
      paginatedAdventureLogs.page,
      async (log) => {
        const user = await ctx.db.get(log.userId);
        if (!user) throw new ConvexError("Adventure log user not found");
        return {
          ...log,
          user: {
            id: user?._id,
            name: user?.name,
            avatarUrl: user?.avatarUrl,
          },
        };
      }
    );
    return {
      ...paginatedAdventureLogs,
      page: adventureLogsWithUser,
    };
  },
});

export const findAllPublicByUserId = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.id("users"),
  },
  handler: async (ctx, { userId, paginationOpts }) => {
    await validateIdentity(ctx);
    const paginatedAdventureLogs = await ctx.db
      .query("adventureLogs")
      .withIndex("by_user_id_is_public", (q) =>
        q.eq("userId", userId).eq("isPublic", true)
      )
      .order("desc")
      .paginate(paginationOpts);

    const adventureLogsWithUser = await asyncMap(
      paginatedAdventureLogs.page,
      async (log) => {
        const user = await ctx.db.get(log.userId);
        if (!user) throw new ConvexError("Adventure log user not found");
        return {
          ...log,
          user: {
            id: user?._id,
            name: user?.name,
            avatarUrl: user?.avatarUrl,
          },
        };
      }
    );
    return {
      ...paginatedAdventureLogs,
      page: adventureLogsWithUser,
    };
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
      fullAddress: v.optional(v.string()),
      poiCategories: v.optional(v.array(v.string())),
    }),
    tagsAsString: v.optional(v.string()),
    adventureStartDate: v.optional(v.string()),
    adventureEndDate: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { location, tagsAsString, adventureStartDate, adventureEndDate }
  ) => {
    const { user } = await validateIdentity(ctx);

    // Split the tags by comma, remove any leading/trailing whitespace, and lowercase all tags
    const tags = tagsAsString
      ?.split(",")
      .map((tag) => tag.trim())
      .map((tag) => tag.toLowerCase());

    const newAdventureLogId = await ctx.db.insert("adventureLogs", {
      userId: user._id,
      title: "My adventure",
      location,
      isPublic: false,
      adventureStartDate,
      adventureEndDate,
    });

    if (tags?.length) {
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
    isPublic: v.optional(v.boolean()),
    adventureStartDate: v.optional(v.string()),
    adventureEndDate: v.optional(v.string()),
    location: v.optional(
      v.object({
        mapboxId: v.string(),
        type: v.string(),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
        name: v.string(),
        fullAddress: v.optional(v.string()),
        poiCategories: v.optional(v.array(v.string())),
      })
    ),
  },
  handler: async (
    ctx,
    { id, title, isPublic, adventureStartDate, adventureEndDate, location }
  ) => {
    const { user } = await validateIdentity(ctx);
    const existingAdventureLog = await ctx.db.get(id);
    if (!existingAdventureLog) throw new ConvexError("Adventure log not found");
    if (existingAdventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");

    return ctx.db.patch(id, {
      title: title ?? existingAdventureLog.title,
      isPublic: isPublic ?? existingAdventureLog.isPublic,
      adventureStartDate:
        adventureStartDate ?? existingAdventureLog.adventureStartDate,
      adventureEndDate:
        adventureEndDate ?? existingAdventureLog.adventureEndDate,
      location: location ?? existingAdventureLog.location,
    });
  },
});

export const destroy = mutation({
  args: { id: v.id("adventureLogs") },
  handler: async (ctx, { id }) => {
    const { user } = await validateIdentity(ctx);
    const existingAdventureLog = await ctx.db.get(id);
    if (!existingAdventureLog) throw new ConvexError("Adventure log not found");
    if (existingAdventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");

    return ctx.db.delete(id);
  },
});
