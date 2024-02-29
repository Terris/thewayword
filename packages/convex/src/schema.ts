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
    published: v.boolean(),
  })
    .index("by_user_id", ["userId"])
    .index("by_published", ["published"]),
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
