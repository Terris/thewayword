import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/webhooks/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = {
      svixId: request.headers.get("svix-id"),
      svixTimestamp: request.headers.get("svix-timestamp"),
      svixSignature: request.headers.get("svix-signature"),
    };

    const result = await ctx.runAction(
      internal.userActions.internalHandleClerkWebhook,
      {
        signature,
        requestString: await request.text(),
      }
    );

    if (result.success) {
      return new Response(null, {
        status: 200,
      });
    }
    return new Response("Webhook Error", {
      status: 400,
    });
  }),
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
