import { Resend } from "resend";
import { internalAction } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { emailFromAddress } from "./lib/email";
import { buildOrganizationInviteEmailHTML } from "./lib/transactional";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInviteEmailToUser = internalAction({
  args: { toEmail: v.string(), inviteToken: v.id("invites") },
  handler: async (ctx, { toEmail, inviteToken }) => {
    const inviteEmailResponse = await resend.emails.send({
      from: emailFromAddress!,
      to: toEmail,
      subject: "Invite from Terris at The Wayword",
      html: buildOrganizationInviteEmailHTML({
        inviteLink: `${process.env.CLIENT_APP_URL}/signup?inviteToken=${inviteToken}`,
        toEmail,
      }),
    });

    if (inviteEmailResponse.error) {
      throw new ConvexError(inviteEmailResponse.error.message);
    }

    return true;
  },
});
