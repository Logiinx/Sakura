import { useQuery } from "@tanstack/react-query"
import React, { useState, useMemo } from "react"

import { BlurImage } from "@/components/BlurImage"
import { getSectionImages } from "@/lib/supabasedb"

const categories = ["Tous", "Grossesse", "Famille", "Bébé", "Complices", "Mariage"]

// Define image sections for each category
const categoryImageSections = {
  Grossesse: Array.from({ length: 11 }, (_, i) => `grossesse-${i}`),
  Famille: Array.from({ length: 11 }, (_, i) => `famille-${i}`),
  Bébé: Array.from({ length: 11 }, (_, i) => `bebe-${i}`),
  Complices: Array.from({ length: 11 }, (_, i) => `complices-${i}`),
  Mariage: Array.from({ length: 10 }, (_, i) => `mariage-${i + 1}`),
}

// Hook for fetching image sections
function useSectionImagesQuery(sections: string[]) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sectionImages", sections.join(",")],
    queryFn: () => getSectionImages(sections),
    enabled: sections.length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
  return { images: data, isLoading, error }
}

const Galerie = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Get all image sections for the selected category
  const selectedSections = useMemo(() => {
    if (selectedCategory === "Tous") {
      return Object.values(categoryImageSections).flat()
    }
    return categoryImageSections[selectedCategory as keyof typeof categoryImageSections] || []
  }, [selectedCategory])

  // Fetch images for the selected sections
  const { images: sectionImages, isLoading, error } = useSectionImagesQuery(selectedSections)

  // Transform the images data into a flat array
  const filteredImages = useMemo(() => {
    if (!sectionImages) return []
    const images = selectedSections
      .map((section) => {
        const imageData = sectionImages[section]
        if (imageData) {
          // Ensure the image URL is properly formatted and accessible
          const imageUrl = imageData.image_url

          // Check if the URL is valid
          if (!imageUrl) {
            console.error(`Missing image URL for section ${section}`)
            return null
          }

          return {
            id: section,
            src: imageUrl,
            alt: imageData.alt_text || section,
            hash: imageData.blur_hash,
            width: imageData.width || 800, // Provide default width if missing
            height: imageData.height || 600, // Provide default height if missing
          }
        }
        return null
      })
      .filter((img): img is NonNullable<typeof img> => img !== null)

    console.log("Filtered images:", images.length)
    return images
  }, [sectionImages, selectedSections])

  const openLightbox = (id: string) => {
    setSelectedImage(id)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = ""
  }

  const getImageIndex = () => {
    if (selectedImage === null) return -1
    const index = filteredImages.findIndex((img) => img.id === selectedImage)
    return index
  }

  const navigateLightbox = (direction: "next" | "prev") => {
    const currentIndex = getImageIndex()
    if (currentIndex === -1) return

    let newIndex
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredImages.length
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length
    }

    setSelectedImage(filteredImages[newIndex].id)
  }

  return (
    <div className="animate-fade-in">
      <section className="py-16 md:py-24">
        <div className="sakura-container">
          <div className="mb-16 text-center">
            <h1 className="mb-4 mt-12 font-bad-script text-4xl font-bold tracking-widest md:text-5xl">Galerie</h1>
            <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              Immortaliser vos plus beaux moments, chaque image raconte une histoire.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-10 flex justify-center">
            <div className="flex space-x-2 rounded-full border border-gray-200 p-1">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`rounded-full px-6 py-2 transition-colors ${
                    selectedCategory === category ? "bg-sakura-pink text-white" : "hover:bg-sakura-light-pink"
                  }`}
                  onClick={() => setSelectedCategory(category)}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-sakura-pink"></div>
              <p className="mt-4 text-gray-600">Chargement des images...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="py-12 text-center">
              <p className="text-red-500">Une erreur est survenue lors du chargement des images.</p>
            </div>
          )}

          {/* Gallery Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="cursor-pointer overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                  onClick={() => openLightbox(image.id)}>
                  <div className="relative h-72">
                    <BlurImage
                      src={image.src}
                      hash={image.hash}
                      alt={image.alt}
                      className="h-full w-full transition-transform duration-500 hover:scale-105"
                      objectFit={image.height > image.width ? "contain" : "cover"}
                    />
                    <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lightbox */}
          {selectedImage !== null && getImageIndex() !== -1 && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
              onClick={closeLightbox}>
              <button className="absolute right-4 top-4 text-white hover:text-sakura-pink" onClick={closeLightbox}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button
                className="absolute left-4 top-1/2 -mt-6 text-white hover:text-sakura-pink"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateLightbox("prev")
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="relative max-h-[85vh] max-w-[85vw] overflow-hidden">
                {filteredImages.length > 0 && getImageIndex() >= 0 && (
                  <>
                    <img
                      src={filteredImages[getImageIndex()].src}
                      alt={filteredImages[getImageIndex()].alt}
                      className="block h-auto max-h-[85vh] w-auto max-w-[85vw] object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </>
                )}
              </div>

              <button
                className="absolute right-4 top-1/2 -mt-6 text-white hover:text-sakura-pink"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateLightbox("next")
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Galerie
