import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx, ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";

/**
 * Validate the identity of the current user via query/mutation context.
 * @param ctx - The query/mutation context.
 * @param options - The options for the validation.
 * @param options.requiredRoles - The required roles for the user. True if user has all roles.
 */
export async function validateIdentity(
  ctx: MutationCtx | QueryCtx,
  options?: { requiredRoles?: string[] }
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();
  const isAuthorizedUser = user && user.roles?.includes("user");
  if (!isAuthorizedUser) {
    throw new ConvexError("Unauthorized");
  }

  if (
    options?.requiredRoles &&
    user.roles &&
    options.requiredRoles.every((role) => user.roles?.includes(role))
  ) {
    throw new ConvexError("Unauthorized user role");
  }

  return { identity, user };
}

export async function validateActionIdentity(
  ctx: ActionCtx,
  options?: { requiredRoles?: string[] }
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthenticated");
  }

  const user = await ctx.runQuery(internal.users.systemFindByTokenIdentifier, {
    tokenIdentifier: identity.tokenIdentifier,
  });

  const isAuthorizedUser = user && user.roles?.includes("user");
  if (!isAuthorizedUser) {
    throw new ConvexError("Unauthorized");
  }

  if (
    options?.requiredRoles &&
    user.roles &&
    options.requiredRoles.every((role) => user.roles?.includes(role))
  ) {
    throw new ConvexError("Unauthorized user role");
  }

  return { identity, user };
}
