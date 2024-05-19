import { Resend } from "resend";
import { internalAction } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { emailFromAddress } from "./lib/email";
import { buildOrderConfirmationEmailHTML } from "./lib/transactional";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendCompletedOrderEmailToAdmin = internalAction({
  args: { userEmail: v.string(), orderId: v.id("orders") },
  handler: async (ctx, { userEmail, orderId }) => {
    const sendEmailResponse = await resend.emails.send({
      from: emailFromAddress!,
      to: emailFromAddress!,
      subject: "A new order was submitted",
      text: `An order was submitted by ${userEmail}. OrderID: ${orderId}`,
    });

    if (sendEmailResponse.error) {
      throw new ConvexError(sendEmailResponse.error.message);
    }

    return true;
  },
});

export const sendOrderConfirmationEmailToUser = internalAction({
  args: { userEmail: v.string(), orderId: v.id("orders") },
  handler: async (ctx, { userEmail, orderId }) => {
    const sendEmailResponse = await resend.emails.send({
      from: emailFromAddress!,
      to: emailFromAddress!,
      subject: "We received your order!",
      html: buildOrderConfirmationEmailHTML({
        toEmail: userEmail,
        orderId,
      }),
    });

    if (sendEmailResponse.error) {
      throw new ConvexError(sendEmailResponse.error.message);
    }

    return true;
  },
});
