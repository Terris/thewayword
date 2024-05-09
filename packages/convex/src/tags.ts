import { v } from "convex/values";
import { query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const search = query({
  args: { queryTerm: v.string() },
  handler: async (ctx, { queryTerm }) => {
    await validateIdentity(ctx);
    return await ctx.db
      .query("tags")
      .withSearchIndex("search_name", (q) => q.search("name", queryTerm))
      .collect();
  },
});
