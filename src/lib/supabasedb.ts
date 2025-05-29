import type { PostgrestError } from "@supabase/supabase-js"
import { toast } from "sonner"

import { supabase } from "./supabase"

/**
 * Represents the structure of image data stored in the 'site_images' table.
 */
export interface SiteImageData {
  id: number
  created_at: string
  image_url: string
  alt_text: string | null
  width: number | null
  height: number | null
  section: string
  blur_hash: string | null
  size: string | null // Assuming size is stored as text, adjust if it's numeric
  updated_at?: string // Optional, but recommended for tracking updates
}

/**
 * Represents the structure of text data stored in the 'sections_texts' table.
 */
export interface SectionTextData {
  id: number
  created_at: string
  updated_at?: string // Use a consistent name if possible (e.g., updated_at)
  section: string
  content: string
  page?: string // Add the new page column (make optional if it might be null)
}

/**
 * Centralized error handler for Supabase queries.
 * @param error - The PostgrestError from Supabase.
 * @param context - A description of the operation being performed (e.g., "loading section text").
 * @throws Throws an error with a descriptive message.
 */
function handleSupabaseError(error: PostgrestError, context: string): never {
  console.error(`Supabase error during ${context}:`, error.message)
  throw new Error(`Failed to ${context}. ${error.message}`)
}

/**
 * Fetches the content for a specific text section from the 'sections_texts' table.
 * @param section - The name of the section to fetch.
 * @returns The content of the section, or null if not found.
 * @throws If there's an error fetching the data.
 */
export async function getSectionText(section: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("sections_texts")
      .select("content") // Select only necessary column
      .eq("section", section)
      .maybeSingle()

    if (error) {
      handleSupabaseError(error, `loading text for section "${section}"`)
    }

    return data?.content ?? null
  } catch (error) {
    // Catch errors from handleSupabaseError or other unexpected issues
    console.error(`Unexpected error loading text for section "${section}":`, error)
    throw error // Re-throw the error to be handled by the caller (e.g., React Query)
  }
}

/**
 * Fetches image data for one or more specified sections from the 'site_images' table.
 * Organizes the results into a record keyed by section name.
 * @param sections - An array of section names to fetch images for.
 * @returns A record where keys are section names and values are the corresponding SiteImageData or null if not found/error.
 * @throws If there's an error fetching the data.
 */
export async function getSectionImages(sections: string[]): Promise<Record<string, SiteImageData | null>> {
  if (!sections || sections.length === 0) {
    return {}
  }

  // Fetching images for sections

  // Explicitly list columns based on SiteImageData interface
  const columnsToSelect = "id, created_at, image_url, alt_text, width, height, section, blur_hash, size, updated_at"

  try {
    const { data, error } = await supabase.from("site_images").select(columnsToSelect).in("section", sections)

    if (error) {
      handleSupabaseError(error, `loading images for sections "${sections.join(", ")}"`)
    }

    // Fetched image data

    // Initialize result object with null for all requested sections
    const imagesBySection = sections.reduce(
      (acc, section) => {
        acc[section] = null
        return acc
      },
      {} as Record<string, SiteImageData | null>
    )

    // Populate the result object with fetched data
    if (data) {
      data.forEach((image) => {
        // The select guarantees the shape matches SiteImageData (or is null)
        if (image && image.section && sections.includes(image.section)) {
          imagesBySection[image.section] = image as SiteImageData // Type assertion is safe here due to explicit select
        } else {
          // This case should ideally not happen with the .in() filter, but good for robustness
          console.warn("[getSectionImages] Skipping image data not matching requested sections:", image)
        }
      })
    }

    return imagesBySection
  } catch (error) {
    console.error(`Unexpected error loading images for sections "${sections.join(", ")}":`, error)
    // Rethrow to allow React Query or other callers to handle the error state
    throw error
  }
}

/**
 * Fetches all images from the 'site_images' table, ordered by section.
 * Primarily used for administrative purposes (e.g., admin panel).
 * @returns An array of SiteImageData objects.
 * @throws If there's an error fetching the data.
 */
export async function getAllSiteImages(): Promise<SiteImageData[]> {
  // Explicitly list columns based on SiteImageData interface
  const columnsToSelect = "id, created_at, image_url, alt_text, width, height, section, blur_hash, size, updated_at"

  try {
    const { data, error } = await supabase
      .from("site_images")
      .select(columnsToSelect)
      .order("section", { ascending: true })
      .order("created_at", { ascending: true }) // Add secondary sort for consistency within sections

    if (error) {
      handleSupabaseError(error, "loading all site images")
    }

    // Ensure data is treated as an array, return empty array if null/undefined
    return (data as SiteImageData[]) || []
  } catch (error) {
    console.error("Unexpected error loading all site images:", error)
    throw error // Re-throw
  }
}

