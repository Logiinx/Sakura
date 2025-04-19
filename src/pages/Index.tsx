import React from "react"
// Import Link for internal navigation.
import { Link } from "react-router-dom"

import maternityImage from "@/assets/FC7A0306-768x512.jpg" // Import the maternity image
import complicesImage from "@/assets/FC7A0424-scaled-r3ruxwf3ztp2vnsm7azxhjpeinnhvhn4hg4xhujiiw.jpg" // Import the complices image
import familyImage from "@/assets/FC7A1564-768x512.jpg" // Import the family image
import babyImage from "@/assets/FC7A8567-1024x683.jpg" // Import the baby image
/**
 * src/pages/Index.tsx
 *
 * This component renders the homepage of the application.
 * It includes sections like Hero, About, Featured Gallery, and a Call to Action.
 */
import logo from "@/assets/logomom.png" // Import the logo
import { ResponsiveImage } from "@/components/ResponsiveImage"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import Autoplay from "embla-carousel-autoplay"

// Create autoplay plugin factory function
const createAutoplayPlugin = () => Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })

// Define the Index page component.
const Index: React.FC = () => {
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
        <div className="absolute inset-0 bg-[url('@/assets/cropped-FC7A0286-2-scaled-1.jpg')] bg-cover bg-center">
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
            <img src={logo} alt="Sakura Lens Logo" /> {/* Use the imported logo */}
          </h1>
          {/* Subheading/Tagline: Lighter font weight. */}
          <p className="mb-8 flex max-w-lg justify-center font-bad-script text-2xl tracking-widest">
            Bienvenue sur MOM.B
          </p>
          {/* Call to Action Button: Uses the custom `sakura-btn` style and `hover-float` animation. */}
          <Link
            to="/book-now"
            className="sakura-btn hover-float text-shadow-md flex justify-center px-1 py-2 shadow-md">
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
                  Chez vous dans votre cocon, ou en extérieur, je vous propose une douce séance pour immortaliser ces 9
                  mois de bonheur et de découverte
                </p>
                <Link to="/book-now" className="sakura-btn hover-float text-shadow-md inline-block">
                  EN SAVOIR PLUS
                </Link>
              </div>
              <div ref={maternityCarouselRef} className="slide-hidden slide-from-right w-full lg:w-1/2">
                <Carousel className="w-full" plugins={[maternityAutoplay]}>
                  <CarouselContent>
                    <CarouselItem>
                      <ResponsiveImage src={maternityImage} alt="Maternity session on beach" />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage src={maternityImage} alt="Indoor maternity session" />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage src={maternityImage} alt="Natural light maternity" />
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
                      <ResponsiveImage src={familyImage} alt="Family session" />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage src={familyImage} alt="Family outdoor session" />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage src={familyImage} alt="Family lifestyle" />
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
                  Au cœur même de votre quotidien chez vous ou petite escapade en extérieur, c&apos;est vous qui décidez
                  !
                </p>
                <Link to="/book-now" className="sakura-btn hover-float text-shadow-md inline-block">
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
                <p className="text-warm-gray-600 mb-6 text-lg leading-relaxed text-[#623E2A] md:text-xl">
                  Capturer chaque émotion, chaque détail de votre bébé.
                </p>
                <Link to="/book-now" className="sakura-btn hover-float text-shadow-md inline-block">
                  EN SAVOIR PLUS
                </Link>
              </div>
              <div ref={babyCarouselRef} className="slide-hidden slide-from-right w-full lg:w-1/2">
                <Carousel className="w-full" plugins={[babyAutoplay]}>
                  <CarouselContent>
                    <CarouselItem>
                      <ResponsiveImage src={babyImage} alt="Baby portrait" />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage src={babyImage} alt="Baby with family" />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage src={babyImage} alt="Baby details" />
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
                      <ResponsiveImage src={complicesImage} alt="Parent-child moment" />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage src={complicesImage} alt="Special bond" />
                    </CarouselItem>
                    <CarouselItem>
                      <ResponsiveImage src={complicesImage} alt="Tender moments" />
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
                  En couple, entre mère et fille, entre père et fils ou l&apos;inverse, partagez une séance à deux.
                </p>
                <Link to="/book-now" className="sakura-btn hover-float text-shadow-md inline-block">
                  EN SAVOIR PLUS
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* --- Featured Work Section --- */}
      {/* Light gray background (`bg-sakura-light-gray`). */}
      <section className="bg-sakura-light-gray py-20 md:py-28">
        <div className="sakura-container">
          {/* Section Heading Area */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Featured Gallery</h2>
            <div className="section-divider"></div>
          </div>

          {/* Image Grid */}
          {/* Responsive grid: 1 column default, 2 on small, 3 on large screens. `gap-8` for spacing. */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Image Item 1 */}
            {/* `overflow-hidden rounded-md` clips the image to rounded corners. `hover-scale` adds subtle zoom container. */}
            <div className="hover-scale overflow-hidden rounded-md">
              {/* NOTE: Alt text should be more descriptive if possible. Image URLs could be dynamic. */}
              <img
                src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80"
                alt="Orange flowers field during daytime"
                className="h-80 w-full object-cover transition-transform duration-700 hover:scale-105" // Image scales on container hover
                loading="lazy" // Add lazy loading for images below the fold
              />
            </div>
            {/* Image Item 2 */}
            <div className="hover-scale overflow-hidden rounded-md">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                alt="Scenic landscape view of mountains and lake"
                className="h-80 w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            {/* Image Item 3 */}
            <div className="hover-scale overflow-hidden rounded-md">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80"
                alt="Mountain valley with river and green foliage"
                className="h-80 w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* Link to Full Gallery */}
          <div className="mt-14 text-center">
            {/* Button styled with border, pink text, hover effect changes background/text color. */}
            <Link
              to="/gallery"
              className="hover-float rounded-md border border-sakura-pink px-6 py-3 font-medium text-sakura-pink transition-all duration-300 hover:bg-sakura-pink hover:text-white">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* --- Call to Action (CTA) Section --- */}
      <section className="bg-white py-20 md:py-28">
        <div className="sakura-container text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready for Your Session?</h2>
          <div className="section-divider"></div>
          <p className="mx-auto mb-8 mt-6 max-w-lg text-lg text-gray-600">
            Let us help you capture memories that bloom eternally.
          </p>
          {/* Uses the main `sakura-btn` style. */}
          <Link to="/book-now" className="sakura-btn hover-float text-shadow-md inline-block">
            Disponibilités
          </Link>
        </div>
      </section>
    </div>
  )
}

// Export the Index component for use in App.tsx (routing).
export default Index
