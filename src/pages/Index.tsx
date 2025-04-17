import React from "react"
import { FaCamera, FaClock, FaHeart, FaAward } from "react-icons/fa"
// Import Link for internal navigation.
import { Link } from "react-router-dom"

/**
 * src/pages/Index.tsx
 *
 * This component renders the homepage of the application.
 * It includes sections like Hero, About, Featured Gallery, and a Call to Action.
 */
import logo from "@/assets/logomom.png" // Import the logo

// Define the Index page component.
const Index: React.FC = () => {
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center">
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
          <Link to="/book-now" className="sakura-btn hover-float flex justify-center px-1 py-2">
            Book a Session
          </Link>
        </div>
      </section>

      {/* --- About Section --- */}
      {/* Provides padding top/bottom (`py-20 md:py-28`). White background. */}
      <section className="bg-white py-20 md:py-28">
        <div className="sakura-container">
          {/* Section Heading Area */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Our Vision</h2>
            {/* Custom pink divider line (defined in index.css). */}
            <div className="section-divider"></div>
          </div>

          {/* Grid for Vision Points */}
          {/* Responsive grid: 1 column on small, 2 on medium, 4 on large screens. `gap-10` adds space between items. */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Vision Point 1: Elegance */}
            {/* `p-6` padding, `text-center`, `hover-scale` animation. */}
            <div className="hover-scale p-6 text-center">
              {/* Icon Container: Circular background, centered icon. */}
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sakura-light-pink">
                <FaCamera className="text-sakura-pink" aria-hidden="true" />
              </div>
              <h3 className="mb-3 font-playfair text-xl font-bold">Elegance</h3>
              <p className="text-gray-600">Clean and minimalist compositions that highlight the subject.</p>
            </div>

            {/* Vision Point 2: Timing */}
            <div className="hover-scale p-6 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sakura-light-pink">
                <FaClock className="text-sakura-pink" aria-hidden="true" />
              </div>
              <h3 className="mb-3 font-playfair text-xl font-bold">Timing</h3>
              <p className="text-gray-600">Capturing those fleeting moments that tell your unique story.</p>
            </div>

            {/* Vision Point 3: Emotion */}
            <div className="hover-scale p-6 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sakura-light-pink">
                <FaHeart className="text-sakura-pink" aria-hidden="true" />
              </div>
              <h3 className="mb-3 font-playfair text-xl font-bold">Emotion</h3>
              <p className="text-gray-600">Emphasizing genuine emotions and authentic connections.</p>
            </div>

            {/* Vision Point 4: Quality */}
            <div className="hover-scale p-6 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sakura-light-pink">
                <FaAward className="text-sakura-pink" aria-hidden="true" />
              </div>
              <h3 className="mb-3 font-playfair text-xl font-bold">Quality</h3>
              <p className="text-gray-600">Professional retouching and high-resolution delivery.</p>
            </div>
          </div>
        </div>
      </section>

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
          <Link to="/book-now" className="sakura-btn hover-float inline-block">
            Book Now
          </Link>
        </div>
      </section>
    </div>
  )
}

// Export the Index component for use in App.tsx (routing).
export default Index
