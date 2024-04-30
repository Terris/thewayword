import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const create = mutation({
  args: { message: v.string() },
  handler: async (ctx, { message }) => {
    const { user } = await validateIdentity(ctx);
    return ctx.db.insert("feedback", { userId: user._id, message });
  },
});
