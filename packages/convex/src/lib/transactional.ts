/* eslint no-irregular-whitespace: off  -- email templates are cray cray */

interface BuildOrderConfirmationEmailProps {
  toEmail: string;
  orderId: string;
}

export function buildOrderConfirmationEmailHTML({
  toEmail,
  orderId,
}: BuildOrderConfirmationEmailProps) {
  const emaiContent = `
  <h1 class="" style="color:rgb(0,0,0);font-size:24px;font-weight:400;text-align:center;padding:0px;margin-top:30px;margin-bottom:30px;margin-left:0px;margin-right:0px">
    Thanks for your order!
  </h1>
  <p style="font-size:16px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
    Hello <!-- -->${toEmail}<!-- -->,
  </p>
  <p style="font-size:16px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
    We wanted to let you know that we've received your order and are working to fulfill it now.
    We'll send you another email with tracking information once your order has shipped.
  </p>
  <p style="font-size:16px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
    You can view the status of your order at any time:
    <a href="https://thewayword.com/me/orders/${orderId}" style="color:rgb(37,99,235);text-decoration:none;text-decoration-line:none" target="_blank">
      View My Order
    </a>
  </p>
  <p style="font-size:16px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
    If you have any questions about your order, you can contact the founder Terris directly at
    <a href="mailto:terris@thewayword.com" style="color:rgb(37,99,235);text-decoration:none;text-decoration-line:none" target="_blank">
      terris@thewayword.com
    </a>
  </p>
`;
  return wrapEmailContentWithTemplate(emaiContent);
}

interface BuildInviteEmailProps {
  toEmail: string;
  inviteLink: string;
}
export function buildInviteEmailHTML({
  toEmail,
  inviteLink,
}: BuildInviteEmailProps) {
  const emaiContent = `
    <h1 class="" style="color:rgb(0,0,0);font-size:24px;font-weight:400;text-align:center;padding:0px;margin-top:30px;margin-bottom:30px;margin-left:0px;margin-right:0px">
      Join us on The Wayword!
    </h1>
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
      Hello <!-- -->${toEmail}<!-- -->,
    </p>
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
      Terris Kremer has invited you to the join us on The Wayword, the adventure logging app.
    </p>
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
      Click the link below to create your account or copy and paste this URL into your browser:<!-- -->
      <a href="${inviteLink}" style="color:rgb(37,99,235);text-decoration:none;text-decoration-line:none" target="_blank">
        ${inviteLink}
      </a>
    </p>
`;
  return wrapEmailContentWithTemplate(emaiContent);
}

const wrapEmailContentWithTemplate = (content: string) => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta content="width=device-width" name="viewport" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
    <meta content="light" name="color-scheme" />
    <meta content="light dark" name="supported-color-schemes" />
</head>

<body style="font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:1.0769230769230769em;min-height:100%;line-height:155%">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="align:center;padding-left:0px;padding-right:0px;h-padding:0px;width:auto;max-width:600px;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif">
        <tbody>
            <tr>
                <td>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                        <tbody style="width:100%">
                            <tr style="width:100%">
                                <td align="center" data-id="__react-email-column"><img class="" height="215" src="https://resend-attachments.s3.amazonaws.com//hL8VayvdD4szul8" style="display:block;outline:none;border:none;text-decoration:none;max-width:100%;border-radius:8px" width="314" /></td>
                            </tr>
                        </tbody>
                    </table>
                    ${content}
                    <p class="" style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em;text-align:left"></p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
  `;
};
