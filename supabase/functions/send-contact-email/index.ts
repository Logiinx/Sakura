import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

export function generateSakuraEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Form Submission</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; }
    .container { background: linear-gradient(180deg, #FFF5F7 0%, #FFE4E6 100%); }
    .content { background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #FECDD3; }
    .header { border-bottom: 2px solid #FECDD3; padding-bottom: 10px; margin-bottom: 20px; }
    .header h1 { font-size: 28px; font-weight: 700; color: #831843; margin: 0; }
    .info-table td { padding: 12px; font-size: 16px; }
    .info-table .label { color: #831843; font-weight: 600; width: 100px; }
    .info-table .value { color: #4B1C2D; }
    .email-link { color: #DB2777; text-decoration: none; }
    .email-link:hover { text-decoration: underline; }
    .footer { font-size: 12px; color: #9D174D; margin-top: 20px; }
    .sakura-accent {
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23FECDD3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 10c3.31 0 6 2.69 6 6v2H6v-2c0-3.31 2.69-6 6-6z"/></svg>') no-repeat center;
      background-size: 20px;
      height: 20px;
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 20px !important; background-color: #FFF5F7;">
  <table width="100%" class="container">
    <tr>
      <td align="center" style="padding: 30px 0;">
        <table cellpadding="25" width="600" style="max-width: 600px;" class="content">
          <tr>
            <td align="center">
              <div class="header">
                <h1>New Contact Form Submission</h1>
              </div>
              <p style="font-size: 16px; line-height: 1.6; color: #4B1C2D; margin-bottom: 20px; text-align: left;">
                You have received a new message from your website's contact form. Here are the details:
              </p>
              <table width="100%" class="info-table">
                <tr>
                  <td class="label">Name:</td>
                  <td class="value">${name}</td>
                </tr>
                <tr>
                  <td class="label">Email:</td>
                  <td class="value">
                    <a href="mailto:${email}" class="email-link">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td class="label">Subject:</td>
                  <td class="value">${subject}</td>
                </tr>
                <tr>
                  <td class="label">Message:</td>
                  <td class="value">${message.replace(/\n/g, "<br />")}</td>
                </tr>
              </table>
              <div class="footer">
                <p>This email was sent from the contact form on your website.</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px 0;">
        <div class="sakura-accent"></div>
      </td>
    </tr>
  </table>
</body>
</html>`
}

serve(async (req) => {
  const { name, email, subject, message } = await req.json()

  const apiKey = Deno.env.get("RESEND_API_KEY")
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    // TODO VERIFY DOMAIN MOMBPHOTOGRAPHIE.FR ON RESEND THEN TRY IF EDGEFUNCTION WORKS
    body: JSON.stringify({
      from: "MOM.B Photographie <contact@mombphotographie.fr>",
      to: "mombphotographie@gmail.com",
      reply_to: email,
      subject: `🌸 Nouveau message de ${name} – ${subject}`,
      html: generateSakuraEmail({
        name: name,
        email: email,
        subject: subject,
        message: message,
      }),
    }),
  })

  let data
  try {
    data = await response.json()
  } catch (error) {
    data = { error: "Failed to parse response JSON", details: error instanceof Error ? error.message : String(error) }
  }
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    status: response.status,
  })
})
