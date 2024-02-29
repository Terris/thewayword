import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
