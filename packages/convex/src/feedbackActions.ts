import { Resend } from "resend";
import { internalAction } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { emailFromAddress } from "./lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendNewFeedbackEmailToAdmin = internalAction({
  args: { userEmail: v.string(), message: v.string() },
  handler: async (ctx, { userEmail, message }) => {
    const sendEmailResponse = await resend.emails.send({
      from: emailFromAddress!,
      to: emailFromAddress!,
      subject: "New feedback entry",
      text: `Feedback has been submitted to the waitlist on The Wayword by ${userEmail}: ${message}`,
    });

    if (sendEmailResponse.error) {
      throw new ConvexError(sendEmailResponse.error.message);
    }

    return true;
  },
});
