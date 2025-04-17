/**
 * src/components/home/HeroSection.tsx
 *
 * Hero section component for the homepage.
 * Displays a full-screen background image with overlay, title, tagline, and CTA button.
 */

import React from "react"
import { Link } from "react-router-dom"

// NOTE: Consider moving this URL to a central configuration or constants file.
const HERO_BACKGROUND_URL =
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80"

const HeroSection: React.FC = () => {
  return (
    // `relative` allows absolute positioning of children. `h-screen` makes it full viewport height.
    // `flex items-center` vertically centers the content.
    <section className="relative flex h-screen items-center">
      {/* Background Image Container */}
      {/* `absolute inset-0` makes it fill the parent section. */}
      {/* `bg-[url(...)] bg-cover bg-center` sets the background image, ensures it covers the area, and centers it. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_BACKGROUND_URL}')` }} // Set background using inline style for clarity
      >
        {/* Dark Overlay: Adds a semi-transparent black layer over the background image for better text contrast. */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      {/* Hero Content Container */}
      {/* `sakura-container` provides consistent padding/max-width. */}
      {/* `relative z-10` ensures content appears above the background and overlay. */}
      {/* `text-white` sets text color for contrast against the dark overlay. */}
      <div className="sakura-container relative z-10 text-white">
        {/* Main Heading: Uses Playfair Display font (from Layout/index.css). Responsive text size. */}
        <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-7xl">Sakura Lens</h1>
        {/* Subheading/Tagline: Lighter font weight. */}
        <p className="mb-8 max-w-lg text-lg font-light md:text-xl">
          Capturing moments with the delicate beauty of cherry blossoms.
        </p>
        {/* Call to Action Button: Uses the custom `sakura-btn` style and `hover-float` animation. */}
        <Link to="/book-now" className="sakura-btn hover-float inline-block">
          Book a Session
        </Link>
      </div>
    </section>
  )
}

export default HeroSection
