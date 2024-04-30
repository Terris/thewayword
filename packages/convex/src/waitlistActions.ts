import { Resend } from "resend";
import { internalAction } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { emailFromAddress } from "./lib/email";

const resend = new Resend(process.env.RESEND_APPI_KEY);

export const sendNewWatlistEntryEmailToAdmin = internalAction({
  args: { waitlistEmail: v.string() },
  handler: async (ctx, { waitlistEmail }) => {
    const sendEmailResponse = await resend.emails.send({
      from: emailFromAddress!,
      to: "terris@thewayword.com",
      subject: "New waitlist entry",
      text: `A new email has been added to the waitlist on The WayWord: ${waitlistEmail}`,
    });

    if (sendEmailResponse.error) {
      throw new ConvexError(sendEmailResponse.error.message);
    }

    return true;
  },
});
