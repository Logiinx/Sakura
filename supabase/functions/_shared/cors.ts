// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow requests from any origin (adjust for production!)
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-upload-section, x-upload-alt-text", // Add your custom headers here
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE", // Add methods your function might use
}
