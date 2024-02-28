import { v } from "convex/values";
import { query } from "../../../_generated/server";
import { validateIdentity } from "../../../lib/authorization";
import { validateOrganizationByOrgSlugOwnership } from "../../../lib/ownership";

export const pageQuery = query({
  args: { organizationSlug: v.string() },
  handler: async (ctx, { organizationSlug }) => {
    const { user } = await validateIdentity(ctx);
    const { organization } = await validateOrganizationByOrgSlugOwnership({
      ctx,
      userId: user._id,
      organizationSlug,
    });

    const organizationInvites = await ctx.db
      .query("organizationInvites")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organization._id)
      )
      .collect();

    return { organizationInvites };
  },
});
