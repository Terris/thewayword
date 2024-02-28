import { ConvexError, v } from "convex/values";
import type { MutationCtx } from "./_generated/server";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { validateOrganizationOwnership } from "./lib/ownership";
import { internal } from "./_generated/api";

// SESSIONED USER FUNCTIONS
// ==================================================

/**
 * Get the organization for the current user.
 * Auth Requirements: Sessioned
 */
export const sessionedMeOrganization = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await validateIdentity(ctx);
    const orgUser = await ctx.db
      .query("organizationUsers")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();
    if (!orgUser) return null;
    const organization = await ctx.db.get(orgUser.organizationId);
    if (!organization) return null;
    const meIsOwner = organization.ownerId === user._id;
    const safeOrgProps = {
      _id: organization._id,
      name: organization.name,
      slug: organization.slug,
      ownerId: organization.ownerId,
    };
    return { ...safeOrgProps, meIsOwner };
  },
});

/**
 * Get the organization for the current user as org owner.
 * Auth Requirements: Sessioned, org ownership
 */

export const sessionedMeOrganizationAsOwner = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await validateIdentity(ctx);
    const orgUser = await ctx.db
      .query("organizationUsers")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();
    if (!orgUser)
      throw new ConvexError("No user organization found for sessioned user.");
    const organization = await ctx.db.get(orgUser.organizationId);
    if (!organization) throw new ConvexError("No organization found for user.");
    if (organization.ownerId !== user._id)
      throw new ConvexError("Unauthorized");
    return organization;
  },
});

/**
 * Get an organization by its id.
 * Auth Requirements: Sessioned
 * @param id - The organization id.
 */
export const sessionedFindByOwnerId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await validateIdentity(ctx);
    return ctx.db
      .query("organizations")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", userId))
      .first();
  },
});

/**
 * Create a new organization, set the current user as the owner, and schedule the creation of the stripe customer.
 * Auth Requirements: Sessioned
 * @param name - The name of the organization.
 */
export const sessionedCreate = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const { user } = await validateIdentity(ctx);

    // create a slug and make sure it is unique
    const uniqueSlug = await createUniqueSlug(ctx, name, 0);

    // create the organization
    const newOrganizationId = await ctx.db.insert("organizations", {
      name,
      slug: uniqueSlug,
      ownerId: user._id,
      spendCapInCents: 0,
    });

    // create the organization user
    await ctx.db.insert("organizationUsers", {
      organizationId: newOrganizationId,
      userId: user._id,
      onboardingComplete: false,
    });

    // schedule the creation of the stripe customer
    await ctx.scheduler.runAfter(
      0,
      internal.organizationActions.systemCreateOrganizationStripeCustomer,
      {
        organizationId: newOrganizationId,
      }
    );

    return newOrganizationId;
  },
});

// ORG OWNER FUNCTIONS
// ==================================================

/**
 * Update the organization.
 * Auth Requirements: Sessioned, Org Ownership
 * @param organizationId - The organization id.
 * @param spendCapInCents - The new spend cap in cents.
 */
export const sessionedUpdateAsOrgOwner = mutation({
  args: {
    organizationId: v.id("organizations"),
    spendCapInCents: v.optional(v.number()),
    stripePaymentMethodId: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { organizationId, spendCapInCents, stripePaymentMethodId }
  ) => {
    const { user } = await validateIdentity(ctx);
    await validateOrganizationOwnership({
      ctx,
      userId: user._id,
      organizationId,
    });
    return ctx.db.patch(organizationId, {
      spendCapInCents,
      stripePaymentMethodId,
    });
  },
});

// SYSTEM FUNCTIONS
// ==================================================

/**
 * Get the organization by its id.
 * @param id - The organization id.
 */
export const systemGetOrganizationById = internalQuery({
  args: { id: v.id("organizations") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

/**
 * Get the organization by stripe customer id.
 * @param stripeCustomerId - The stripe customer id.
 */
export const systemGetByStripeCustomerId = internalQuery({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, { stripeCustomerId }) => {
    return ctx.db
      .query("organizations")
      .withIndex("by_stripe_customer_id", (q) =>
        q.eq("stripeCustomerId", stripeCustomerId)
      )
      .first();
  },
});

/**
 * Update an organization by its id.
 * @param id - The organization id.
 */
export const systemUpdateById = internalMutation({
  args: {
    id: v.id("organizations"),
    stripeCustomerId: v.optional(v.string()),
    paymentMethodDetails: v.optional(
      v.object({
        type: v.optional(v.string()),
        brand: v.optional(v.string()),
        last4: v.optional(v.string()),
        expMonth: v.optional(v.number()),
        expYear: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, { id, stripeCustomerId, paymentMethodDetails }) => {
    const existingOrg = await ctx.db.get(id);
    return ctx.db.patch(id, {
      stripeCustomerId: stripeCustomerId ?? existingOrg?.stripeCustomerId,
      paymentMethodDetails:
        paymentMethodDetails ?? existingOrg?.paymentMethodDetails,
    });
  },
});

// PRIVATE HELPER FUNCTIONS
// ==================================================

/**
 * Create a unique slug for an organization.
 * Private helper function.
 * @param ctx - The mutation context.
 * @param name - The name of the organization.
 * @param existingCount - The existing count.
 * @returns The unique slug.
 */
const createUniqueSlug = async (
  ctx: MutationCtx,
  name: string,
  existingCount: number
): Promise<string> => {
  const slug = name.toLowerCase().replace(/\s/g, "-");
  const uniqueSlug = existingCount === 0 ? slug : `${slug}-${existingCount}`;

  const existingSlug = await ctx.db
    .query("organizations")
    .withIndex("by_slug", (q) => q.eq("slug", uniqueSlug))
    .first();

  if (existingSlug) {
    return createUniqueSlug(ctx, name, existingCount + 1);
  }
  return uniqueSlug;
};
