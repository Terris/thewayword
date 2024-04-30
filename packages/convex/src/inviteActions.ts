import { Resend } from "resend";
import { internalAction } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { emailFromAddress } from "./lib/email";
import { buildOrganizationInviteEmailHTML } from "./lib/transactional";

const resend = new Resend(process.env.RESEND_APPI_KEY);

export const sendInviteEmailToUser = internalAction({
  args: { toEmail: v.string(), inviteToken: v.id("invites") },
  handler: async (ctx, { toEmail, inviteToken }) => {
    const inviteEmailResponse = await sendInviteEmail({
      toEmail,
      inviteToken,
    });

    if (inviteEmailResponse.error) {
      throw new ConvexError(inviteEmailResponse.error.message);
    }

    return true;
  },
});

// Private function
async function sendInviteEmail({
  toEmail,
  inviteToken,
}: {
  toEmail: string;
  inviteToken: string;
}) {
  return await resend.emails.send({
    from: emailFromAddress!,
    to: toEmail,
    subject: "Invite from Terris at The WayWord",
    html: buildOrganizationInviteEmailHTML({
      inviteLink: `https://thewayword.com/signup?inviteToken=${inviteToken}`,
      toEmail,
    }),
  });
}
