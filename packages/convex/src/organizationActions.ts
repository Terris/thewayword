"use node";

import Stripe from "stripe";
import { v, ConvexError } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { validateActionIdentity } from "./lib/authorization";
import { stripe } from "./lib/stripe";
import { validateActionOrganizationOwnership } from "./lib/ownership";

// SESSIONED ACTION FUNCTIONS
// ==================================================

export const sessionedOrganizationCreateSetupIntentAsOrgOwner = action({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const { user } = await validateActionIdentity(ctx);
    const { organization } = await validateActionOrganizationOwnership({
      ctx,
      userId: user._id,
      organizationId,
    });

    if (!organization.stripeCustomerId) {
      throw new ConvexError("Organization does not have a Stripe customer");
    }

    const setupIntent: Stripe.SetupIntent = await stripe.setupIntents.create({
      customer: organization.stripeCustomerId,
      metadata: {
        organizationId: organizationId,
      },
      usage: "off_session",
    });

    return setupIntent;
  },
});

// SYSTEM ACTION FUNCTIONS
// ==================================================

/**
 * Create a Stripe customer for an organization.
 * @param organizationId - The ID of the organization.
 */
export const systemCreateOrganizationStripeCustomer = internalAction({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const organization = await ctx.runQuery(
      internal.organizations.systemGetOrganizationById,
      { id: organizationId }
    );
    if (!organization) throw new ConvexError("Organization not found");

    const organizationOwnerUser = await ctx.runQuery(
      internal.users.systemFindById,
      {
        id: organization.ownerId,
      }
    );
    if (!organizationOwnerUser)
      throw new ConvexError("Organization owner not found");

    const stripeCustomer = await stripe.customers.create({
      name: organization.name,
      email: organizationOwnerUser.email,
      metadata: {
        type: "organization",
        organizationId: organizationId,
      },
    });

    await ctx.runMutation(internal.organizations.systemUpdateById, {
      id: organizationId,
      stripeCustomerId: stripeCustomer.id,
    });
  },
});
