
type RegistrationEmailData = {
  studentEmail: string;
  referenceNumber: string;
  registeredAt: Date | string;
  appUrl: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function createRegistrationEmail(
  data: RegistrationEmailData
) {
  const appUrl = data.appUrl.replace(/\/+$/, "");
  const logoUrl = `${appUrl}/nu-logo.png`;

  const formattedDate = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(data.registeredAt));

  const email = escapeHtml(data.studentEmail);
  const reference = escapeHtml(data.referenceNumber);
  const date = escapeHtml(formattedDate);

  return {
    subject: "Your NU MOA Student Registration Confirmation",

    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:30px 12px;background:#F4F6FA;font-family:Arial,sans-serif;color:#26344A;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;">

                <tr>
                  <td align="center" style="padding:35px 25px 25px;">
                    <img src="${logoUrl}" alt="National University Logo"
                      width="100" style="display:block;width:100px;height:auto;margin-bottom:15px;">

                    <h2 style="margin:0;color:#142B50;font-size:23px;letter-spacing:2px;">
                      NATIONAL UNIVERSITY
                    </h2>

                    <p style="margin:7px 0 0;color:#9A7B2F;font-size:12px;letter-spacing:3px;">
                      MALL OF ASIA
                    </p>

                    <div style="margin-top:22px;background:#EAF5EE;color:#267344;
                      padding:9px 18px;border-radius:20px;display:inline-block;
                      font-size:12px;font-weight:bold;">
                      REGISTRATION RECEIVED
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="height:4px;background:#D8B85A;"></td>
                </tr>

                <tr>
                  <td style="padding:35px 30px;text-align:center;">
                    <h1 style="margin:0;color:#142B50;font-size:32px;">
                      Thank You!
                    </h1>

                    <p style="font-size:16px;line-height:1.7;color:#52617B;">
                      Your student registration has been successfully received.
                      Welcome to the NU MOA Student Election Portal!
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 30px 30px;">
                    <h3 style="color:#142B50;font-size:15px;">
                      REGISTRATION DETAILS
                    </h3>

                    <table role="presentation" width="100%" cellpadding="12"
                      cellspacing="0" style="background:#F4F6FA;border-radius:9px;">

                      <tr>
                        <td style="color:#64748B;font-size:13px;">Student Email</td>
                        <td align="right" style="font-size:13px;font-weight:bold;">
                          ${email}
                        </td>
                      </tr>

                      <tr>
                        <td style="color:#64748B;font-size:13px;">Reference No.</td>
                        <td align="right" style="font-size:13px;font-weight:bold;">
                          ${reference}
                        </td>
                      </tr>

                      <tr>
                        <td style="color:#64748B;font-size:13px;">Date Registered</td>
                        <td align="right" style="font-size:13px;font-weight:bold;">
                          ${date}
                        </td>
                      </tr>

                      <tr>
                        <td style="color:#64748B;font-size:13px;">Status</td>
                        <td align="right" style="color:#267344;font-size:13px;font-weight:bold;">
                          Received
                        </td>
                      </tr>

                    </table>

                    <p style="font-size:12px;line-height:1.6;color:#64748B;margin-top:15px;">
                      Please note that receiving this registration confirmation
                      does not mean your student identity has already been verified.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:30px;background:#142B50;">
                    <h2 style="margin:0;color:#ffffff;font-size:21px;">
                      Stay Updated!
                    </h2>

                    <p style="color:#E2E8F0;font-size:13px;line-height:1.6;">
                      Follow the official CSE Facebook page for announcements
                      and updates about the upcoming student elections.
                    </p>

                    <a href="https://www.facebook.com/numoacse"
                      style="display:inline-block;background:#D8B85A;color:#142B50;
                      padding:12px 22px;border-radius:7px;text-decoration:none;
                      font-size:13px;font-weight:bold;">
                      VISIT CSE FACEBOOK PAGE
                    </a>

                    <p style="margin:28px 0 0;color:#D8B85A;font-weight:bold;
                      letter-spacing:2px;font-size:13px;">
                      BUMOTO NG TAMA. BUMOTO NANG TAMA.
                    </p>

                    <p style="margin:12px 0 0;color:#CBD5E1;font-size:11px;">
                      NU MOA STUDENT ELECTIONS
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `,
  };
}

