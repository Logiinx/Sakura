// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

import { getCorsHeaders } from "../_shared/cors.ts"

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
  fileSize?: number // Added: file size for validation
}

// Security: Define allowed file types and size limits
const ALLOWED_FILE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB (reduced from 10MB for better performance)

// TODO KEEP SYNC WITH ADMINPANEL.TSX
const ALLOWED_SECTIONS = [
  "hero",
  "grossesse-1",
  "grossesse-2",
  "grossesse-3",
  "famille-1",
  "famille-2",
  "famille-3",
  "bebe-1",
  "bebe-2",
  "bebe-3",
  "complices-1",
  "complices-2",
  "complices-3",
  "grossesse-0",
  "famille-0",
  "bebe-0",
  "complices-0",
  "aproposdemoi",
]

/**
 * Validates file path to prevent path traversal attacks
 */
function validateFilePath(filePath: string): boolean {
  // Check for path traversal attempts
  if (filePath.includes("..") || filePath.includes("//") || filePath.startsWith("/")) {
    return false
  }

  // Ensure path follows expected pattern: section/filename
  const pathParts = filePath.split("/")
  if (pathParts.length !== 2) {
    return false
  }

  const [section, filename] = pathParts

  // Validate section
  if (!ALLOWED_SECTIONS.includes(section)) {
    return false
  }

  // Validate filename (alphanumeric, hyphens, underscores, dots only)
  const allowedExtensionsPattern = ALLOWED_FILE_EXTENSIONS.join("|")
  const filenameRegex = new RegExp(`^[a-zA-Z0-9._-]+\\.(${allowedExtensionsPattern})$`, "i")
  return filenameRegex.test(filename)
}

/**
 * Validates file type based on file extension
 */
function validateFileType(filePath: string): boolean {
  const extension = filePath.toLowerCase().split(".").pop()
  return ALLOWED_FILE_EXTENSIONS.includes(extension || "")
}

/**
 * Validates request body input
 */
function validateRequestBody(body: unknown): { isValid: boolean; error?: string } {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Invalid request body" }
  }

  const { filePath, section, altText, width, height, fileSize } = body as Record<string, unknown>

  // Required fields
  if (!filePath || typeof filePath !== "string") {
    return { isValid: false, error: "filePath is required and must be a string" }
  }

  if (!section || typeof section !== "string") {
    return { isValid: false, error: "section is required and must be a string" }
  }

  // Validate file path
  if (!validateFilePath(filePath)) {
    return { isValid: false, error: "Invalid file path format" }
  }

  // Validate file type
  if (!validateFileType(filePath)) {
    return { isValid: false, error: "Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed" }
  }

  // Validate section
  if (!ALLOWED_SECTIONS.includes(section)) {
    return { isValid: false, error: "Invalid section" }
  }

  // Validate file size if provided
  if (fileSize && (typeof fileSize !== "number" || fileSize <= 0 || fileSize > MAX_FILE_SIZE)) {
    return { isValid: false, error: `File size must be between 1 byte and ${MAX_FILE_SIZE / (1024 * 1024)}MB` }
  }

  // Optional field validation
  if (altText && (typeof altText !== "string" || altText.length > 500)) {
    return { isValid: false, error: "altText must be a string with max 500 characters" }
  }

  if (width && (typeof width !== "number" || width <= 0 || width > 10000)) {
    return { isValid: false, error: "width must be a positive number <= 10000" }
  }

  if (height && (typeof height !== "number" || height <= 0 || height > 10000)) {
    return { isValid: false, error: "height must be a positive number <= 10000" }
  }

  return { isValid: true }
}

serve(async (req) => {
  const origin = req.headers.get("origin")
  const cors = getCorsHeaders(origin)

  // 1. Pré-vol CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors })
  }

  try {
    // Validate Content-Type header
    const contentType = req.headers.get("Content-Type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid Content-Type:", contentType)
      return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    // 1. Parse and validate incoming JSON body
    let body: RequestBody
    try {
      body = await req.json()
    } catch (jsonError) {
      console.error("JSON parsing failed:", jsonError instanceof Error ? jsonError.message : "Unknown error")
      return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    // 2. Validate request body
    const validation = validateRequestBody(body)
    if (!validation.isValid) {
      console.error("Request validation failed:", validation.error)
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    // Extract validated data
    const { filePath, section, altText, width, height, blurHash } = body

    // 3. Validate environment variables and create Supabase Admin Client
    const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing required environment variables")
      throw new Error("Server configuration error")
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // 4. Verify file exists and get Public URL
    const { data: fileData, error: fileError } = await supabaseAdmin.storage
      .from("assets")
      .list(filePath.split("/")[0], {
        search: filePath.split("/")[1],
      })

    if (fileError || !fileData || fileData.length === 0) {
      console.error("File not found in storage:", filePath, fileError)
      throw new Error("File not found in storage")
    }

    const { data: urlData } = supabaseAdmin.storage.from("assets").getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      console.error("Could not get public URL for path:", filePath)
      throw new Error("Failed to get public URL for the uploaded image.")
    }
    const publicUrl = urlData.publicUrl

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
        headers: { ...cors, "Content-Type": "application/json" },
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
