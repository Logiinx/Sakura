import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

import { getCorsHeaders } from "../_shared/cors.ts"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Sanitizes text input to prevent injection attacks
 */
function sanitizeText(text: string): string {
  return text
    .replace(/[<>"'&]/g, (char) => {
      switch (char) {
        case "<":
          return "&lt;"
        case ">":
          return "&gt;"
        case '"':
          return "&quot;"
        case "'":
          return "&#x27;"
        case "&":
          return "&amp;"
        default:
          return char
      }
    })
    .trim()
}

/**
 * Validates contact form data
 */
function validateContactForm(data: unknown): { isValid: boolean; error?: string; sanitizedData?: ContactFormData } {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Invalid request body" }
  }

  const { name, email, subject, message } = data as Record<string, unknown>

  // Validate required fields
  if (!name || typeof name !== "string") {
    return { isValid: false, error: "Name is required and must be a string" }
  }

  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email is required and must be a string" }
  }

  if (!subject || typeof subject !== "string") {
    return { isValid: false, error: "Subject is required and must be a string" }
  }

  if (!message || typeof message !== "string") {
    return { isValid: false, error: "Message is required and must be a string" }
  }

  // Validate field lengths
  if (name.length > 100) {
    return { isValid: false, error: "Name must be 100 characters or less" }
  }

  if (email.length > 254) {
    return { isValid: false, error: "Email must be 254 characters or less" }
  }

  if (subject.length > 200) {
    return { isValid: false, error: "Subject must be 200 characters or less" }
  }

  if (message.length > 5000) {
    return { isValid: false, error: "Message must be 5000 characters or less" }
  }

  if (message.length < 10) {
    return { isValid: false, error: "Message must be at least 10 characters long" }
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return { isValid: false, error: "Invalid email format" }
  }

  // Check for suspicious patterns that might indicate injection attempts
  const suspiciousPatterns = [/bcc:/i, /cc:/i, /to:/i, /from:/i, /content-type:/i, /mime-version:/i, /\r\n/, /\n/, /\r/]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(name) || pattern.test(email) || pattern.test(subject) || pattern.test(message)) {
      return { isValid: false, error: "Invalid characters detected in input" }
    }
  }

  // Return sanitized data
  return {
    isValid: true,
    sanitizedData: {
      name: sanitizeText(name),
      email: email.toLowerCase().trim(),
      subject: sanitizeText(subject),
      message: sanitizeText(message),
    },
  }
}

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

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5
const requestCounts = new Map<string, { count: number; resetTime: number }>()

/**
 * Simple rate limiter based on IP address
 */
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true }
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true }
}

/**
 * Validates environment variables
 */
function validateEnvironment(): { isValid: boolean; error?: string } {
  const apiKey = Deno.env.get("RESEND_API_KEY")

  if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
    return { isValid: false, error: "RESEND_API_KEY environment variable is required" }
  }

  if (!apiKey.startsWith("re_")) {
    return { isValid: false, error: "Invalid RESEND_API_KEY format" }
  }

  return { isValid: true }
}

serve(async (req) => {
  const origin = req.headers.get("origin")
  const cors = getCorsHeaders(origin)

  // 1. CORS pre-flight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: cors,
    })
  }

  // 2. Method validation
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }

  // 3. Content-Type validation
  const contentType = req.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }

  // 4. Rate limiting
  const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
  const rateLimitResult = checkRateLimit(clientIP)

  if (!rateLimitResult.allowed) {
    const resetTime = rateLimitResult.resetTime || Date.now()
    const waitTime = Math.ceil((resetTime - Date.now()) / 1000)

    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        retryAfter: waitTime,
      }),
      {
        status: 429,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Retry-After": waitTime.toString(),
        },
      }
    )
  }

  // 5. Environment validation
  const envValidation = validateEnvironment()
  if (!envValidation.isValid) {
    console.error("Environment validation failed:", envValidation.error)
    return new Response(JSON.stringify({ error: "Service configuration error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }

  let rawData: unknown
  try {
    rawData = await req.json()
  } catch (error) {
    console.error("JSON parsing failed:", error instanceof Error ? error.message : "Unknown error")
    return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }

  // Validate and sanitize input
  const validation = validateContactForm(rawData)
  if (!validation.isValid || !validation.sanitizedData) {
    console.error("Form validation failed:", validation.error)
    return new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }

  const { name, email, subject, message } = validation.sanitizedData

  const apiKey = Deno.env.get("RESEND_API_KEY")!

  try {
    const emailPayload = {
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
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    })

    if (!response.ok) {
      // Log detailed error for debugging but don't expose to client
      const errorText = await response.text().catch(() => "Unable to read error response")
      console.error("Resend API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        timestamp: new Date().toISOString(),
        clientIP: clientIP,
      })

      // Return generic error to prevent information disclosure
      return new Response(JSON.stringify({ error: "Failed to send email. Please try again later." }), {
        headers: {
          ...cors,
          "Content-Type": "application/json",
        },
        status: 500,
      })
    }

    const result = await response.json()
    console.log("Email sent successfully:", {
      id: result.id,
      timestamp: new Date().toISOString(),
      from: email,
      subject: subject,
    })

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
      headers: {
        ...cors,
        "Content-Type": "application/json",
      },
      status: 200,
    })
  } catch (error) {
    // Log detailed error for debugging
    console.error("Email sending failed:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      clientIP: clientIP,
    })

    // Return generic error to prevent information disclosure
    return new Response(JSON.stringify({ error: "Failed to send email. Please try again later." }), {
      headers: {
        ...cors,
        "Content-Type": "application/json",
      },
      status: 500,
    })
  }
})
