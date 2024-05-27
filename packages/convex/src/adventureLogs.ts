import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { filter } from "convex-helpers/server/filter";
import { internalMutation, mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { internal } from "./_generated/api";
import { stringToSlug } from "./lib/utils";
import { compareAsc } from "date-fns";
import { extractTipTapTextRecursively } from "./lib/tiptap";

export const search = query({
  args: { queryTerm: v.string() },
  handler: async (ctx, { queryTerm }) => {
    await validateIdentity(ctx);
    const results = await ctx.db
      .query("adventureLogs")
      .withSearchIndex("search_indexable_search_content", (q) =>
        q.search("indexableSearchContent", queryTerm).eq("isPublic", true)
      )
      .collect();
    await asyncMap(results, async (log) => {
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
    });
  },
});

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

export const findAllFollowingPublicBySessionedUserId = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const { user } = await validateIdentity(ctx);

    const following = await ctx.db
      .query("follows")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user._id))
      .collect();

    const followingUserIds = following.map((follow) => follow.followeeUserId);

    const paginatedAdventureLogs = await filter(
      ctx.db
        .query("adventureLogs")
        .withIndex("by_is_public", (q) => q.eq("isPublic", true)),
      (log) => followingUserIds.includes(log.userId)
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

export const findAllPublicByTagSlug = query({
  args: { tagSlug: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, { tagSlug, paginationOpts }) => {
    await validateIdentity(ctx);

    const tag = await ctx.db
      .query("tags")
      .withIndex("by_slug", (q) => q.eq("slug", tagSlug))
      .first();

    if (!tag) throw new ConvexError("Tag not found");

    const allAdventureLogTagsByTagId = await ctx.db
      .query("adventureLogTags")
      .withIndex("by_tag_id", (q) => q.eq("tagId", tag._id))
      .collect();

    const adventureLogIds = allAdventureLogTagsByTagId.map(
      (tag) => tag.adventureLogId
    );

    const paginatedAdventureLogs = await filter(
      ctx.db
        .query("adventureLogs")
        .withIndex("by_is_public", (q) => q.eq("isPublic", true)),
      (log) => adventureLogIds.includes(log._id)
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
      latitude: v.number(),
      longitude: v.number(),
      name: v.string(),
      fullAddress: v.optional(v.string()),
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
      indexableContentUpdatedAt: new Date().toISOString(),
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
          const newTagId = await ctx.db.insert("tags", {
            name: tagName,
            slug: stringToSlug(tagName),
          });
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
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
        name: v.string(),
        fullAddress: v.optional(v.string()),
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

    // reset the indexableContentUpdatedAt on the adventure log
    await ctx.db.patch(id, {
      indexableContentUpdatedAt: new Date().toISOString(),
    });

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

export const scheduleDestroy = mutation({
  args: { id: v.id("adventureLogs") },
  handler: async (ctx, { id }) => {
    const { user } = await validateIdentity(ctx);
    const existingAdventureLog = await ctx.db.get(id);
    if (!existingAdventureLog) throw new ConvexError("Adventure log not found");
    if (existingAdventureLog.userId !== user._id)
      throw new ConvexError("Not the owner of this adventure log");
    // We schedule the deletion to navigate the user away from the page
    // while the delete action takes place
    // This also avoids not found errors
    await ctx.scheduler.runAfter(
      1000,
      internal.adventureLogs.systemDeleteLogsAndRelatedObjects,
      {
        id,
      }
    );
    return true;
  },
});

export const systemDeleteLogsAndRelatedObjects = internalMutation({
  args: { id: v.id("adventureLogs") },
  handler: async (ctx, { id }) => {
    // Delete all related adventureLogBlocks
    const allAdventureLogBlocks = await ctx.db
      .query("adventureLogBlocks")
      .withIndex("by_adventure_log_id", (q) => q.eq("adventureLogId", id))
      .collect();
    asyncMap(allAdventureLogBlocks, async (block) => {
      await ctx.db.delete(block._id);
    });

    // Delete all related adventureLogTags
    const allAdventureLogTags = await ctx.db
      .query("adventureLogTags")
      .withIndex("by_adventure_log_id", (q) => q.eq("adventureLogId", id))
      .collect();
    await asyncMap(allAdventureLogTags, async (tag) => {
      await ctx.db.delete(tag._id);
    });

    // Delete all related comments
    const allComments = await ctx.db
      .query("comments")
      .withIndex("by_adventure_log_id", (q) => q.eq("adventureLogId", id))
      .collect();
    await asyncMap(allComments, async (comment) => {
      await ctx.db.delete(comment._id);
    });

    // Delete all related likes
    const allLikes = await ctx.db
      .query("likes")
      .withIndex("by_adventure_log_id", (q) => q.eq("adventureLogId", id))
      .collect();
    await asyncMap(allLikes, async (like) => {
      await ctx.db.delete(like._id);
    });

    // Delete the adventure log
    await ctx.db.delete(id);
  },
});

export const systemIndexSearchContent = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allAdventureLogs = await ctx.db.query("adventureLogs").collect();

    // loop over all adventure logs and update the indexable search content
    await asyncMap(allAdventureLogs, async (log) => {
      // if the log has been indexed after it was last updated, skip it
      if (
        log.indexedAt &&
        log.indexableContentUpdatedAt &&
        // return 1 if the first date is after the second,
        // -1 if the first date is before the second
        // or 0 if dates are equal.
        compareAsc(log.indexedAt, log.indexableContentUpdatedAt) >= 0
      )
        return;

      let indexableSearchContent = `${log.title} `;

      // loop over related tags and build the indexable search content
      const allAdventureLogTags = await ctx.db
        .query("adventureLogTags")
        .withIndex("by_adventure_log_id", (q) =>
          q.eq("adventureLogId", log._id)
        )
        .collect();
      await asyncMap(allAdventureLogTags, async (logTag) => {
        const tag = await ctx.db.get(logTag.tagId);
        if (!tag) throw new ConvexError("Tag not found");
        indexableSearchContent += `${tag.name} `;
      });

      // loop over related blocks and build the indexable search content
      const allAdventureLogBlocks = await ctx.db
        .query("adventureLogBlocks")
        .withIndex("by_adventure_log_id", (q) =>
          q.eq("adventureLogId", log._id)
        )
        .collect();
      await asyncMap(allAdventureLogBlocks, async (block) => {
        if (block.type === "text" && block.content) {
          const textAsJson = JSON.parse(block.content);
          const blockContent = extractTipTapTextRecursively(textAsJson.content);
          indexableSearchContent += `${blockContent} `;
        } else if (block.caption) {
          indexableSearchContent += `${block.caption} `;
        }
      });

      await ctx.db.patch(log._id, {
        indexableSearchContent: indexableSearchContent
          .replace(/\s+/g, " ")
          .trim(),
        indexedAt: new Date().toISOString(),
      });
    });
  },
});
