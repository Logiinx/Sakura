/**
 * src/components/Layout.tsx
 * 
 * This component defines the main layout structure for the application,
 * including the header, main content area, and footer.
 * It handles responsive navigation and changes header appearance on scroll.
 */

import React, { useState, useEffect } from 'react';
// Import components from react-router-dom for navigation and rendering page content.
// Link: Basic navigation link.
// NavLink: Special link that knows if it's "active" (matches the current URL).
// Outlet: Placeholder where nested route components (pages) will be rendered.
// useLocation: Hook to get information about the current URL.
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
// Import icons from lucide-react library.
import { Menu, X, Instagram, Facebook, Twitter } from 'lucide-react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
library.add(faFacebook, faInstagram, faWhatsapp);
// --- Component Definition --- //

// Define the Layout component as a Functional Component (React.FC).
const Layout: React.FC = () => {
  // --- State --- //
  // State to track if the mobile menu is open or closed.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to track if the page has been scrolled down.
  const [isScrolled, setIsScrolled] = useState(false);

  // Get the current location object (contains pathname, search, etc.).
  const location = useLocation();

  // --- Handlers --- //
  // Function to toggle the mobile menu state.
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // --- Effects --- //
  // Effect to close the mobile menu whenever the route changes.
  useEffect(() => {
    // Check if the menu is currently open before closing it.
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // Run this effect whenever the location.pathname changes.
  }, [location.pathname, isMenuOpen]); // Added isMenuOpen to dependencies for completeness

  // Effect to detect scroll position and update the `isScrolled` state.
  useEffect(() => {
    // Function to handle the scroll event.
    const handleScroll = () => {
      // Set `isScrolled` to true if user has scrolled more than 50 pixels down, false otherwise.
      setIsScrolled(window.scrollY > 50);
    };

    // Add the scroll event listener when the component mounts.
    window.addEventListener('scroll', handleScroll);

    // Cleanup function: Remove the scroll event listener when the component unmounts.
    // This prevents memory leaks.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // Empty dependency array `[]` means this effect runs only once on mount and cleanup on unmount.
  }, []);

  // --- Helper Function for NavLink ClassNames --- //
  // This function generates the appropriate className string for NavLinks,
  // handling both active state and scrolled state.
  const getNavLinkClass = (isActive: boolean): string => {
    // Adjusted padding to match "Book Now" button (py-2 px-5). Kept border logic.
    const baseClasses = "px-3 py-2 rounded-md border border-transparent hover:border-sakura-pink hover:text-white hover:bg-sakura-pink hover:bg-opacity-90 transition-colors";
    const textClass = isScrolled ? 'text-sakura-dark-text' : 'text-white';
    const activeClass = isActive ? 'font-medium text-sakura-pink border-sakura-pink' : ''; // Active links get pink color and border directly
    
    // Combine classes, ensuring active pink overrides the scrolled text color if needed.
    // Active state explicitly sets border-sakura-pink
    return `${baseClasses} ${isActive ? activeClass : textClass}`;
  };

  const getMobileNavLinkClass = (isActive: boolean): string => {
    return isActive 
      ? "text-sakura-pink font-medium text-xl" 
      : "text-xl text-sakura-dark-text hover:text-sakura-pink transition-colors";
  };


  // --- Render --- //
  return (
    // Main container div, uses flexbox to ensure footer sticks to the bottom.
    <div className="flex flex-col min-h-screen bg-sakura-light-gray">
      {/* --- Header --- */}
      {/* `fixed` positions the header relative to the viewport. */}
      {/* `top-0 left-0 right-0` stretches it across the top. */}
      {/* `z-50` ensures it stays above other content. */}
      {/* `transition-all duration-300` applies smooth transitions to changes (like background). */}
      {/* Conditional background/styling based on `isScrolled` state. */}
      <header
        className={`py-5 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white bg-opacity-90 backdrop-blur-sm shadow-sm' // Scrolled: White, blurred background, shadow
            : 'bg-transparent' // Top: Transparent background
        }`}
      >
        {/* Use the custom container class for consistent padding and max-width. */}
        <div className="sakura-container flex justify-between items-center">
          {/* Logo/Brand Name - Links to homepage */}
          <Link
            to="/"
            className={`font-playfair text-2xl font-bold transition-colors ${
              isScrolled ? 'text-sakura-dark-text' : 'text-white' // Text color changes on scroll
            }`}
          >
            <img 
              src="./src/assets/logorose-300x155.png" 
              alt="MOM.B Logo" 
              className={`transition-all duration-300 ${
                isScrolled ? 'h-10 w-auto' : 'h-16 w-auto' // Larger when not scrolled, smaller when scrolled
              }`} 
            />
          </Link>

          {/* --- Mobile Menu Button --- */}
          {/* `md:hidden` makes this button visible only on small screens (up to medium). */}
          <button
            className={`md:hidden p-1 rounded transition-colors ${
              isScrolled ? 'text-sakura-dark-text hover:bg-gray-100' : 'text-white hover:bg-white/20'
            }`}
            onClick={toggleMenu} // Calls the handler to open/close the menu
            aria-label="Toggle mobile menu" // Accessibility label for screen readers
            aria-expanded={isMenuOpen} // Indicate if the menu is expanded
          >
            {/* Show X icon when menu is open, Menu icon when closed. */}
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>

          {/* --- Desktop Navigation --- */}
          {/* `hidden md:flex` makes this nav visible only on medium screens and larger. */}
          <nav className="hidden md:flex items-center space-x-10">
            {/* Use NavLink for items that should highlight when active. */}
            <NavLink to="/" className={({ isActive }) => getNavLinkClass(isActive)}>
              Home
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => getNavLinkClass(isActive)}>
              Pricing
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => getNavLinkClass(isActive)}>
              Gallery
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => getNavLinkClass(isActive)}>
              Contact
            </NavLink>
            {/* "Book Now" Button - styled differently using custom class and inline styles. */}
            <NavLink
              to="/book-now"
              className="px-5 py-2 bg-sakura-pink text-white rounded-md hover:bg-opacity-90 transition-all duration-300 font-medium hover-float"
            >
              Book Now
            </NavLink>
          </nav>
        </div>

        {/* --- Mobile Navigation Menu (Conditional Rendering) --- */}
        {/* This section is rendered only if `isMenuOpen` is true. */}
        {isMenuOpen && (
          // `fixed inset-0` makes it cover the entire screen.
          // `animate-fade-in` applies the custom fade-in animation.
          <nav className="md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-8 animate-fade-in">
            {/* Close button for the mobile menu */}
            <button
              className="absolute top-5 right-5 text-sakura-dark-text p-1 rounded hover:bg-gray-100 transition-colors" // Positioned top-right
              onClick={toggleMenu} // Closes the menu
              aria-label="Close mobile menu"
            >
              <X size={24} aria-hidden="true" />
            </button>
            {/* Mobile navigation links - larger text, close menu on click */}
            <NavLink to="/" className={({ isActive }) => getMobileNavLinkClass(isActive)} onClick={toggleMenu}>
              Home
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => getMobileNavLinkClass(isActive)} onClick={toggleMenu}>
              Pricing
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => getMobileNavLinkClass(isActive)} onClick={toggleMenu}>
              Gallery
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => getMobileNavLinkClass(isActive)} onClick={toggleMenu}>
              Contact
            </NavLink>
            {/* Use the custom button style for Book Now */}
            <NavLink to="/book-now" className="sakura-btn text-xl" onClick={toggleMenu}>
              Book Now
            </NavLink>
          </nav>
        )}
      </header>

      {/* --- Main Content Area --- */}
      {/* `flex-grow` makes this section take up available vertical space. */}
      {/* `pt-21` - CHECK THIS: Adding padding-top to prevent content from hiding under the fixed header. Adjust value (e.g., pt-20, pt-24) based on header height. */} 
      <main className="flex-grow pt-21"> {/* Adjusted padding-top slightly */} 
        {/* The Outlet component renders the content of the matched child route (the specific page). */}
        <Outlet />
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white py-12 border-t border-gray-100 mt-auto">
        <div className="sakura-container">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            {/* Footer Logo and Tagline */}
            <div className="mb-6 md:mb-0">
              <Link to="/" className="font-playfair text-xl font-bold text-sakura-dark-text">
                Sakura Lens
              </Link>
              <p className="text-gray-500 mt-2 text-sm">
                Photography with a cherry blossom touch
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-6">
              {/* Use anchor tags `<a>` for external links (replace "#" with actual URLs). */}
              <a
                href="https://www.facebook.com/mombphotographie/" // Replace with actual Facebook URL
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Security best practice for target="_blank"
                className="text-gray-500 hover:text-sakura-pink transition-colors hover-float"
                aria-label="Instagram (opens in a new tab)"
              >
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a
                href="https://www.instagram.com/mombphotographie/" // Replace with actual Instagram URL
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-sakura-pink transition-colors hover-float"
                aria-label="Facebook (opens in a new tab)"
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a
                href="#" // Replace with actual WhatsApp URL
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-sakura-pink transition-colors hover-float"
                aria-label="Twitter (opens in a new tab)"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="2x" />
              </a>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="border-t border-gray-100 mt-8 pt-8 text-center text-gray-500 text-sm">
            {/* Dynamically display the current year */}
            <p>© {new Date().getFullYear()} Sakura Lens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Export the Layout component for use in App.tsx.
export default Layout;
