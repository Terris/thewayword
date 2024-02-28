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
    return { organization };
  },
});
