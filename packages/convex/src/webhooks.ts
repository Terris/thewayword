import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// INTERNAL FUNCTIONS
// ==================================================

/**
 * Log a webhook event.
 * @param from - The source of the webhook.
 * @param body - The body of the webhook.
 */
export const systemLogWebhook = internalMutation({
  args: { from: v.string(), body: v.any(), handled: v.optional(v.boolean()) },
  handler: async (ctx, { from, body, handled }) => {
    // eslint-disable-next-line -- we want to allow body to be any data type
    await ctx.db.insert("webhookLogs", { from, body, handled });
  },
});
