import { ConvexError, v } from "convex/values";
import { internalAction } from "./_generated/server";
import { stripe } from "./lib/stripe";
import { internal } from "./_generated/api";

// HANDLE WEBHOOKS
// ==================================================

export const handleWebhook = internalAction({
  args: { signature: v.string(), requestString: v.string() },
  handler: async (ctx, { signature, requestString }) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    try {
      // Check that the event signature is correct and return the event
      const event = await stripe.webhooks.constructEventAsync(
        requestString,
        signature,
        endpointSecret
      );

      if (!event) throw new ConvexError("Invalid event");

      let handled: boolean;

      // Handle the event
      switch (event.type) {
        case "payment_method.attached": {
          const paymentMethod = event.data.object;
          if (!paymentMethod.customer)
            throw new ConvexError(
              "No customer on payment_method.attached event"
            );

          const organization = await ctx.runQuery(
            internal.organizations.systemGetByStripeCustomerId,
            {
              stripeCustomerId: paymentMethod.customer as string,
            }
          );
          if (!organization)
            throw new ConvexError("Organization not found by stripeCustomerId");

          await ctx.runMutation(internal.organizations.systemUpdateById, {
            id: organization._id,
            paymentMethodDetails: {
              type: paymentMethod.type,
              brand: paymentMethod.card?.brand,
              last4: paymentMethod.card?.last4,
              expMonth: paymentMethod.card?.exp_month,
              expYear: paymentMethod.card?.exp_year,
            },
          });
          handled = true;
        }
        default: {
          handled = false;
        }
      }

      await ctx.runMutation(internal.webhooks.systemLogWebhook, {
        from: "stripe",
        body: event,
        handled,
      });

      return true;
    } catch (error: any) {
      throw new ConvexError(error.message);
    }
  },
});
