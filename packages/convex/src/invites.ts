import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { internal } from "./_generated/api";

export const findById = query({
  args: { id: v.id("invites") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const create = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    await validateIdentity(ctx, { requiredRoles: ["admin"] });

    const existingInvite = await ctx.db
      .query("invites")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingInvite) throw new ConvexError("Invite already exists");

    const inviteId = await ctx.db.insert("invites", { email });

    await ctx.db.insert("userWhitelist", { email });

    // send invite email
    await ctx.scheduler.runAfter(
      0,
      internal.inviteActions.sendInviteEmailToUser,
      {
        toEmail: email,
        inviteToken: inviteId,
      }
    );

    return inviteId;
  },
});