// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

import { corsHeaders } from "../_shared/cors.ts"

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// console.log('Function "upload-site-image" starting up (v6 - Client-side blurhash)...') // Removed log

interface RequestBody {
  filePath: string // Path in Storage bucket from client upload
  section: string
  altText?: string
  width?: number // Added: width from client
  height?: number // Added: height from client
  blurHash?: string // Added: blurHash from client
}

serve(async (req) => {
  const origin = req.headers.get("origin")
  const cors = corsHeaders(origin)

  // 1. Pré-vol CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors })
  }

  try {
    // Log Content-Type immediately
    const _contentTypeHeader = req.headers.get("Content-Type")
    // console.log(`Content-Type header received: ${contentTypeHeader}`) // Removed log

    // 1. Attempt to Parse Incoming JSON Body Directly
    let body: RequestBody
    let rawBodyForError = "<Body not read>"
    try {
      // console.log("Attempting req.json()...") // Removed log
      body = await req.json()
      // console.log("Successfully parsed JSON body:", body) // Removed log
    } catch (jsonError) {
      console.error("req.json() failed:", jsonError) // Keep console.error
      // If JSON parsing fails, TRY reading as text for debugging
      try {
        // console.log("Attempting req.text() as fallback...") // Removed log
        rawBodyForError = await req.text() // Use original req object
        // console.log(`Fallback req.text() content: [${rawBodyForError}]`) // Removed log
      } catch (textError) {
        console.error("Fallback req.text() also failed:", textError) // Keep console.error
        rawBodyForError = `<Failed to read body as text: ${textError.message}>`
      }
      // Throw the original JSON error but include the text attempt info
      throw new Error(
        `Invalid JSON body. Text fallback attempt: [${rawBodyForError}]. Parse error: ${jsonError.message}`
      )
    }

    // If we reach here, JSON parsing succeeded
    // Extract data including the new fields
    const { filePath, section, altText, width, height, blurHash } = body

    if (!filePath || !section) {
      // This check might be redundant if the interface matches, but good validation
      throw new Error("Missing required fields in parsed JSON body: filePath and section are required.")
    }

    // console.log( // Removed log
    //   `Processing parsed data - Path: ${filePath}, Section: ${section}, Alt: ${altText}, W: ${width}, H: ${height}, Hash: ${blurHash}`
    // )

    // 2. Create Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get("VITE_SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // 3. Get Public URL for the already uploaded file
    // console.log(`Getting public URL for path: ${filePath}`) // Removed log
    const { data: urlData } = supabaseAdmin.storage
      .from("assets") // <<< Your Bucket Name
      .getPublicUrl(filePath) // Use the path received from the client

    if (!urlData?.publicUrl) {
      console.error("Could not get public URL for path:", filePath)
      // Note: The file already exists in storage at this point.
      // Deciding whether to delete it here if URL fails is complex.
      throw new Error("Failed to get public URL for the uploaded image.")
    }
    const publicUrl = urlData.publicUrl
    // console.log("Public URL obtained:", publicUrl) // Removed log

    // ---- Image processing (size, width, height, blurhash) is now done on the client ----
    // We will get size from Storage directly if needed later, or assume client handles it.

    // 4. Upsert data into the 'site_images' table
    // console.log(`Checking existing entry for section: ${section}`) // Removed log
    const { data: existingEntry, error: selectError } = await supabaseAdmin
      .from("site_images")
      .select("id")
      .eq("section", section)
      .maybeSingle()

    if (selectError) {
      console.error("Select Error:", selectError) // Keep console.error
      throw new Error(`Database Select Error: ${selectError.message}`)
    }

    const imageDataToSave = {
      section: section,
      image_url: publicUrl,
      alt_text: altText || null, // Ensure null if empty string
      width: width ?? null, // Use client-provided width
      height: height ?? null, // Use client-provided height
      blur_hash: blurHash ?? null, // Use the potentially updated blurHash value
    }

    let dbError: Error | null = null
    if (existingEntry) {
      // Update existing entry
      // console.log(`Updating existing entry for section: ${section} (ID: ${existingEntry.id})`) // Removed log
      const { error: updateError } = await supabaseAdmin
        .from("site_images")
        .update({ ...imageDataToSave, updated_at: new Date().toISOString() })
        .eq("id", existingEntry.id)
      dbError = updateError as Error | null
      // TODO: Consider deleting the OLD file from storage IF the filePath changed
      // (Requires passing old path or querying DB for old URL first)
    } else {
      // Insert new entry
      // console.log(`Inserting new entry for section: ${section}`) // Removed log
      const dataToInsert = { ...imageDataToSave, created_at: new Date().toISOString() }
      const { error: insertError } = await supabaseAdmin.from("site_images").insert(dataToInsert)
      dbError = insertError as Error | null
    }

    if (dbError) {
      console.error("Database Upsert Error:", dbError) // Keep console.error
      const errorMessage = dbError instanceof Error ? dbError.message : "Unknown database error"
      // Note: File is already in storage. Consider if manual cleanup needed on DB error.
      throw new Error(`Database Upsert Error: ${errorMessage}`)
    }

    // console.log(`Database record upserted successfully for section: ${section}`) // Removed log

    // 5. Return success response (include the received/saved data)
    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        width: imageDataToSave.width,
        height: imageDataToSave.height,
        blurhash: imageDataToSave.blur_hash,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Function Error:", error) // Keep console.error
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: {
        ...cors,
        "Content-Type": "application/json",
      },
      status: 500, // Use 500 for internal server errors
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/upload-site-image' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"filePath": "public/your-image.jpg", "section": "test-section", "altText": "Test", "width": 800, "height": 600, "blurHash": "LKO2?U%2Tw=w]~RBVZRi};RPxuwH"}'

*/
