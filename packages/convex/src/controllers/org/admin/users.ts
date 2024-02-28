import { ConvexError, v } from "convex/values";
import { query } from "../../../_generated/server";
import { validateIdentity } from "../../../lib/authorization";
import { asyncMap } from "convex-helpers";
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

    const organizationUsers = await ctx.db
      .query("organizationUsers")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organization._id)
      )
      .collect();

    const organizationUsersWithUsers = await asyncMap(
      organizationUsers,
      async (orgUser) => {
        const user = await ctx.db.get(orgUser.userId);
        if (!user) throw new ConvexError("User from org user not found.");
        return {
          ...orgUser,
          user,
        };
      }
    );

    return {
      organization,
      organizationUsers: organizationUsersWithUsers,
    };
  },
});
