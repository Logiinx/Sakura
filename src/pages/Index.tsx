import { useQuery } from "@tanstack/react-query"
// Import Embla API type
import type { UseEmblaCarouselType } from "embla-carousel-react"
import React, { useMemo, useCallback, useState, useEffect } from "react"
// Import icons directly from their subfolders for better tree-shaking
import { BiBriefcaseAlt2 } from "react-icons/bi"
import { BsHouseDoor } from "react-icons/bs"
import { HiOutlineSparkles } from "react-icons/hi"
// Import Link for internal navigation.
import { Link } from "react-router-dom"

import { BlurImage } from "@/components/BlurImage"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { useInView } from "@/hooks/useInView"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { getSectionText, getSectionImages } from "@/lib/supabasedb"
import type { SiteImageData } from "@/lib/supabasedb"
import Autoplay from "embla-carousel-autoplay"
/**
 * src/pages/Index.tsx
 *
 * This component renders the homepage of the application.
 * It includes sections like Hero, About, Featured Gallery, and a Call to Action.
 */

// Create autoplay plugin factory function - ensure playOnInit is false
const createAutoplayPlugin = () =>
  Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: false })

// --- START: Modified Hooks ---
// Hook for fetching text sections
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
// --- END: Modified Hooks ---

// Define the Index page component.
const Index: React.FC = () => {
  // --- START: Use TanStack Query Hooks ---
  // Define sections for text and images
  const imageSections = useMemo(
    () => [
      "hero", // For background
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
      "aproposdemoi",
    ],
    []
  )

  // Fetch text data
  const { text: grossesseText } = useSectionTextQuery("grossesse")
  const { text: familleText } = useSectionTextQuery("famille")
  const { text: bebeText } = useSectionTextQuery("bebe")
  const { text: complicesText } = useSectionTextQuery("complices")
  const { text: aproposdeMoiText } = useSectionTextQuery("aproposdemoi")
  const { text: aproposdeMoiText2 } = useSectionTextQuery("aproposdemoi2")

  // Fetch image data
  const { images: sectionImages, isLoading: imagesLoading, error: imagesError } = useSectionImagesQuery(imageSections)

  // Helper to get specific image data safely
  const getImageData = useCallback(
    (section: string): SiteImageData | null | undefined => {
      return sectionImages?.[section]
    },
    [sectionImages]
  )
  // --- END: Use TanStack Query Hooks ---

  // --- START: Use useScrollAnimation for text AND carousels, useInView for carousel visibility ---
  // Create refs for text sections (using scroll animation)
  const maternityTextRef = useScrollAnimation()
  const familyTextRef = useScrollAnimation()
  const babyTextRef = useScrollAnimation()
  const complicesTextRef = useScrollAnimation()
  const aproposdemoiTextRef = useScrollAnimation()

  // Create refs for carousels (using scroll animation for slide-in)
  const maternityCarouselRef = useScrollAnimation() // Use this for animation
  const familyCarouselRef = useScrollAnimation() // Use this for animation
  const babyCarouselRef = useScrollAnimation() // Use this for animation
  const complicesCarouselRef = useScrollAnimation() // Use this for animation
  const aproposdemoiCarouselRef = useScrollAnimation() // Use this for animation

  // Use useInView *with* the refs from useScrollAnimation just to get visibility status for autoplay
  // Note: We ignore the first returned value (the ref) from useInView as we already have one.
  const [, isMaternityCarouselVisible] = useInView({
    targetRef: maternityCarouselRef,
    triggerOnce: true,
    rootMargin: "-100px",
  })
  const [, isFamilyCarouselVisible] = useInView({
    targetRef: familyCarouselRef,
    triggerOnce: true,
    rootMargin: "-100px",
  })
  const [, isBabyCarouselVisible] = useInView({ targetRef: babyCarouselRef, triggerOnce: true, rootMargin: "-100px" })
  const [, isComplicesCarouselVisible] = useInView({
    targetRef: complicesCarouselRef,
    triggerOnce: true,
    rootMargin: "-100px",
  })
  // --- END: Use useScrollAnimation for text AND carousels, useInView for carousel visibility ---

  // --- START: Get Carousel API instances and manage autoplay ---
  const [maternityApi, setMaternityApi] = useState<UseEmblaCarouselType[1] | undefined>()
  const [familyApi, setFamilyApi] = useState<UseEmblaCarouselType[1] | undefined>()
  const [babyApi, setBabyApi] = useState<UseEmblaCarouselType[1] | undefined>()
  const [complicesApi, setComplicesApi] = useState<UseEmblaCarouselType[1] | undefined>()

  // Memoize autoplay plugins (no changes needed here, already done via createAutoplayPlugin)
  const maternityAutoplay = useMemo(() => createAutoplayPlugin(), [])
  const familyAutoplay = useMemo(() => createAutoplayPlugin(), [])
  const babyAutoplay = useMemo(() => createAutoplayPlugin(), [])
  const complicesAutoplay = useMemo(() => createAutoplayPlugin(), [])

  // Effect to play autoplay when carousel is visible and API is ready
  useEffect(() => {
    if (isMaternityCarouselVisible && maternityApi) {
      maternityApi.plugins().autoplay?.play()
    }
  }, [isMaternityCarouselVisible, maternityApi])

  useEffect(() => {
    if (isFamilyCarouselVisible && familyApi) {
      familyApi.plugins().autoplay?.play()
    }
  }, [isFamilyCarouselVisible, familyApi])

  useEffect(() => {
    if (isBabyCarouselVisible && babyApi) {
      babyApi.plugins().autoplay?.play()
    }
  }, [isBabyCarouselVisible, babyApi])

  useEffect(() => {
    if (isComplicesCarouselVisible && complicesApi) {
      complicesApi.plugins().autoplay?.play()
    }
  }, [isComplicesCarouselVisible, complicesApi])

  // --- END: Get Carousel API instances and manage autoplay ---

  // --- START: Scroll to section based on URL hash ---
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const element = document.querySelector(hash)
      if (element) {
        // Timeout to ensure the element is rendered and layout is stable
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" })
        }, 100) // Adjust delay if needed
      }
    }
  }, []) // Run once on component mount
  // --- END: Scroll to section based on URL hash ---

  const heroImageData = getImageData("hero")
  // console.log("Hero Image Data:", heroImageData) // Removed log
  // console.log("Images Loading:", imagesLoading) // Removed log
  // console.log("Images Error:", imagesError) // Removed log - potentially logged via hook
  return (
    // Apply a fade-in animation to the entire page content.
    <div className="animate-fade-in">
      {/* --- Hero Section --- */}
      {/* `relative` allows absolute positioning of children. `h-screen` makes it full viewport height. */}
      {/* `flex items-center` vertically centers the content. */}
      <section className="relative flex h-screen items-center">
        {/* Background Layer */}
        <div className="absolute inset-0">
          {/* Show placeholder/error or the actual image */}
          {imagesError && !heroImageData && (
            // Error state if image fails to load initially
            <div className="flex h-full w-full items-center justify-center bg-red-200 text-red-800">
              Error loading background.
            </div>
          )}
          {heroImageData && (
            <BlurImage
              src={heroImageData.image_url}
              hash={heroImageData.blur_hash}
              alt={heroImageData.alt_text || "Hero background image"}
              className="h-full w-full" // Ensure it fills the container
              objectFit="cover" // Ensure the image covers the area
              fetchPriority="high"
              loading="eager"
              overlayClassName="absolute inset-0 bg-black bg-opacity-30" // Pass overlay style here
              crossOrigin="anonymous"
            />
          )}

          {/* Error Message (Overlay - shown if fetch fails *after* initial load attempt) */}
          {imagesError &&
            !imagesLoading &&
            !heroImageData && ( // Only show if data couldn't be fetched at all
              <div className="absolute inset-0 flex items-center justify-center bg-red-700 bg-opacity-75 text-white">
                Erreur lors du chargement de l&apos;image de fond.
              </div>
            )}
        </div>

        {/* Hero Content Container */}
        {/* `sakura-container` provides consistent padding/max-width. */}
        {/* `relative z-10` ensures content appears above the background and overlay. */}
        {/* `text-white` sets text color for contrast against the dark overlay. */}
        <div className="sakura-container relative z-10 text-white">
          {/* Main Heading: Uses Playfair Display font (from Layout/index.css). Responsive text size. */}
          <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-7xl">
            <img
              src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/logomom.webp"
              alt="Mom.B Logo"
              className="mx-auto"
              loading="eager"
              crossOrigin="anonymous"
            />
          </h1>
          {/* Subheading/Tagline: Lighter font weight. */}
          <p className="mb-8 flex max-w-lg justify-center font-bad-script text-2xl tracking-widest">
            Bienvenue sur MOM.B
          </p>
          {/* Call to Action Button: Uses the custom `sakura-btn` style and `hover-float` animation. */}
          <Link to="/contact" className="sakura-btn hover-float flex justify-center px-1 py-2 shadow-md text-shadow-md">
            Prendre rendez-vous
          </Link>
        </div>
      </section>

      {/* --- Photography Services Sections --- */}
      <div className="w-full">
        {/* Maternity Photography */}
        <section className="md:py-30 w-full bg-white py-32">
          <div className="sakura-container">
            <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start">
              <div ref={maternityTextRef} className="slide-hidden slide-from-left w-full lg:w-1/2 lg:pr-16">
                <h2 className="text-warm-gray-800 mb-4 font-bad-script text-4xl font-bold leading-relaxed tracking-wider md:text-5xl">
                  La beauté de la grossesse
                </h2>
                <p className="text-warm-gray-600 mb-6 text-lg leading-relaxed text-[#623E2A] md:text-xl">
                  {grossesseText ?? "Chargement du texte..."}
                </p>
                <Link to="/grossesse" className="sakura-btn hover-float inline-block text-shadow-md">
                  EN SAVOIR PLUS
                </Link>
              </div>
              <div ref={maternityCarouselRef} className="slide-hidden slide-from-right w-full lg:w-1/2">
                <Carousel
                  className="w-full"
                  plugins={[maternityAutoplay]}
                  opts={{ loop: true }}
                  setApi={setMaternityApi}>
                  <CarouselContent>
                    {/* Dynamic Carousel Items */}
                    {[1, 2, 3].map((index) => {
                      const imgData = getImageData(`grossesse-${index}`)
                      const sectionKey = `grossesse-${index}`
                      // Define desired dimensions and container height
                      const containerHeight = 384 // Corresponds to h-96
                      const landscapeTargetWidth = 600

                      let transformedSrc: string | undefined = undefined
                      let objectFitClass: "cover" | "contain" = "cover" // Default

                      if (imgData?.image_url) {
                        if (imgData.width && imgData.height && imgData.height > 0) {
                          const aspectRatio = imgData.width / imgData.height
                          if (aspectRatio < 1) {
                            // Vertical image: Resize based on height, contain
                            objectFitClass = "contain"
                            transformedSrc = `${imgData.image_url}?height=${containerHeight}&resize=contain`
                          } else {
                            // Landscape/Square image: Resize with cover
                            objectFitClass = "cover"
                            transformedSrc = `${imgData.image_url}?width=${landscapeTargetWidth}&height=${containerHeight}&resize=cover`
                          }
                        } else {
                          // Fallback if dimensions are missing
                          transformedSrc = `${imgData.image_url}?width=${landscapeTargetWidth}&height=${containerHeight}&resize=cover`
                        }
                      }

                      return (
                        <CarouselItem key={sectionKey} className="basis-full overflow-hidden">
                          {/* Added fixed height h-96 here */}
                          <div className="relative h-96 w-full">
                            {imgData && transformedSrc ? (
                              <BlurImage
                                src={transformedSrc} // Use transformed URL
                                hash={imgData.blur_hash}
                                alt={imgData.alt_text || `Grossesse ${index}`}
                                // Apply styles directly for fill/cover behavior
                                className={`absolute inset-0 h-full w-full rounded-lg shadow-md`}
                                objectFit={objectFitClass} // Pass objectFit as a prop
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500 shadow-md">
                                {imagesLoading ? "Chargement..." : `Image ${sectionKey} manquante`}
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        </section>

        {/* Family Photography */}
        <section className="md:py-30 w-full bg-[#f8f8f8] py-32">
          <div className="sakura-container">
            <div className="flex flex-col-reverse items-center gap-16 lg:flex-row lg:items-start">
              <div ref={familyCarouselRef} className="slide-hidden slide-from-left w-full lg:w-1/2">
                <Carousel className="w-full" plugins={[familyAutoplay]} opts={{ loop: true }} setApi={setFamilyApi}>
                  <CarouselContent>
                    {[1, 2, 3].map((index) => {
                      const imgData = getImageData(`famille-${index}`)
                      const sectionKey = `famille-${index}`
                      // Define desired dimensions and container height
                      const containerHeight = 384 // Corresponds to h-96
                      const landscapeTargetWidth = 600

                      let transformedSrc: string | undefined = undefined
                      let objectFitClass: "cover" | "contain" = "cover" // Default

                      if (imgData?.image_url) {
                        if (imgData.width && imgData.height && imgData.height > 0) {
                          const aspectRatio = imgData.width / imgData.height
                          if (aspectRatio < 1) {
                            // Vertical image: Resize based on height, contain
                            objectFitClass = "contain"
                            transformedSrc = `${imgData.image_url}?height=${containerHeight}&resize=contain`
                          } else {
                            // Landscape/Square image: Resize with cover
                            objectFitClass = "cover"
                            transformedSrc = `${imgData.image_url}?width=${landscapeTargetWidth}&height=${containerHeight}&resize=cover`
                          }
                        } else {
                          // Fallback if dimensions are missing
                          transformedSrc = `${imgData.image_url}?width=${landscapeTargetWidth}&height=${containerHeight}&resize=cover`
                        }
                      }

                      return (
                        <CarouselItem key={sectionKey}>
                          {/* Added fixed height h-96 here */}
                          <div className="relative h-96 w-full">
                            {imgData && transformedSrc ? (
                              <BlurImage
                                src={transformedSrc} // Use transformed URL
                                hash={imgData.blur_hash}
                                alt={imgData.alt_text || `Famille ${index}`}
                                // Apply styles directly for fill/cover behavior
                                className={`absolute inset-0 h-full w-full rounded-lg shadow-md`}
                                objectFit={objectFitClass} // Pass objectFit as a prop
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500 shadow-md">
                                {imagesLoading ? "Chargement..." : `Image ${sectionKey} manquante`}
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div ref={familyTextRef} className="slide-hidden slide-from-right w-full lg:w-1/2 lg:pl-16">
                <h2 className="text-warm-gray-800 mb-4 font-bad-script text-4xl font-bold leading-relaxed tracking-wider md:text-5xl">
                  Moments en Famille
                </h2>
                <p className="text-warm-gray-600 mb-6 text-lg leading-relaxed text-[#623E2A] md:text-xl">
                  {familleText ?? "Chargement du texte..."}
                </p>
                <Link to="/famille" className="sakura-btn hover-float inline-block text-shadow-md">
                  EN SAVOIR PLUS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Baby Photography */}
        <section className="md:py-30 w-full bg-white py-32">
          <div className="sakura-container">
            <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start">
              <div ref={babyTextRef} className="slide-hidden slide-from-left w-full lg:w-1/2 lg:pr-16">
                <h2 className="text-warm-gray-800 mb-4 font-bad-script text-4xl font-bold leading-relaxed tracking-wider md:text-5xl">
                  Bébé et nous
                </h2>
                <p className="text-warm-gray-600 mb-6 text-lg leading-relaxed text-[#623E2A] md:text-xl">
                  {bebeText ?? "Chargement du texte..."}
                </p>
                <Link to="/bebe" className="sakura-btn hover-float inline-block text-shadow-md">
                  EN SAVOIR PLUS
                </Link>
              </div>
              <div ref={babyCarouselRef} className="slide-hidden slide-from-right w-full lg:w-1/2">
                <Carousel className="w-full" plugins={[babyAutoplay]} opts={{ loop: true }} setApi={setBabyApi}>
                  <CarouselContent>
                    {[1, 2, 3].map((index) => {
                      const imgData = getImageData(`bebe-${index}`)
                      const sectionKey = `bebe-${index}`
                      // Define desired dimensions and container height
                      const containerHeight = 384 // Corresponds to h-96
                      const landscapeTargetWidth = 600

                      let transformedSrc: string | undefined = undefined
                      let objectFitClass: "cover" | "contain" = "cover" // Default

                      if (imgData?.image_url) {
                        if (imgData.width && imgData.height && imgData.height > 0) {
                          const aspectRatio = imgData.width / imgData.height
                          if (aspectRatio < 1) {
                            // Vertical image: Resize based on height, contain
                            objectFitClass = "contain"
                            transformedSrc = `${imgData.image_url}?height=${containerHeight}&resize=contain`
                          } else {
                            // Landscape/Square image: Resize with cover
                            objectFitClass = "cover"
                            transformedSrc = `${imgData.image_url}?width=${landscapeTargetWidth}&height=${containerHeight}&resize=cover`
                          }
                        } else {
                          // Fallback if dimensions are missing
                          transformedSrc = `${imgData.image_url}?width=${landscapeTargetWidth}&height=${containerHeight}&resize=cover`
                        }
                      }

                      return (
                        <CarouselItem key={sectionKey}>
                          {/* Added fixed height h-96 here */}
                          <div className="relative h-96 w-full">
                            {imgData && transformedSrc ? (
                              <BlurImage
                                src={transformedSrc} // Use transformed URL
                                hash={imgData.blur_hash}
                                alt={imgData.alt_text || `Bébé ${index}`}
                                // Apply styles directly for fill/cover behavior
                                className={`absolute inset-0 h-full w-full rounded-lg shadow-md`}
                                objectFit={objectFitClass} // Pass objectFit as a prop
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500 shadow-md">
                                {imagesLoading ? "Chargement..." : `Image ${sectionKey} manquante`}
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        </section>

        {/* Complices Photography */}
        <section className="md:py-30 w-full bg-[#f8f8f8] py-32">
          <div className="sakura-container">
            <div className="flex flex-col-reverse items-center gap-16 lg:flex-row lg:items-start">
              <div ref={complicesCarouselRef} className="slide-hidden slide-from-left w-full lg:w-1/2">
                <Carousel
                  className="w-full"
                  plugins={[complicesAutoplay]}
                  opts={{ loop: true }}
                  setApi={setComplicesApi}>
                  <CarouselContent>
                    {[1, 2, 3].map((index) => {
                      const imgData = getImageData(`complices-${index}`)
                      const sectionKey = `complices-${index}`
                      // Define desired dimensions and container height
                      const containerHeight = 384 // Corresponds to h-96
                      const landscapeTargetWidth = 600

                      let transformedSrc: string | undefined = undefined
                      let objectFitClass: "cover" | "contain" = "cover" // Default

                      if (imgData?.image_url) {
                        if (imgData.width && imgData.height && imgData.height > 0) {
                          const aspectRatio = imgData.width / imgData.height
                          if (aspectRatio < 1) {
                            // Vertical image: Resize based on height, contain
                            objectFitClass = "contain"
                            transformedSrc = `${imgData.image_url}?height=${containerHeight}&resize=contain`
                          } else {
                            // Landscape/Square image: Resize with cover
                            objectFitClass = "cover"
                            transformedSrc = `${imgData.image_url}?width=${landscapeTargetWidth}&height=${containerHeight}&resize=cover`
                          }
                        } else {
                          // Fallback if dimensions are missing
                          transformedSrc = `${imgData.image_url}?width=${landscapeTargetWidth}&height=${containerHeight}&resize=cover`
                        }
                      }

                      // DEBUG LOG for complices-1
                      // if (sectionKey === "complices-1") { // Keep debug log commented out
                      //   console.log("DEBUG complices-1:", {
                      //     imgData,
                      //     aspectRatio: imgData?.width && imgData?.height ? imgData.width / imgData.height : "N/A",
                      //     objectFitClass,
                      //     transformedSrc,
                      //   })
                      // }

                      return (
                        <CarouselItem key={sectionKey}>
                          {/* Added fixed height h-96 here */}
                          <div className="relative h-96 w-full">
                            {imgData && transformedSrc ? (
                              <BlurImage
                                src={transformedSrc} // Use transformed URL
                                hash={imgData.blur_hash}
                                alt={imgData.alt_text || `Complices ${index}`}
                                // Apply styles directly for fill/cover behavior
                                className={`absolute inset-0 h-full w-full rounded-lg shadow-md`}
                                objectFit={objectFitClass} // Pass objectFit as a prop
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500 shadow-md">
                                {imagesLoading ? "Chargement..." : `Image ${sectionKey} manquante`}
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div ref={complicesTextRef} className="slide-hidden slide-from-right w-full lg:w-1/2 lg:pl-16">
                <h2 className="text-warm-gray-800 mb-4 font-bad-script text-4xl font-bold leading-relaxed tracking-wider md:text-5xl">
                  Complices à deux
                </h2>
                <p className="text-warm-gray-600 mb-6 text-lg leading-relaxed text-[#623E2A] md:text-xl">
                  {complicesText ?? "Chargement du texte..."}
                </p>
                <Link to="/complices" className="sakura-btn hover-float inline-block text-shadow-md">
                  EN SAVOIR PLUS
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="section-divider"></div>

      {/* --- About Me Section --- */}
      {/* Add id for scrolling */}
      <section id="about-me-section" className="bg-sakura-pink bg-opacity-30 py-20 md:py-20">
        <div className="sakura-container">
          {/* Section Heading Area */}
          <div className="mb-16 text-center">
            <h2 className="relative mb-6 font-bad-script text-4xl font-bold tracking-widest md:text-6xl">
              À propos de moi
            </h2>
            <div className="section-divider"></div>
          </div>

          {/* About Me Content - Left-Right Layout */}
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
            {/* Text Content - Left Side */}
            <div ref={aproposdemoiTextRef} className="slide-hidden slide-from-left w-full lg:w-1/2 lg:pr-16">
              <div className="rounded-lg bg-white p-8 shadow-lg">
                <div className="prose prose-lg mx-auto text-xl">
                  <p className="whitespace-pre-line">{aproposdeMoiText ?? "Chargement du texte..."}</p>
                </div>
              </div>
            </div>

            {/* Carousel - Right Side */}
            <div ref={aproposdemoiCarouselRef} className="slide-hidden slide-from-right w-full lg:w-1/2">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {[1].map((sectionKey, index) => {
                    const imgData = getImageData(`aproposdemoi`)

                    // Dynamic sizing based on image orientation
                    let containerHeight = 384
                    let containerClass = "relative h-96 w-full"
                    const landscapeTargetWidth = 600
                    let transformedSrc: string | undefined = undefined
                    let objectFitClass: "cover" | "contain" = "cover"

                    if (imgData?.image_url) {
                      if (imgData.width && imgData.height && imgData.height > 0) {
                        const aspectRatio = imgData.width / imgData.height
                        if (aspectRatio < 1) {
                          // Vertical image - use taller container for better display
                          containerHeight = 550
                          containerClass = "relative h-[550px] w-full"
                          objectFitClass = "contain"
                          transformedSrc = `${imgData.image_url}?height=${containerHeight}&resize=contain`
                        } else {
                          // Horizontal image - use standard container
                          containerHeight = 384
                          containerClass = "relative h-96 w-full"
                          objectFitClass = "cover"
                          transformedSrc = `${imgData.image_url}?width=${landscapeTargetWidth}&height=${containerHeight}&resize=cover`
                        }
                      } else {
                        transformedSrc = `${imgData.image_url}?width=${landscapeTargetWidth}&height=${containerHeight}&resize=cover`
                      }
                    }

                    return (
                      <CarouselItem key={sectionKey} className="basis-full overflow-hidden">
                        <div className={containerClass}>
                          {imgData && transformedSrc ? (
                            <BlurImage
                              src={transformedSrc}
                              hash={imgData.blur_hash}
                              alt={imgData.alt_text || `Image ${index + 1} pour ${sectionKey}`}
                              className={`absolute inset-0 h-full w-full rounded-lg shadow-md`}
                              objectFit={objectFitClass}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500 shadow-md">
                              {imagesLoading ? "Chargement..." : `Image ${sectionKey} manquante`}
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>

          {/* Horizontal Card Component */}
          <div className="mt-12 w-full">
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <div className="flex flex-col items-center space-y-6 md:flex-row md:space-x-8 md:space-y-0">
                {/* Center - Main content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="mb-3 font-bad-script text-4xl font-semibold text-sakura-pink">
                    Moi c&apos;est Barbara et je suis :
                  </h3>
                  <div className="prose prose-lg mx-auto text-xl">
                    <p className="whitespace-pre-line">{aproposdeMoiText2 ?? "Chargement du texte..."}</p>
                  </div>
                </div>

                {/* Right side - Call to action */}
                {/* <div className="flex-shrink-0">
                  <Link
                    to="/contact"
                    className="sakura-btn hover-float inline-block px-6 py-3 text-base font-medium text-shadow-md">
                    Découvrir mes services
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Call to Action (CTA) Section --- */}
      <section className="bg-white py-20 md:py-32">
        <div className="sakura-container text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="relative mb-6 font-bad-script text-4xl font-bold tracking-widest md:text-6xl">
              <span className="relative block">Besoin d&apos;un</span>
              <span className="relative mt-2 block text-sakura-pink">Projet Personnalisé ?</span>
            </h2>
          </div>
          <div className="section-divider mb-12"></div>

          {/* Projects Showcase Box */}
          <div className="mx-auto max-w-4xl transform space-y-4 rounded-xl bg-gradient-to-br from-[#f8f8f8] to-white px-8 py-4 shadow-lg transition-all duration-300 hover:shadow-xl md:px-12 md:py-6">
            {/* Project Types Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  title: "Événements",
                  description: "Mariages, anniversaires, célébrations spéciales",
                  icon: HiOutlineSparkles,
                },
                {
                  title: "Entreprise",
                  description: "Photos corporate, événements professionnels",
                  icon: BiBriefcaseAlt2,
                },
                {
                  title: "Projets Immobiliers",
                  description: "Vente, location, ou gestion d'appartements, de maisons ou de villas",
                  icon: BsHouseDoor,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group relative transform rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-sakura-pink/15 p-4 text-sakura-pink transition-all duration-300 group-hover:bg-sakura-pink group-hover:text-white">
                      <item.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h4 className="mb-3 text-xl font-semibold text-[#333333]">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
            {/* Quotation Text */}
            <div className="mx-auto max-w-2xl rounded-lg p-8">
              <p className="mb-4 text-2xl font-medium text-[#333333]">Sur devis personnalisé</p>
              <p className="text-lg text-gray-700">Chaque projet est unique et mérite une attention particulière</p>
              <Link
                to="/contact"
                className="sakura-btn hover-float mt-12 inline-block px-8 py-4 text-lg font-medium text-shadow-md">
                Contactez-moi pour un devis
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Export the Index component for use in App.tsx (routing).
export default Index