/**
 * Fetches all text sections from the 'sections_texts' table, ordered by section.
 * @returns An array of SectionTextData objects.
 * @throws If there's an error fetching the data.
 */
export async function getAllSectionTexts(): Promise<SectionTextData[]> {
  // Add 'page' to the selection
  const columnsToSelect = "id, created_at, updated_at, section, content, page"
  try {
    const { data, error } = await supabase
      .from("sections_texts")
      .select(columnsToSelect)
      .order("id", { ascending: true })

    if (error) {
      handleSupabaseError(error, "loading all section texts")
    }

    return (data as SectionTextData[]) || []
  } catch (error) {
    console.error("Unexpected error loading all section texts:", error)
    throw error // Re-throw
  }
}

/**
 * Updates the content for a specific section in the 'sections_texts' table.
 * Optionally updates the 'updated_at' timestamp.
 * @param id - The ID of the text section to update.
 * @param content - The new content.
 * @returns True if the update was successful, false otherwise.
 * @throws If there's an error during the update process.
 */
export async function updateSectionText(id: number, content: string): Promise<boolean> {
  try {
    // Attempting update for section text
    const { data, error, status } = await supabase
      .from("sections_texts")
      .update({ content: content, updated_at: new Date().toISOString() }) // Update content and timestamp
      .eq("id", id)
      .select("id, content") // Select to verify
      .maybeSingle()

    // Update result available

    if (error) {
      console.error(`[updateSectionText] Supabase error during update for ID ${id}:`, error)
      handleSupabaseError(error, `updating content for section text ID ${id}`)
    }

    // Check status code (200 OK or 204 No Content if select wasn't used/matched)
    // And verify returned data if select was used
    if ((status === 200 || status === 204) && data?.content === content) {
      // Update successful and verified
      return true
    } else if (status === 200 || status === 204) {
      // Update happened but verification failed (maybe RLS or select issue)
      console.warn(
        `[updateSectionText] Update status ${status} for ID ${id}, but verification failed. Returned data:`,
        data
      )
      toast.info("Mise à jour effectuée, mais la vérification post-opération a échoué.")
      return true // Still treat as success if status code is okay
    } else {
      console.warn(
        `[updateSectionText] Update failed or verification failed for ID: ${id}. Status: ${status}, Data:`,
        data
      )
      toast.error("Échec de la mise à jour du texte de la section.")
      return false
    }
  } catch (error) {
    console.error(`[updateSectionText] Unexpected error updating content for ID ${id}:`, error)
    toast.error("Une erreur inattendue est survenue lors de la mise à jour.")
    return false
  }
}

/**
 * Updates the alt text for a specific image in the 'site_images' table.
 * Also updates the 'updated_at' timestamp.
 * @param id - The ID of the image to update.
 * @param altText - The new alt text.
 * @returns True if the update was successful, false otherwise.
 * @throws If there's an error during the update process.
 */
export async function updateImageAltText(id: number, altText: string): Promise<boolean> {
  try {
    // Attempting alt text update
    const { data, error } = await supabase
      .from("site_images")
      .update({ alt_text: altText, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, alt_text") // Chain select to get the updated row back
      .maybeSingle() // Use maybeSingle as we expect one row or null

    // Alt text update result available

    if (error) {
      // Log the error before throwing
      console.error(`[updateImageAltText] Supabase error during update for ID ${id}:`, error)
      handleSupabaseError(error, `updating alt text for image ID ${id}`) // This will throw
    }

    // Check if data was returned and if the alt_text matches what we sent
    if (data && data.alt_text === altText) {
      // Alt text update successful and verified
      return true
    } else {
      // This case means the update reported no error, but we didn't get the expected data back.
      // Could be RLS preventing reading the updated row, or the update didn't 'stick'.
      console.warn(
        `[updateImageAltText] Update reported success for ID: ${id}, but verification failed. Returned data:`,
        data
      )
      toast.error(
        "L'opération a semblé réussir, mais la vérification a échoué. Vérifiez les politiques RLS ou les triggers."
      )
      return false
    }
  } catch (error) {
    // Catch errors from handleSupabaseError or other unexpected issues
    console.error(`[updateImageAltText] Unexpected error updating alt text for image ID ${id}:`, error)
    // Don't re-throw here if the desired return type is boolean
    return false
  }
}
