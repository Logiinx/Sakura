import { useQuery } from "@tanstack/react-query"
import React, { useMemo, useCallback } from "react"
import { FaCheck } from "react-icons/fa"
import { Link } from "react-router-dom"

import { BlurImage } from "@/components/BlurImage"
// Removed Carousel component imports
import { getSectionText, getSectionImages } from "@/lib/supabasedb"
import type { SiteImageData } from "@/lib/supabasedb" // Keep SiteImageData if needed for single image

function useSectionTextQuery(section: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sectionText", section],
    queryFn: () => getSectionText(section),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
  // if (error) console.error(`Error fetching text for ${section}:`, error) // Keep error logging commented/removed if desired
  return { text: data, isLoading, error }
}

// Hook for fetching image sections
function useSectionImagesQuery(sections: string[]) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sectionImages", sections.sort().join(",")], // Stable query key
    queryFn: () => getSectionImages(sections),
    enabled: sections.length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
  // if (error) console.error(`Error fetching images for ${sections.join(", ")}:`, error) // Keep error logging commented/removed if desired
  return { images: data, isLoading, error }
}

/**
 * Renders the detailed page for Package One (Grossesse).
 * Displays a background image, description, inclusions, and pricing.
 * @returns The JSX element for the Package One page.
 */
const PackageOnePage: React.FC = () => {
  // Define the sections for images needed on this page

  // Fetch images data using the multi-image hook
  const imageSections = useMemo(
    () => [
      "grossesse-package", // Background image
    ],
    []
  )

  const { images: sectionImages, isLoading: imagesLoading, error: imagesError } = useSectionImagesQuery(imageSections)

  // Helper to get specific image data safely
  const getImageData = useCallback(
    (section: string): SiteImageData | null | undefined => {
      return sectionImages?.[section]
    },
    [sectionImages]
  )
  // Get the specific background image data
  const backgroundImage = getImageData("grossesse-package")

  // Fetch text data for the description
  const { text: grossesseText, isLoading: textLoading, error: textError } = useSectionTextQuery("grossessepackage")

  // Define static data, using fetched text when available
  const packageStaticData = useMemo(
    () => ({
      title: "Grossesse",
      description: textLoading
        ? "Chargement du texte..."
        : textError
          ? "Erreur de chargement du texte."
          : (grossesseText ?? "Aucune description disponible."),
      inclusions: [
        "Séance photo en studio ou en extérieur (selon météo et préférences)",
        "Accès à une garde-robe de robes de grossesse élégantes",
        "Guidance pour les poses afin de sublimer votre silhouette",
        "Retouche professionnelle de toutes les photos sélectionnées",
        "Galerie privée en ligne pour visualiser et télécharger vos photos",
        "Option d'inclure le partenaire et/ou les aînés",
      ],
      price: "€250",
      priceDetails: "pour une séance d'environ 1h30 et 15 photos HD retouchées.",
    }),
    [grossesseText, textLoading, textError]
  )

  // Handle combined loading state (only check imagesLoading and textLoading now)
  if (imagesLoading || textLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>
  }

  // Handle combined error state (only check imagesError and textError now)
  if (imagesError || textError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-600">
        Erreur lors du chargement des données. Veuillez réessayer plus tard.
        {imagesError && <p>Images Error: {imagesError.message}</p>}
        {textError && <p>Text Error: {textError.message}</p>}
        {/* Removed redundant imageError check */}
      </div>
    )
  }
  // Get the other package image data if needed (currently unused)
  // const imgData = getImageData(`grossesse-package`)

  // --- DEBUG LOG ---
  console.log("PackageOnePage - backgroundImage data:", backgroundImage)
  // --- END DEBUG LOG ---

  // Prepare background style if image exists - REMOVED
  // const backgroundStyle = backgroundImage
  //   ? {
  //       backgroundImage: `url(${backgroundImage.image_url}?w=1920&q=75)`,
  //       backgroundSize: "cover",
  //       backgroundPosition: "center",
  //     }
  //   : {}

  return (
    // Removed inline style from this div
    // Remove the dark background color added previously
    // Restore animate-fade-in
    <div className="relative min-h-screen animate-fade-in text-gray-800 dark:text-gray-200">
      {/* Background Layer with BlurImage - Restoring wrapper div */}
      <div className="absolute inset-0">
        {" "}
        {/* Restore wrapper div & REMOVE z-0 */}
        {backgroundImage ? (
          <BlurImage
            src={backgroundImage.image_url} // Using data from getImageData
            hash={backgroundImage.blur_hash}
            alt={backgroundImage.alt_text || "Package background image"}
            className="h-full w-full" // Remove absolute inset-0, keep h-full w-full
            objectFit="cover" // Ensure the image covers the area
            fetchPriority="high" // Match Index.tsx
            loading="eager" // Match Index.tsx
            overlayClassName="absolute inset-0 bg-black bg-opacity-50" // Apply overlay here
            crossOrigin="anonymous"
          />
        ) : (
          // Optional: Fallback if no image is found - Remove absolute positioning
          <div className="h-full w-full bg-gray-200 dark:bg-gray-800"></div>
        )}
      </div>{" "}
      {/* Close restored wrapper div */}
      {/* Overlay for text readability - REMOVED (now part of BlurImage) */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}
      {/* Content container - positioned relative to allow stacking above overlay */}
      <div className="container relative z-10 mx-auto px-4 py-12 md:py-20">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-playfair text-4xl font-bold text-white md:text-5xl">{packageStaticData.title}</h1>
          <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
        </div>

        {/* Description Section - Centered */}
        <div className="mb-16 text-center">
          <div className="prose prose-lg dark:prose-invert mx-auto max-w-3xl text-white">
            {/* Render description text */}
            <p>{packageStaticData.description}</p>
          </div>
        </div>

        {/* Inclusions & Pricing Section - Placed within a card for contrast */}
        <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white bg-opacity-90 p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-90">
          <h2 className="mb-6 text-center font-playfair text-3xl font-bold text-gray-900 dark:text-white">
            Ce qui est inclus
          </h2>
          <ul className="mb-8 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
            {packageStaticData.inclusions.map((item, index) => (
              <li key={index} className="flex items-start">
                <FaCheck size={18} className="mr-3 mt-1 flex-shrink-0 text-sakura-pink" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mb-8 border-t border-gray-200 pt-6 text-center dark:border-gray-600">
            <h3 className="mb-4 font-playfair text-2xl font-bold text-gray-900 dark:text-white">Tarif</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{packageStaticData.price}</p>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{packageStaticData.priceDetails}</p>
          </div>

          <div className="text-center">
            <Link
              to="/book-now" // Ensure this route exists in your router setup
              className="mt-auto inline-block w-full rounded-md bg-sakura-pink px-8 py-3 text-center font-medium text-white transition-colors hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-sakura-pink focus:ring-offset-2 dark:focus:ring-offset-gray-800 sm:w-auto">
              Réserver cette séance
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageOnePage
