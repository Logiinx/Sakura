import React from "react"
import { useEffect, useState } from "react"
import { BiBriefcaseAlt2 } from "react-icons/bi"
import { BsHouseDoor } from "react-icons/bs"
import { HiOutlineSparkles } from "react-icons/hi"
// Import Link for internal navigation.
import { Link } from "react-router-dom"

import { ResponsiveImage } from "@/components/ResponsiveImage"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { getSectionText } from "@/lib/supabasedb"
import Autoplay from "embla-carousel-autoplay"
/**
 * src/pages/Index.tsx
 *
 * This component renders the homepage of the application.
 * It includes sections like Hero, About, Featured Gallery, and a Call to Action.
 */

// Create autoplay plugin factory function
const createAutoplayPlugin = () => Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })

//Supabase Section Text
function useSectionText(section: string) {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    getSectionText(section).then(setText)
  }, [section])

  return text
}

// Define the Index page component.
const Index: React.FC = () => {
  //SUPABASE SECTION TEXT
  const grossesseText = useSectionText("grossesse")
  const familleText = useSectionText("famille")
  const bebeText = useSectionText("bebe")
  const complicesText = useSectionText("complices")
  const aproposdeMoiText = useSectionText("aproposdemoi")

  // Create refs for each section
  const maternityTextRef = useScrollAnimation()
  const maternityCarouselRef = useScrollAnimation()
  const familyTextRef = useScrollAnimation()
  const familyCarouselRef = useScrollAnimation()
  const babyTextRef = useScrollAnimation()
  const babyCarouselRef = useScrollAnimation()
  const complicesTextRef = useScrollAnimation()
  const complicesCarouselRef = useScrollAnimation()

  // Create separate autoplay plugin instances for each carousel
  const maternityAutoplay = React.useMemo(() => createAutoplayPlugin(), [])
  const familyAutoplay = React.useMemo(() => createAutoplayPlugin(), [])
  const babyAutoplay = React.useMemo(() => createAutoplayPlugin(), [])
  const complicesAutoplay = React.useMemo(() => createAutoplayPlugin(), [])

  return (
    // Apply a fade-in animation to the entire page content.
    <div className="animate-fade-in">
      {/* --- Hero Section --- */}
      {/* `relative` allows absolute positioning of children. `h-screen` makes it full viewport height. */}
      {/* `flex items-center` vertically centers the content. */}
      <section className="relative flex h-screen items-center">
        {/* Background Image Container */}
        {/* `absolute inset-0` makes it fill the parent section. */}
        {/* `bg-[url(...)] bg-cover bg-center` sets the background image, ensures it covers the area, and centers it. */}
        {/* NOTE: Consider moving the background image URL to a constant or configuration file for easier updates. */}
        {/* <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"> */}
        <div className="absolute inset-0 bg-[url('https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/homepage.jpg')] bg-cover bg-center">
          {/* Dark Overlay: Adds a semi-transparent black layer over the background image for better text contrast. */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        {/* Hero Content Container */}
        {/* `sakura-container` provides consistent padding/max-width. */}
        {/* `relative z-10` ensures content appears above the background and overlay. */}
        {/* `text-white` sets text color for contrast against the dark overlay. */}
        <div className="sakura-container relative z-10 text-white">
          {/* Main Heading: Uses Playfair Display font (from Layout/index.css). Responsive text size. */}
          <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-7xl">
            <img
              src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/logomom.png"
              alt="Mom.B Logo"
              className="mx-auto"
              loading="eager"
            />
          </h1>
          {/* Subheading/Tagline: Lighter font weight. */}
          <p className="mb-8 flex max-w-lg justify-center font-bad-script text-2xl tracking-widest">
            Bienvenue sur MOM.B
          </p>
          {/* Call to Action Button: Uses the custom `sakura-btn` style and `hover-float` animation. */}
          <Link
            to="/book-now"
            className="sakura-btn hover-float flex justify-center px-1 py-2 shadow-md text-shadow-md">
            Prendre rendez-vous
          </Link>
        </div>
      </section>

      {/* --- Photography Services Sections --- */}
      <div className="w-full">
        {/* Maternity Photography */}
        <section className="w-full bg-white py-32 md:py-40">
          <div className="sakura-container">
            <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start">
              <div ref={maternityTextRef} className="slide-hidden slide-from-left w-full lg:w-1/2 lg:pr-16">
                <h2 className="text-warm-gray-800 mb-4 font-bad-script text-4xl font-bold leading-relaxed tracking-widest md:text-5xl">
                  La beauté de la grossesse
                </h2>
                <p className="text-warm-gray-600 mb-6 text-lg leading-relaxed text-[#623E2A] md:text-xl">
                  {grossesseText}
                </p>
                <Link to="/book-now" className="sakura-btn hover-float inline-block text-shadow-md">
                  EN SAVOIR PLUS
                </Link>
              </div>
              <div ref={maternityCarouselRef} className="slide-hidden slide-from-right w-full lg:w-1/2">
                <Carousel className="w-full" plugins={[maternityAutoplay]}>
                  <CarouselContent>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/grossesse/grossesse1.jpg"
                        alt="Maternity session on beach"
                        loading="lazy"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/grossesse/grossesse2.jpg"
                        alt="Indoor maternity session"
                        loading="lazy"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/grossesse/grossesse3.jpg"
                        alt="Natural light maternity"
                        loading="lazy"
                      />
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        </section>

        {/* Family Photography */}
        <section className="w-full bg-[#f8f8f8] py-32 md:py-40">
          <div className="sakura-container">
            <div className="flex flex-col-reverse items-center gap-16 lg:flex-row lg:items-start">
              <div ref={familyCarouselRef} className="slide-hidden slide-from-left w-full lg:w-1/2">
                <Carousel className="w-full" plugins={[familyAutoplay]}>
                  <CarouselContent>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/famille/famille1.jpg"
                        alt="Family session"
                        loading="lazy"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/famille/famille2.jpg"
                        alt="Family outdoor session"
                        loading="lazy"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/famille/famille3.jpg"
                        alt="Family lifestyle"
                        loading="lazy"
                      />
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div ref={familyTextRef} className="slide-hidden slide-from-right w-full lg:w-1/2 lg:pl-16">
                <h2 className="text-warm-gray-800 mb-4 font-bad-script text-4xl font-bold leading-relaxed tracking-widest md:text-5xl">
                  Moments en Famille
                </h2>
                <p className="text-warm-gray-600 mb-6 text-lg leading-relaxed text-[#623E2A] md:text-xl">
                  {familleText}
                </p>
                <Link to="/book-now" className="sakura-btn hover-float inline-block text-shadow-md">
                  EN SAVOIR PLUS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Baby Photography */}
        <section className="w-full bg-white py-32 md:py-40">
          <div className="sakura-container">
            <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start">
              <div ref={babyTextRef} className="slide-hidden slide-from-left w-full lg:w-1/2 lg:pr-16">
                <h2 className="text-warm-gray-800 mb-4 font-bad-script text-4xl font-bold leading-relaxed tracking-widest md:text-5xl">
                  Bébé & nous
                </h2>
                <p className="text-warm-gray-600 mb-6 text-lg leading-relaxed text-[#623E2A] md:text-xl">{bebeText}</p>
                <Link to="/book-now" className="sakura-btn hover-float inline-block text-shadow-md">
                  EN SAVOIR PLUS
                </Link>
              </div>
              <div ref={babyCarouselRef} className="slide-hidden slide-from-right w-full lg:w-1/2">
                <Carousel className="w-full" plugins={[babyAutoplay]}>
                  <CarouselContent>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/bebe/bebe1.jpg"
                        alt="Baby portrait"
                        loading="lazy"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/bebe/bebe2.jpg"
                        alt="Baby with family"
                        loading="lazy"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/bebe/bebe3.jpg"
                        alt="Baby details"
                        loading="lazy"
                      />
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        </section>

        {/* Complices Photography */}
        <section className="w-full bg-[#f8f8f8] py-32 md:py-40">
          <div className="sakura-container">
            <div className="flex flex-col-reverse items-center gap-16 lg:flex-row lg:items-start">
              <div ref={complicesCarouselRef} className="slide-hidden slide-from-left w-full lg:w-1/2">
                <Carousel className="w-full" plugins={[complicesAutoplay]}>
                  <CarouselContent>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/complices/complices1.jpg"
                        alt="Parent-child moment"
                        loading="lazy"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/complices/complices2.jpg"
                        alt="Special bond"
                        loading="lazy"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage
                        src="https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/complices/complices3.jpg"
                        alt="Tender moments"
                        loading="lazy"
                      />
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div ref={complicesTextRef} className="slide-hidden slide-from-right w-full lg:w-1/2 lg:pl-16">
                <h2 className="text-warm-gray-800 mb-4 font-bad-script text-4xl font-bold leading-relaxed tracking-widest md:text-5xl">
                  Complices à deux
                </h2>
                <p className="text-warm-gray-600 mb-6 text-lg leading-relaxed text-[#623E2A] md:text-xl">
                  {complicesText}
                </p>
                <Link to="/book-now" className="sakura-btn hover-float inline-block text-shadow-md">
                  EN SAVOIR PLUS
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="section-divider"></div>
      {/* --- About Me Section --- */}
      <section className="bg-sakura-pink bg-opacity-30 py-20 md:py-20">
        <div className="sakura-container">
          {/* Section Heading Area */}
          <div className="mb-16 text-center">
            <h2 className="relative mb-6 font-bad-script text-4xl font-bold tracking-widest md:text-6xl">
              À propos de moi
            </h2>
            <div className="section-divider"></div>
          </div>

          {/* About Me Content */}
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <div className="prose prose-lg mx-auto text-xl">
                <p className="whitespace-pre-line">{aproposdeMoiText}</p>
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
                to="/book-now"
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
