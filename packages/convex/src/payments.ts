import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// INTERNAL
export const systemCreatePayment = internalMutation({
  args: {
    userId: v.id("users"),
    eventId: v.optional(v.string()),
    stripePaymentIntentId: v.string(),
    stripeCustomerId: v.string(),
    amountInCents: v.number(),
    status: v.string(),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    // check that the payment doesn't already exist
    const existingPayment = await ctx.db
      .query("payments")
      .filter((q) =>
        q.eq(q.field("stripePaymentIntentId"), args.stripePaymentIntentId)
      )
      .first();
    if (existingPayment) {
      throw new ConvexError("Payment already exists");
    }
    return await ctx.db.insert("payments", args);
  },
});

export const systemUpdatePaymentStatus = internalMutation({
  args: {
    stripePaymentIntentId: v.string(),
    status: v.string(),
    failReason: v.optional(v.string()),
  },
  handler: async (ctx, { stripePaymentIntentId, status, failReason }) => {
    const existingPayment = await ctx.db
      .query("payments")
      .withIndex("by_stripe_payment_intent_id", (q) =>
        q.eq("stripePaymentIntentId", stripePaymentIntentId)
      )
      .first();

    if (!existingPayment) {
      throw new Error(
        `Could not find payment with stripePaymentIntentId: ${stripePaymentIntentId}`
      );
    }

    await ctx.db.patch(existingPayment._id, {
      status,
      failReason,
    });

    if (status === "succeeded") {
      await ctx.scheduler.runAfter(
        0,
        internal.orders.systemHandleSuccessfulPayment,
        {
          orderId: existingPayment.orderId,
        }
      );
    }
  },
});
