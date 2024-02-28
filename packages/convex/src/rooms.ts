import { ConvexError, v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

// SESSIONED USERS ONLY
export const sessionedFindAll = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx);
    return ctx.db.query("rooms").collect();
  },
});

export const sessionedFindById = query({
  args: { id: v.id("rooms") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    return ctx.db.get(id);
  },
});

export const sessionedCreate = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    await validateIdentity(ctx);
    return ctx.db.insert("rooms", {
      name,
    });
  },
});

export const sessionedDeleteById = mutation({
  args: { id: v.id("rooms") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);

    const existingRoom = await ctx.db.get(id);
    if (!existingRoom) throw new ConvexError("Room not found");

    const roomUsersToDelete = await ctx.db
      .query("roomUsers")
      .withIndex("by_room_id", (q) => q.eq("roomId", id))
      .collect();

    await asyncMap(roomUsersToDelete, async (roomUser) =>
      ctx.db.delete(roomUser._id)
    );

    return ctx.db.delete(id);
  },
});
