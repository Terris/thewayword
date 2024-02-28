import { Resend } from "resend";
import { ConvexError, v } from "convex/values";
import { internalAction } from "./_generated/server";
import { buildOrganizationInviteEmailHTML } from "./lib/transactional";

const resend = new Resend(process.env.RESEND_API_KEY);

// SYSTEM FUNCTIONS
// ==================================================

/**
 * Send an organization invite email to a user.
 * @param toEmail - The email of the user.
 * @param orgName - The name of the organization.
 * @param inviteToken - The invite token.
 */
export const systemSendOrgInviteEmailToUser = internalAction({
  args: {
    toEmail: v.string(),
    orgName: v.string(),
    inviteToken: v.id("organizationInvites"),
  },
  handler: async (ctx, { toEmail, orgName, inviteToken }) => {
    const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL}/rsvp/${inviteToken}`;
    const inviteEmailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "terris@bittybrella.com",
      to: toEmail,
      subject: `Join ${orgName} on BittyBrella`,
      html: buildOrganizationInviteEmailHTML({ toEmail, orgName, inviteLink }),
    });

    if (inviteEmailResponse.error) {
      throw new ConvexError(inviteEmailResponse.error.message);
    }

    return true;
  },
});
