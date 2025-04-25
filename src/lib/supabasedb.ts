import { supabase } from "./supabase"

export async function getSectionText(section: string) {
  try {
    const { data, error } = await supabase.from("sections_texts").select("content").eq("section", section).maybeSingle()

    if (error) {
      console.error(`Erreur lors du chargement du texte pour la section "${section}" :`, error.message)
      return null
    }

    return data?.content ?? null
  } catch (error) {
    console.error(`Erreur lors du chargement du texte pour la section "${section}" :`, error)
    return null
  }
}

// --- START: Added Code for Site Images ---

// Interface for the image data structure matching your table
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
  // Add updated_at if you have it, needed for updateImageAltText
  updated_at?: string
}

// Fetches image data for one or more sections
export async function getSectionImages(sections: string[]): Promise<Record<string, SiteImageData | null>> {
  console.log("[getSectionImages] Requested sections:", sections) // <<< ADDED LOG

  if (!sections || sections.length === 0) {
    console.log("[getSectionImages] No sections requested, returning empty object.") // <<< ADDED LOG
    return {}
  }

  try {
    const { data, error } = await supabase
      .from("site_images")
      .select("*") // Select all columns defined in the interface
      .in("section", sections)

    console.log("[getSectionImages] Raw data from Supabase:", data) // <<< ADDED LOG
    console.log("[getSectionImages] Supabase error:", error) // <<< ADDED LOG

    if (error) {
      console.error(`[getSectionImages] Error loading images for sections "${sections.join(", ")}":`, error.message)
      // Return an object with null for each requested section on error
      const errorResult = sections.reduce(
        (acc, section) => {
          acc[section] = null
          return acc
        },
        {} as Record<string, SiteImageData | null>
      )
      console.log("[getSectionImages] Returning error result:", errorResult) // <<< ADDED LOG
      return errorResult
    }

    // Organize data by section
    const imagesBySection = sections.reduce(
      (acc, section) => {
        acc[section] = null // Default to null
        return acc
      },
      {} as Record<string, SiteImageData | null>
    )

    if (data) {
      data.forEach((image) => {
        // Type assertion, ensure your DB columns match SiteImageData
        if (image && image.section) {
          // Basic check before assignment
          imagesBySection[image.section] = image as SiteImageData
        } else {
          console.warn("[getSectionImages] Skipping invalid image data from DB:", image) // <<< ADDED LOG
        }
      })
    }

    console.log("[getSectionImages] Final processed data:", imagesBySection) // <<< ADDED LOG
    return imagesBySection
  } catch (error) {
    console.error(`[getSectionImages] CATCH BLOCK Error loading images for sections "${sections.join(", ")}":`, error)
    const catchErrorResult = sections.reduce(
      (acc, section) => {
        acc[section] = null
        return acc
      },
      {} as Record<string, SiteImageData | null>
    )
    console.log("[getSectionImages] Returning catch block error result:", catchErrorResult) // <<< ADDED LOG
    return catchErrorResult
  }
}

// Fetches ALL images (for the admin panel)
export async function getAllSiteImages(): Promise<SiteImageData[]> {
  try {
    const { data, error } = await supabase.from("site_images").select("*").order("section", { ascending: true }) // Order for easier viewing

    if (error) {
      console.error("Error loading all site images:", error.message)
      return []
    }
    return (data as SiteImageData[]) || []
  } catch (error) {
    console.error("Error loading all site images:", error)
    return []
  }
}

// Function to update alt text (example of an update operation)
export async function updateImageAltText(id: number, altText: string): Promise<boolean> {
  try {
    // Ensure you have an 'updated_at' column handled by Supabase triggers or manually update it
    const { error } = await supabase
      .from("site_images")
      .update({ alt_text: altText, updated_at: new Date().toISOString() }) // Update timestamp
      .eq("id", id)

    if (error) {
      console.error(`Error updating alt text for image ID ${id}:`, error.message)
      return false
    }
    return true
  } catch (error) {
    console.error(`Error updating alt text for image ID ${id}:`, error)
    return false
  }
}

// --- END: Added Code for Site Images ---
