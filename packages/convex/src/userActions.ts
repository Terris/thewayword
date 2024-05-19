"use node";

import { Webhook } from "svix";
import { UserJSON, WebhookEvent, clerkClient } from "@clerk/clerk-sdk-node";
import { ConvexError, v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { emailFromAddress } from "./lib/email";
import { Resend } from "resend";
import { stripe } from "./lib/stripe";

// INTERNAL FUNCTIONS
// ==================================================

/**
 * Send a user email to the admin.
 * @param waitlistEmail - The email to send.
 */
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendNewUserEmailToAdmin = internalAction({
  args: { userEmail: v.string() },
  handler: async (ctx, { userEmail }) => {
    const sendEmailResponse = await resend.emails.send({
      from: emailFromAddress!,
      to: emailFromAddress!,
      subject: "New user sign up",
      text: `A new user has signed up on The Wayword: ${userEmail}`,
    });

    if (sendEmailResponse.error) {
      throw new ConvexError(sendEmailResponse.error.message);
    }

    return true;
  },
});

/**
 * Handle a Clerk webhook.
 * @param signature - The Clerk webhook signature.
 * @param requestString - The Clerk webhook request body.
 */
export const internalHandleClerkWebhook = internalAction({
  args: {
    signature: v.object({
      svixId: v.union(v.string(), v.null()),
      svixTimestamp: v.union(v.string(), v.null()),
      svixSignature: v.union(v.string(), v.null()),
    }),
    requestString: v.string(),
  },
  handler: async (ctx, { signature, requestString }) => {
    const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
    const body = requestString;

    try {
      if (
        !signature.svixId ||
        !signature.svixTimestamp ||
        !signature.svixSignature
      ) {
        throw new ConvexError("Error occured -- no svix headers");
      }

      // Clerk uses svix to sign webhooks
      // Create a new Svix instance with clerk webhook secret.
      const wh = new Webhook(clerkWebhookSecret);
      const event: WebhookEvent = wh.verify(body, {
        "svix-id": signature.svixId,
        "svix-timestamp": signature.svixTimestamp,
        "svix-signature": signature.svixSignature,
      }) as WebhookEvent;

      let handled: boolean;
      // Handle the event
      switch (event.type) {
        case "user.created": {
          const eventData = event.data as UserJSON;
          const email = eventData?.email_addresses[0]?.email_address;
          if (!email) {
            throw new ConvexError("Error occured -- no email");
          }
          const name =
            eventData.first_name && eventData.last_name
              ? `${eventData.first_name} ${eventData.last_name}`
              : undefined;
          const avatarUrl = eventData.image_url;

          // Create db user
          await ctx.runMutation(internal.users.systemSaveNewClerkUser, {
            clerkId: eventData.id,
            email,
            name,
            avatarUrl,
            roles: ["user"],
          });
          handled = true;
        }
        case "user.updated": {
          const eventData = event.data as UserJSON;
          const clerkUserId = eventData.id;
          const primaryEmailId = eventData.primary_email_address_id;
          const primaryEmail = eventData.email_addresses.find(
            (email) => email.id === primaryEmailId
          );
          const user = await ctx.runQuery(
            internal.users.systemFindByClerkUserId,
            {
              clerkUserId,
            }
          );
          if (!user) {
            throw new ConvexError("Could not find user by clerk id");
          }
          await ctx.runMutation(internal.users.systemUpdateUserProfile, {
            userId: user._id,
            email: primaryEmail?.email_address,
            name: `${eventData.first_name} ${eventData.last_name}`,
            avatarUrl: eventData.image_url,
          });
          if (primaryEmail) {
            await ctx.runAction(internal.userActions.addEmailToResendAudience, {
              email: primaryEmail?.email_address,
            });
          }
        }
        default: {
          handled = false;
        }
      }

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown";
      return { success: false, error: errorMessage };
    }
  },
});

export const addEmailToResendAudience = internalAction({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const addEmailResponse = await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: "a9e4688f-bfb8-4945-a519-1c80ccdb0fb1",
    });

    if (addEmailResponse.error) {
      throw new ConvexError(addEmailResponse.error.message);
    }

    return true;
  },
});

export const systemCreateAndSyncStripeCustomerToUser = internalAction({
  args: { userId: v.id("users"), email: v.string() },
  handler: async (ctx, { userId, email }) => {
    const stripeCustomer = await stripe.customers.create({
      email: email,
      metadata: {
        userId,
      },
    });

    await ctx.runMutation(internal.users.systemSetStripeCustomerId, {
      id: userId,
      stripeCustomerId: stripeCustomer.id,
    });

    return true;
  },
});
