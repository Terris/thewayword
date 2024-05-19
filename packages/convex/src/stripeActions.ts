import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { stripe } from "./lib/stripe";
import { internalAction } from "./_generated/server";

// WEBHOOKS
export const handleWebhook = internalAction({
  args: { signature: v.string(), requestString: v.string() },
  handler: async (ctx, { signature, requestString }) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    try {
      // Check that the event signature is correct and return the event
      const event = stripe.webhooks.constructEvent(
        requestString,
        signature,
        endpointSecret
      );

      // Handle the event
      switch (event.type) {
        case "payment_intent.created": {
          const paymentIntent = event.data.object;
          const user = await ctx.runQuery(
            internal.users.systemFindByStripeCustomerId,
            {
              stripeCustomerId: paymentIntent.customer as string,
            }
          );

          if (!user) {
            throw new ConvexError(
              `Could not find user with stripeCustomerId: ${paymentIntent.customer}`
            );
          }

          await ctx.runMutation(internal.payments.systemCreatePayment, {
            userId: user._id,
            eventId: event.id,
            stripePaymentIntentId: paymentIntent.id,
            stripeCustomerId: paymentIntent.customer as string,
            amountInCents: paymentIntent.amount,
            status: paymentIntent.status,
          });
        }
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          await ctx.runMutation(internal.payments.systemUpdatePaymentStatus, {
            stripePaymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
          });
        }
        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object;
          await ctx.runMutation(internal.payments.systemUpdatePaymentStatus, {
            stripePaymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
            failReason: paymentIntent.last_payment_error?.message,
          });
        }
        default: {
        }
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});
