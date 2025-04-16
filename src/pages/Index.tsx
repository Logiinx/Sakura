/**
 * src/pages/Index.tsx
 * 
 * This component renders the homepage of the application.
 * It includes sections like Hero, About, Featured Gallery, and a Call to Action.
 */

import React from 'react';
// Import Link for internal navigation.
import { Link } from 'react-router-dom';
// Import icons from lucide-react.
import { Camera, Clock, Heart, Award } from 'lucide-react';
import logo from '@/assets/logomom.png'; // Import the logo

// Define the Index page component.
const Index: React.FC = () => {
  return (
    // Apply a fade-in animation to the entire page content.
    <div className="animate-fade-in">
      {/* --- Hero Section --- */}
      {/* `relative` allows absolute positioning of children. `h-screen` makes it full viewport height. */}
      {/* `flex items-center` vertically centers the content. */}
      <section className="relative h-screen flex items-center">
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
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
            <img src={logo} alt="Sakura Lens Logo"  /> {/* Use the imported logo */}
          </h1>
          {/* Subheading/Tagline: Lighter font weight. */}
          <p className="flex justify-center text-2xl mb-8 max-w-lg font-bad-script tracking-widest">
            Bienvenue sur MOM.B
          </p>
          {/* Call to Action Button: Uses the custom `sakura-btn` style and `hover-float` animation. */}
          <Link to="/book-now" className="sakura-btn px-1 py-2 flex justify-center hover-float">
            Book a Session
          </Link>
        </div>
      </section>
      
      {/* --- About Section --- */}
      {/* Provides padding top/bottom (`py-20 md:py-28`). White background. */}
      <section className="py-20 md:py-28 bg-white">
        <div className="sakura-container">
          {/* Section Heading Area */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Our Vision</h2>
            {/* Custom pink divider line (defined in index.css). */}
            <div className="section-divider"></div>
          </div>
          
          {/* Grid for Vision Points */}
          {/* Responsive grid: 1 column on small, 2 on medium, 4 on large screens. `gap-10` adds space between items. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Vision Point 1: Elegance */}
            {/* `p-6` padding, `text-center`, `hover-scale` animation. */}
            <div className="p-6 text-center hover-scale">
              {/* Icon Container: Circular background, centered icon. */}
              <div className="w-14 h-14 bg-sakura-light-pink rounded-full flex items-center justify-center mx-auto mb-5">
                <Camera className="text-sakura-pink" aria-hidden="true" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-3">Elegance</h3>
              <p className="text-gray-600">Clean and minimalist compositions that highlight the subject.</p>
            </div>
            
            {/* Vision Point 2: Timing */}
            <div className="p-6 text-center hover-scale">
              <div className="w-14 h-14 bg-sakura-light-pink rounded-full flex items-center justify-center mx-auto mb-5">
                <Clock className="text-sakura-pink" aria-hidden="true" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-3">Timing</h3>
              <p className="text-gray-600">Capturing those fleeting moments that tell your unique story.</p>
            </div>
            
            {/* Vision Point 3: Emotion */}
            <div className="p-6 text-center hover-scale">
              <div className="w-14 h-14 bg-sakura-light-pink rounded-full flex items-center justify-center mx-auto mb-5">
                <Heart className="text-sakura-pink" aria-hidden="true" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-3">Emotion</h3>
              <p className="text-gray-600">Emphasizing genuine emotions and authentic connections.</p>
            </div>
            
            {/* Vision Point 4: Quality */}
            <div className="p-6 text-center hover-scale">
              <div className="w-14 h-14 bg-sakura-light-pink rounded-full flex items-center justify-center mx-auto mb-5">
                <Award className="text-sakura-pink" aria-hidden="true" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-3">Quality</h3>
              <p className="text-gray-600">Professional retouching and high-resolution delivery.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* --- Featured Work Section --- */}
      {/* Light gray background (`bg-sakura-light-gray`). */}
      <section className="py-20 md:py-28 bg-sakura-light-gray">
        <div className="sakura-container">
          {/* Section Heading Area */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Gallery</h2>
            <div className="section-divider"></div>
          </div>
          
          {/* Image Grid */}
          {/* Responsive grid: 1 column default, 2 on small, 3 on large screens. `gap-8` for spacing. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Image Item 1 */} 
            {/* `overflow-hidden rounded-md` clips the image to rounded corners. `hover-scale` adds subtle zoom container. */}
            <div className="overflow-hidden rounded-md hover-scale">
              {/* NOTE: Alt text should be more descriptive if possible. Image URLs could be dynamic. */}
              <img 
                src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80" 
                alt="Orange flowers field during daytime" 
                className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105" // Image scales on container hover
                loading="lazy" // Add lazy loading for images below the fold
              />
            </div>
            {/* Image Item 2 */}
            <div className="overflow-hidden rounded-md hover-scale">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" 
                alt="Scenic landscape view of mountains and lake" 
                className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            {/* Image Item 3 */}
            <div className="overflow-hidden rounded-md hover-scale">
              <img 
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80" 
                alt="Mountain valley with river and green foliage" 
                className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Link to Full Gallery */}
          <div className="text-center mt-14">
            {/* Button styled with border, pink text, hover effect changes background/text color. */}
            <Link to="/gallery" className="px-6 py-3 border border-sakura-pink text-sakura-pink rounded-md hover:bg-sakura-pink hover:text-white transition-all duration-300 font-medium hover-float">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>
      
      {/* --- Call to Action (CTA) Section --- */}
      <section className="py-20 md:py-28 bg-white">
        <div className="sakura-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Session?</h2>
          <div className="section-divider"></div>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto mt-6">
            Let us help you capture memories that bloom eternally.
          </p>
          {/* Uses the main `sakura-btn` style. */}
          <Link to="/book-now" className="sakura-btn inline-block hover-float">
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

// Export the Index component for use in App.tsx (routing).
export default Index;
