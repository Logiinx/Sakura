import { createClient } from "@supabase/supabase-js"

// Log Supabase configuration (without exposing sensitive data)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
  })
}

export const supabase = createClient(supabaseUrl!, supabaseKey!)
