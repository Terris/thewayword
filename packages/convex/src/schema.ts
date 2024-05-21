import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  adventureLogs: defineTable({
    userId: v.id("users"),
    title: v.string(),
    location: v.optional(
      v.object({
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
        name: v.string(),
        fullAddress: v.optional(v.string()),
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
    caption: v.optional(v.string()),
  })
    .index("by_adventure_log_id", ["adventureLogId"])
    .index("by_order", ["order"])
    .index("by_adventure_log_id_order", ["adventureLogId", "order"]),
  adventureLogTags: defineTable({
    adventureLogId: v.id("adventureLogs"),
    tagId: v.id("tags"),
  })
    .index("by_adventure_log_id", ["adventureLogId"])
    .index("by_tag_id", ["tagId"]),
  carts: defineTable({
    userId: v.id("users"),
    hasPurchased: v.boolean(),
  }).index("by_user_id_has_purchased", ["userId", "hasPurchased"]),
  cartItems: defineTable({
    cartId: v.id("carts"),
    shopProductId: v.id("shopProducts"),
    options: v.optional(
      v.array(v.object({ name: v.string(), value: v.string() }))
    ),
  }).index("by_cart_id", ["cartId"]),
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
  follows: defineTable({
    ownerId: v.id("users"),
    followeeUserId: v.id("users"),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_followee_user_id", ["followeeUserId"])
    .index("by_owner_id_followee_user_id", ["ownerId", "followeeUserId"]),
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
  orders: defineTable({
    userId: v.id("users"),
    cartId: v.optional(v.id("carts")),
    stripePaymentIntentId: v.optional(v.string()),
    shippingAddress: v.object({
      addressLine1: v.string(),
      addressLine2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    }),
    paymentStatus: v.union(
      v.literal("created"),
      v.literal("processing"),
      v.literal("succeeded"),
      v.literal("failed")
    ),
    status: v.union(
      v.literal("processing payment"),
      v.literal("fulfilling"),
      v.literal("shipped"),
      v.literal("delivered")
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_stripe_payment_intent_id", ["stripePaymentIntentId"]),
  orderItems: defineTable({
    orderId: v.id("orders"),
    shopProductId: v.id("shopProducts"),
    options: v.optional(
      v.array(v.object({ name: v.string(), value: v.string() }))
    ),
  }).index("by_order_id", ["orderId"]),
  payments: defineTable({
    amountInCents: v.number(),
    description: v.optional(v.string()),
    eventId: v.optional(v.string()),
    failReason: v.optional(v.string()),
    status: v.string(),
    stripeCustomerId: v.string(),
    stripePaymentIntentId: v.string(),
    userId: v.id("users"),
    orderId: v.id("orders"),
  })
    .index("by_stripe_payment_intent_id", ["stripePaymentIntentId"])
    .index("by_order_id", ["orderId"]),
  shopProducts: defineTable({
    name: v.string(),
    priceInCents: v.number(),
    description: v.optional(v.string()),
    stripeProductId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    published: v.boolean(),
  }).index("by_published", ["published"]),
  shopProductOptions: defineTable({
    shopProductId: v.id("shopProducts"),
    name: v.string(),
    values: v.array(v.string()),
  }).index("by_shop_product_id", ["shopProductId"]),
  shopProductImages: defineTable({
    shopProductId: v.id("shopProducts"),
    order: v.number(),
    fileId: v.id("files"),
  }).index("by_shop_product_id", ["shopProductId"]),
  tags: defineTable({
    name: v.string(),
    slug: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_slug", ["slug"])
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
    stripeCustomerId: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_stripe_customer_id", ["stripeCustomerId"]),
  userAlerts: defineTable({
    userId: v.id("users"),
    message: v.string(),
    link: v.optional(v.string()),
    seen: v.optional(v.boolean()),
    read: v.boolean(),
    referenceId: v.optional(
      v.union(v.id("likes"), v.id("comments"), v.id("follows"))
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_id_read", ["userId", "read"])
    .index("by_reference_id", ["referenceId"]),
  userWhitelist: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
  waitlist: defineTable({
    email: v.string(),
    submitCount: v.optional(v.number()),
  }).index("by_email", ["email"]),
});
