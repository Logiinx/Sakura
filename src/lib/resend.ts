import { Resend } from "resend"

const resendKey = import.meta.env.VITE_RESEND_API_KEY

if (!resendKey) {
  console.error("Missing Resend API key")
}

export const resend = new Resend(resendKey!)
