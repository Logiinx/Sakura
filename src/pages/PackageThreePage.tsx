import { useQuery } from "@tanstack/react-query"
import type { UseEmblaCarouselType } from "embla-carousel-react"
import React, { useMemo, useCallback, useState, useEffect } from "react"
import { FaCheck } from "react-icons/fa6"
import { Link } from "react-router-dom"

import { BlurImage } from "@/components/BlurImage"
import { SEOHead } from "@/components/SEOHead"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { getSectionText, getSectionImages } from "@/lib/supabasedb"
import type { SiteImageData } from "@/lib/supabasedb"
import Autoplay from "embla-carousel-autoplay"

// Create autoplay plugin factory function
const createAutoplayPlugin = () =>
  Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: false })

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
    queryKey: ["sectionImages", sections.join(",")], // Stable query key
    queryFn: () => getSectionImages(sections),
    enabled: sections.length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
  // if (error) console.error(`Error fetching images for ${sections.join(", ")}:`, error) // Keep error logging commented/removed if desired
  return { images: data, isLoading, error }
}

const PackageThreePage: React.FC = () => {
  const seoData = {
    title: "Séance Photo Bébé - MOM.B Photographie | Photos nouveau-né et enfants",
    description:
      "Séance photo bébé et nouveau-né professionnelle. Immortalisez les premiers moments de votre enfant. Douceur et sécurité garanties.",
    keywords: "séance photo bébé, photographe nouveau-né, photos enfants, shooting bébé, newborn",
    url: "https://www.momb-photographie.fr/bebe",
    structuredData: {
      type: "Service",
      name: "Séance Photo Bébé",
      description: "Séance photo professionnelle pour bébés et nouveau-nés",
      provider: "MOM.B Photographie",
      serviceType: "Photographie de nouveau-né",
    },
  }
  // Define the sections for images needed on this page
  const imageSections = useMemo(() => ["bebe-0", "bebe-1", "bebe-2", "bebe-3"], [])

  const { images: sectionImages, isLoading: imagesLoading, error: imagesError } = useSectionImagesQuery(imageSections)

  // Helper to get specific image data safely
  const getImageData = useCallback(
    (section: string): SiteImageData | null | undefined => {
      return sectionImages?.[section]
    },
    [sectionImages]
  )

  // Fetch text data for the three sections
  const { text: bebeText1, isLoading: textLoading1, error: textError1 } = useSectionTextQuery("bebetext1")
  const { text: bebeText2, isLoading: textLoading2, error: textError2 } = useSectionTextQuery("bebetext2")
  const { text: bebeText3, isLoading: textLoading3, error: textError3 } = useSectionTextQuery("bebetext3")
  const {
    text: bebeInclusionsText,
    isLoading: inclusionsLoading,
    error: inclusionsError,
  } = useSectionTextQuery("bebe-inclusions")
  const { text: bebePrice1Text, isLoading: price1Loading, error: price1Error } = useSectionTextQuery("bebe-price1")
  const {
    text: bebePrice1DetailsText,
    isLoading: price1DetailsLoading,
    error: price1DetailsError,
  } = useSectionTextQuery("bebe-price1-details")
  const { text: bebePrice2Text, isLoading: price2Loading, error: price2Error } = useSectionTextQuery("bebe-price2")
  const {
    text: bebePrice2DetailsText,
    isLoading: price2DetailsLoading,
    error: price2DetailsError,
  } = useSectionTextQuery("bebe-price2-details")

  // Carousel state and autoplay
  const [carouselApi, setCarouselApi] = useState<UseEmblaCarouselType[1] | undefined>()
  const autoplayPlugin = useMemo(() => createAutoplayPlugin(), [])

  // Start autoplay when component mounts
  useEffect(() => {
    if (carouselApi) {
      carouselApi.plugins().autoplay?.play()
    }
  }, [carouselApi])

  // Define static data
  const packageStaticData = useMemo(
    () => ({
      title: "Bébé et nous",
    }),
    []
  )

  // Handle combined loading state
  const isLoading =
    imagesLoading ||
    textLoading1 ||
    textLoading2 ||
    textLoading3 ||
    inclusionsLoading ||
    price1Loading ||
    price1DetailsLoading ||
    price2Loading ||
    price2DetailsLoading
  const hasError =
    imagesError ||
    textError1 ||
    textError2 ||
    textError3 ||
    inclusionsError ||
    price1Error ||
    price1DetailsError ||
    price2Error ||
    price2DetailsError

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>
  }

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-600">
        Erreur lors du chargement des données. Veuillez réessayer plus tard.
      </div>
    )
  }

  return (
    <div className="animate-fade-in bg-white">
      <SEOHead {...seoData} />
      {/* Title Section */}
      <section className="py-16">
        <div className="sakura-container text-center">
          <h1 className="mb-4 mt-12 font-bad-script text-4xl font-bold tracking-widest text-gray-900 md:text-5xl">
            {packageStaticData.title}
          </h1>
          <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
        </div>
      </section>

      {/* Main Content Section with Carousel and Text */}
      <section className="py-16">
        <div className="sakura-container">
          <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start">
            {/* Carousel Section */}
            <div className="w-full lg:w-1/2">
              <Carousel className="w-full" plugins={[autoplayPlugin]} opts={{ loop: true }} setApi={setCarouselApi}>
                <CarouselContent>
                  {imageSections.map((sectionKey, index) => {
                    const imgData = getImageData(sectionKey)
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
                              alt={imgData.alt_text || `bebe ${index}`}
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

            {/* Text Content Section */}
            <div className="w-full lg:w-1/2 lg:pl-16">
              <div className="space-y-8">
                {/* Text Area 1 */}
                <div>
                  <p className="text-lg italic leading-relaxed text-[#623E2A] md:text-xl">
                    {bebeText1 ?? "Chargement du texte..."}
                  </p>
                </div>

                {/* Text Area 2 */}
                <div>
                  <p className="text-lg leading-relaxed text-[#623E2A] md:text-xl">
                    {bebeText2 ?? "Chargement du texte..."}
                  </p>
                </div>

                {/* Text Area 3 */}
                <div>
                  <p className="text-lg italic leading-relaxed text-sakura-pink md:text-xl">
                    {bebeText3 ?? "Chargement du texte..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inclusions & Pricing Section */}
      <section className="bg-gray-50 py-16">
        <div className="sakura-container">
          <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-center font-bad-script text-4xl font-bold tracking-widest text-gray-900 underline">
              Ce qui est inclus
            </h2>
            <ul className="mb-8 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
              {(bebeInclusionsText ?? "Chargement des inclusions...").split(";").map((item, index) => (
                <li key={index} className="flex items-start">
                  <FaCheck size={18} className="mr-3 mt-1 flex-shrink-0 text-sakura-pink" />
                  <span className="text-gray-700">{item.trim()}</span>
                </li>
              ))}
            </ul>

            <div className="mb-8 border-t border-gray-200 pt-6">
              <div className="flex flex-col gap-8 md:flex-row md:justify-around">
                {/* Tarif Section */}
                <div className="text-center md:w-1/2">
                  <h3 className="mb-4 font-bad-script text-3xl font-bold tracking-wider text-gray-900 underline">
                    Tarif
                  </h3>
                  <p className="text-4xl font-bold text-gray-900">{bebePrice1Text ?? "Chargement..."}</p>
                  <p className="mt-1 text-gray-600">{bebePrice1DetailsText ?? "Chargement..."}</p>
                </div>

                {/* Pack grossesse + bébé Section */}
                <div className="text-center md:w-1/2">
                  <h3 className="mb-4 font-bad-script text-3xl font-bold tracking-wider text-gray-900 underline">
                    Pack grossesse + bébé
                  </h3>
                  {bebePrice2Text ? (
                    <p className="text-4xl font-bold text-gray-900">
                      {bebePrice2Text.includes("(")
                        ? bebePrice2Text.substring(0, bebePrice2Text.indexOf("(")).trim()
                        : bebePrice2Text}{" "}
                      {bebePrice2Text.includes("(") && (
                        <span className="line-through">{bebePrice2Text.substring(bebePrice2Text.indexOf("("))}</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-4xl font-bold text-gray-900">Chargement...</p>
                  )}
                  <p className="mt-1 text-gray-600">{bebePrice2DetailsText ?? "Chargement..."}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/contact"
                className="mt-auto inline-block w-full rounded-md bg-sakura-pink px-8 py-3 text-center font-medium text-white transition-colors duration-100 text-shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-sakura-pink focus:ring-offset-2 sm:w-auto">
                Réserver cette séance
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PackageThreePage
