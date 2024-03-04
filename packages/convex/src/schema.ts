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
        full_address: v.string(),
        poiCategories: v.optional(v.array(v.string())),
      })
    ),
    showcaseFileId: v.optional(v.id("files")),
    published: v.boolean(),
    blocks: v.optional(
      v.array(
        v.object({
          type: v.union(v.literal("text"), v.literal("image")),
          order: v.number(),
          content: v.string(),
          fileId: v.optional(v.id("files")),
        })
      )
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_published", ["published"]),
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
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    roles: v.optional(v.array(v.string())),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),
  userWhitelist: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
  waitlist: defineTable({
    email: v.string(),
    submitCount: v.optional(v.number()),
  }).index("by_email", ["email"]),
  webhookLogs: defineTable({
    body: v.any(),
    from: v.string(),
    handled: v.optional(v.boolean()),
  }),
});
