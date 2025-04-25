// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
// Import ImageMagick for WASM image processing
import { ImageMagick, initializeImageMagick, MagickFormat } from "https://deno.land/x/imagemagick_deno@0.0.14/mod.ts"
// Blurhash calculation is removed for now due to WASM/environment limitations
// import { encode as encodeBlurhash } from "https://deno.land/x/blurhash@v1.0/mod.ts";

// Initialize ImageMagick WASM Module (do this outside the handler)
// Use a flag to ensure it only runs once
let imagemagickInitialized = false
const initializeIM = async () => {
  if (!imagemagickInitialized) {
    console.log("Initializing ImageMagick...")
    try {
      await initializeImageMagick()
      imagemagickInitialized = true
      console.log("ImageMagick initialized successfully.")
    } catch (initError) {
      console.error("Failed to initialize ImageMagick:", initError)
      // If initialization fails, the function might not work correctly later
      // Consider how to handle this - maybe throw to prevent function execution?
    }
  }
}
// Call initialization immediately when the function loads
initializeIM()

console.log('Function "upload-site-image" starting up (v5 - ImageMagick for dims/size, no blurhash)...')

interface RequestBody {
  filePath: string // Path in Storage bucket from client upload
  section: string
  altText?: string
  contentType?: string // Optional, might still be useful
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Log Content-Type immediately
    const contentTypeHeader = req.headers.get("Content-Type")
    console.log(`Content-Type header received: ${contentTypeHeader}`)

    // 1. Attempt to Parse Incoming JSON Body Directly
    let body: RequestBody
    let rawBodyForError = "<Body not read>"
    try {
      console.log("Attempting req.json()...")
      body = await req.json()
      console.log("Successfully parsed JSON body:", body)
    } catch (jsonError) {
      console.error("req.json() failed:", jsonError)
      // If JSON parsing fails, TRY reading as text for debugging
      try {
        console.log("Attempting req.text() as fallback...")
        rawBodyForError = await req.text() // Use original req object
        console.log(`Fallback req.text() content: [${rawBodyForError}]`)
      } catch (textError) {
        console.error("Fallback req.text() also failed:", textError)
        rawBodyForError = `<Failed to read body as text: ${textError.message}>`
      }
      // Throw the original JSON error but include the text attempt info
      throw new Error(
        `Invalid JSON body. Text fallback attempt: [${rawBodyForError}]. Parse error: ${jsonError.message}`
      )
    }

    // If we reach here, JSON parsing succeeded
    const { filePath, section, altText } = body

    if (!filePath || !section) {
      // This check might be redundant if the interface matches, but good validation
      throw new Error("Missing required fields in parsed JSON body: filePath and section are required.")
    }

    console.log(`Processing parsed data - Path: ${filePath}, Section: ${section}, Alt: ${altText}`)

    // 2. Create Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get("VITE_SUPABASE_URL") ?? "",
      Deno.env.get("VITE_SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // 3. Get Public URL for the already uploaded file
    console.log(`Getting public URL for path: ${filePath}`)
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
    console.log("Public URL obtained:", publicUrl)

    // ---- Start Image Processing (Dimensions and Size only) ----
    let imageWidth: number | null = null
    let imageHeight: number | null = null
    let imageSize: number | null = null // Store size in bytes
    const blurHash: string | null = null // Blurhash is skipped for now

    if (!imagemagickInitialized) {
      console.error("ImageMagick not initialized, skipping image processing.")
      // Proceed without width/height if IM failed to init
    } else {
      try {
        console.log(`Attempting to fetch image from URL: ${publicUrl}`)
        const imageResponse = await fetch(publicUrl)
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image from URL (${imageResponse.status}): ${publicUrl}`)
        }
        const imageArrayBuffer = await imageResponse.arrayBuffer()
        const imageUint8Array = new Uint8Array(imageArrayBuffer)
        imageSize = imageUint8Array.byteLength // Get size in bytes
        console.log(`Image fetched successfully. Size: ${imageSize} bytes`)

        // Use ImageMagick to read the image and get dimensions
        console.log("Processing image with ImageMagick to get dimensions...")
        await new Promise<void>((resolve, reject) => {
          ImageMagick.read(imageUint8Array, (img) => {
            try {
              imageWidth = img.width
              imageHeight = img.height
              console.log(`ImageMagick read success. Dimensions: ${imageWidth}x${imageHeight}`)
              // We don't need to write the image back out, just read dimensions
              resolve()
            } catch (readError) {
              console.error("ImageMagick.read callback error:", readError)
              reject(readError)
            }
          })
        })
      } catch (processingError) {
        console.error("Image processing (dimensions/size) failed:", processingError)
        // Log the error but don't block the database update.
        // Width/height/size will remain null.
        imageWidth = null // Ensure they are null on error
        imageHeight = null
        imageSize = null
      }
    }
    // ---- End Image Processing ----

    // 4. Upsert data into the 'site_images' table
    console.log(`Checking existing entry for section: ${section}`)
    const { data: existingEntry, error: selectError } = await supabaseAdmin
      .from("site_images")
      .select("id")
      .eq("section", section)
      .maybeSingle()

    if (selectError) {
      console.error("Select Error:", selectError)
      throw new Error(`Database Select Error: ${selectError.message}`)
    }

    const imageDataToSave = {
      section: section,
      image_url: publicUrl,
      alt_text: altText || null, // Ensure null if empty string
      width: imageWidth,
      height: imageHeight,
      size: imageSize ? imageSize.toString() : null, // Store size as string or keep null
      blur_hash: blurHash, // Always null for now
    }

    let dbError: Error | null = null
    if (existingEntry) {
      // Update existing entry
      console.log(`Updating existing entry for section: ${section} (ID: ${existingEntry.id})`)
      const { error: updateError } = await supabaseAdmin
        .from("site_images")
        .update({ ...imageDataToSave, updated_at: new Date().toISOString() })
        .eq("id", existingEntry.id)
      dbError = updateError as Error | null
      // TODO: Consider deleting the OLD file from storage IF the filePath changed
      // (Requires passing old path or querying DB for old URL first)
    } else {
      // Insert new entry
      console.log(`Inserting new entry for section: ${section}`)
      const dataToInsert = { ...imageDataToSave, created_at: new Date().toISOString() }
      const { error: insertError } = await supabaseAdmin.from("site_images").insert(dataToInsert)
      dbError = insertError as Error | null
    }

    if (dbError) {
      console.error("Database Upsert Error:", dbError)
      const errorMessage = dbError instanceof Error ? dbError.message : "Unknown database error"
      // Note: File is already in storage. Consider if manual cleanup needed on DB error.
      throw new Error(`Database Upsert Error: ${errorMessage}`)
    }

    console.log(`Database record upserted successfully for section: ${section}`)

    // 5. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        width: imageWidth,
        height: imageHeight,
        size: imageSize,
        blurhash: blurHash,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Function Error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    --data '{"name":"Functions"}'

*/
