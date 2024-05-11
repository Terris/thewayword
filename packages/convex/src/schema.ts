import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  adventureLogs: defineTable({
    userId: v.id("users"),
    title: v.string(),
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
    isPublic: v.boolean(),
    adventureStartDate: v.optional(v.string()),
    adventureEndDate: v.optional(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_is_public", ["isPublic"])
    .index("by_user_id_is_public", ["userId", "isPublic"]),
  adventureLogBlocks: defineTable({
    adventureLogId: v.id("adventureLogs"),
    type: v.union(v.literal("text"), v.literal("image")),
    order: v.number(),
    content: v.optional(v.string()),
    fileId: v.optional(v.id("files")),
    displaySize: v.optional(
      v.union(v.literal("small"), v.literal("medium"), v.literal("large"))
    ),
  })
    .index("by_adventure_log_id", ["adventureLogId"])
    .index("by_order", ["order"])
    .index("by_adventure_log_id_order", ["adventureLogId", "order"]),
  adventureLogTags: defineTable({
    adventureLogId: v.id("adventureLogs"),
    tagId: v.id("tags"),
  }).index("by_adventure_log_id", ["adventureLogId"]),
  comments: defineTable({
    adventureLogId: v.id("adventureLogs"),
    userId: v.id("users"),
    message: v.string(),
  }).index("by_adventure_log_id", ["adventureLogId"]),
  feedback: defineTable({
    message: v.string(),
    userId: v.id("users"),
  }),
  files: defineTable({
    url: v.string(),
    fileName: v.string(),
    mimeType: v.string(),
    type: v.string(),
    size: v.number(),
    dimensions: v.optional(
      v.object({
        width: v.optional(v.number()),
        height: v.optional(v.number()),
      })
    ),
    description: v.optional(v.string()),
    userId: v.id("users"),
    hash: v.optional(v.string()),
  }),
  invites: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
  likes: defineTable({
    userId: v.id("users"),
    adventureLogId: v.id("adventureLogs"),
  })
    .index("by_user_id", ["userId"])
    .index("by_adventure_log_id", ["adventureLogId"])
    .index("by_user_id_adventure_log_id", ["userId", "adventureLogId"]),
  tags: defineTable({
    name: v.string(),
  })
    .index("by_name", ["name"])
    .searchIndex("search_name", {
      searchField: "name",
    }),
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    tokenIdentifier: v.string(),
    clerkUserId: v.string(),
    avatarUrl: v.optional(v.string()),
    roles: v.optional(v.array(v.string())),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_clerk_user_id", ["clerkUserId"]),
  userWhitelist: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
  waitlist: defineTable({
    email: v.string(),
    submitCount: v.optional(v.number()),
  }).index("by_email", ["email"]),
});
