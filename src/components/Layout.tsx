/**
 * src/components/Layout.tsx
 *
 * This component defines the main layout structure for the application,
 * including the header, main content area, and footer.
 * It handles responsive navigation and changes header appearance on scroll.
 */

import React, { useState, useEffect, useRef } from "react"
// Import components from react-router-dom for navigation and rendering page content.
// Link: Basic navigation link.
// NavLink: Special link that knows if it's "active" (matches the current URL).
// Outlet: Placeholder where nested route components (pages) will be rendered.
// useLocation: Hook to get information about the current URL.
import { FaBars, FaTimes, FaInstagram, FaFacebook, FaChevronDown, FaWhatsapp } from "react-icons/fa"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"

// Define the Layout component as a Functional Component (React.FC).
const Layout: React.FC = () => {
  // --- State --- //
  // State to track if the mobile menu is open or closed.
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // State to track if the page has been scrolled down.
  const [isScrolled, setIsScrolled] = useState(false)
  // State for the Tarifs dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dropdownTimeoutId, setDropdownTimeoutId] = useState<NodeJS.Timeout | null>(null) // State for the timeout ID

  // Get the current location object (contains pathname, search, etc.).
  const location = useLocation()
  // Ref for the dropdown menu to detect clicks outside
  const dropdownRef = useRef<HTMLDivElement>(null)

  // --- Handlers --- //
  // Function to toggle the mobile menu state.
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Function to handle mouse entering the dropdown trigger area
  const handleMouseEnter = () => {
    // Clear any existing timeout to prevent the dropdown from closing
    if (dropdownTimeoutId) {
      clearTimeout(dropdownTimeoutId)
      setDropdownTimeoutId(null)
    }
    setIsDropdownOpen(true)
  }

  // Function to handle mouse leaving the dropdown trigger area
  const handleMouseLeave = () => {
    // Set a timeout to close the dropdown after a short delay
    const timeoutId = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 200) // 200ms delay
    setDropdownTimeoutId(timeoutId)
  }

  // --- Effects --- //
  // Effect to close the mobile menu whenever the route changes.
  useEffect(() => {
    // Check if the menu is currently open before closing it.
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
    // Close dropdown on route change as well
    setIsDropdownOpen(false)
    // Run this effect whenever the location.pathname changes.
  }, [location.pathname, isMenuOpen]) // Added isMenuOpen to dependencies for completeness

  // Effect to detect scroll position and update the `isScrolled` state.
  useEffect(() => {
    // Function to handle the scroll event.
    const handleScroll = () => {
      // Set `isScrolled` to true if user has scrolled more than 50 pixels down, false otherwise.
      setIsScrolled(window.scrollY > 50)
    }

    // Add the scroll event listener when the component mounts.
    window.addEventListener("scroll", handleScroll)

    // Cleanup function: Remove the scroll event listener when the component unmounts.
    // This prevents memory leaks.
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
    // Empty dependency array `[]` means this effect runs only once on mount and cleanup on unmount.
  }, [])

  // Effect to clear timeout on unmount
  useEffect(() => {
    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      if (dropdownTimeoutId) {
        clearTimeout(dropdownTimeoutId)
      }
    }
  }, [dropdownTimeoutId])

  // Effect to handle clicks outside the dropdown to close it (optional, good UX)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    // Add listener if dropdown is open
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      // Remove listener if dropdown is closed
      document.removeEventListener("mousedown", handleClickOutside)
    }

    // Cleanup listener on component unmount or when dropdown closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen]) // Re-run effect when isDropdownOpen changes

  // --- Helper Function for NavLink ClassNames --- //
  // This function generates the appropriate className string for NavLinks,
  // handling both active state and scrolled state.
  const getNavLinkClass = (isActive: boolean): string => {
    // Adjusted padding to match "Book Now" button (py-2 px-5). Kept border logic.
    const baseClasses =
      "px-3 py-2 rounded-md border border-transparent hover:border-sakura-pink hover:text-white hover:bg-sakura-pink hover:bg-opacity-90 transition-colors flex items-center gap-1" // Added flex, items-center, gap-1
    const textClass = isScrolled ? "text-sakura-dark-text" : "text-white"
    // Standard active class logic
    const activeClass = isActive ? "font-medium text-sakura-pink border-sakura-pink" : ""

    // Combine classes, ensuring active pink overrides the scrolled text color if needed.
    return `${baseClasses} ${isActive ? activeClass : textClass}`
  }

  // Helper for dropdown item links
  const getDropdownLinkClass = (isActive: boolean): string => {
    const base =
      "block px-4 py-2 text-sm text-gray-700 hover:bg-sakura-light-gray hover:text-sakura-pink transition-colors"
    const active = isActive ? "font-medium text-sakura-pink bg-sakura-light-gray" : "text-sakura-dark-text"
    return `${base} ${active}`
  }

  const getMobileNavLinkClass = (isActive: boolean): string => {
    return isActive
      ? "text-sakura-pink font-medium text-xl"
      : "text-xl text-sakura-dark-text hover:text-sakura-pink transition-colors"
  }

  // --- Render --- //
  return (
    // Main container div, uses flexbox to ensure footer sticks to the bottom.
    <div className="flex min-h-screen flex-col bg-sakura-light-gray">
      {/* --- Header --- */}
      {/* `fixed` positions the header relative to the viewport. */}
      {/* `top-0 left-0 right-0` stretches it across the top. */}
      {/* `z-50` ensures it stays above other content. */}
      {/* `transition-all duration-300` applies smooth transitions to changes (like background). */}
      {/* Conditional background/styling based on `isScrolled` state. */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 py-5 transition-all duration-300 ${
          isScrolled
            ? "bg-white bg-opacity-90 shadow-sm backdrop-blur-sm" // Scrolled: White, blurred background, shadow
            : "bg-transparent" // Top: Transparent background
        }`}>
        {/* Use the custom container class for consistent padding and max-width. */}
        <div className="sakura-container flex items-center justify-between">
          {/* Logo/Brand Name - Links to homepage */}
          <Link
            to="/"
            className={`font-playfair text-2xl font-bold transition-colors ${
              isScrolled ? "text-sakura-dark-text" : "text-white" // Text color changes on scroll
            }`}>
            <img
              src="./src/assets/logomompink-300x150.png"
              alt="MOM.B Logo Header"
              className={`transition-all duration-300 ${
                isScrolled ? "h-10 w-auto" : "h-16 w-auto" // Larger when not scrolled, smaller when scrolled
              }`}
            />
          </Link>

          {/* --- Mobile Menu Button --- */}
          {/* `md:hidden` makes this button visible only on small screens (up to medium). */}
          <button
            className={`rounded p-1 transition-colors md:hidden ${
              isScrolled ? "text-sakura-dark-text hover:bg-gray-100" : "text-white hover:bg-white/20"
            }`}
            onClick={toggleMenu} // Calls the handler to open/close the menu
            aria-label="Toggle mobile menu" // Accessibility label for screen readers
            aria-expanded={isMenuOpen} // Indicate if the menu is expanded
          >
            {/* Show X icon when menu is open, Menu icon when closed. */}
            {isMenuOpen ? <FaTimes size={24} aria-hidden="true" /> : <FaBars size={24} aria-hidden="true" />}
          </button>

          {/* --- Desktop Navigation --- */}
          {/* `hidden md:flex` makes this nav visible only on medium screens and larger. */}
          <nav className="hidden items-center space-x-10 md:flex">
            {/* Use NavLink for items that should highlight when active. */}
            <NavLink to="/" className={({ isActive }) => getNavLinkClass(isActive)}>
              Accueil
            </NavLink>

            {/* --- Tarifs Dropdown --- */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={dropdownRef} // Attach ref here
            >
              <NavLink
                to="/pricing"
                className={({ isActive }) => getNavLinkClass(isActive)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true">
                Tarifs
                <FaChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""} ml-1`}
                />
              </NavLink>

              {/* Dropdown Panel */}
              {isDropdownOpen && (
                <div
                  className="animate-fade-in-fast absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <NavLink
                      to="/package-one"
                      className={({ isActive }) => getDropdownLinkClass(isActive)}
                      role="menuitem">
                      Package 1
                    </NavLink>
                    <NavLink
                      to="/package-two"
                      className={({ isActive }) => getDropdownLinkClass(isActive)}
                      role="menuitem">
                      Package 2
                    </NavLink>
                    <NavLink
                      to="/package-three"
                      className={({ isActive }) => getDropdownLinkClass(isActive)}
                      role="menuitem">
                      Package 3
                    </NavLink>
                    <NavLink
                      to="/package-four"
                      className={({ isActive }) => getDropdownLinkClass(isActive)}
                      role="menuitem">
                      Package 4
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
            {/* --- End Tarifs Dropdown --- */}

            <NavLink to="/gallery" className={({ isActive }) => getNavLinkClass(isActive)}>
              Galerie
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => getNavLinkClass(isActive)}>
              Contact
            </NavLink>
            {/* "Book Now" Button - styled differently using custom class and inline styles. */}
            <NavLink
              to="/book-now"
              className="hover-float rounded-md bg-sakura-pink px-5 py-2 font-medium text-white transition-all duration-300 hover:bg-opacity-90">
              Book Now
            </NavLink>
          </nav>
        </div>

        {/* --- Mobile Navigation Menu (Conditional Rendering) --- */}
        {/* This section is rendered only if `isMenuOpen` is true. */}
        {isMenuOpen && (
          // `fixed inset-0` makes it cover the entire screen.
          // `animate-fade-in` applies the custom fade-in animation.
          <nav className="fixed inset-0 z-50 flex animate-fade-in flex-col items-center justify-center space-y-6 overflow-y-auto bg-white py-16 md:hidden">
            {" "}
            {/* Added padding and overflow */}
            {/* Close button for the mobile menu */}
            <button
              className="absolute right-5 top-5 z-10 rounded p-1 text-sakura-dark-text transition-colors hover:bg-gray-100" // Ensure button is above links
              onClick={toggleMenu} // Closes the menu
              aria-label="Close mobile menu">
              <FaTimes size={24} aria-hidden="true" />
            </button>
            {/* Mobile navigation links - larger text, close menu on click */}
            <NavLink to="/" className={({ isActive }) => getMobileNavLinkClass(isActive)} onClick={toggleMenu}>
              Accueil {/* Changed from Home */}
            </NavLink>
            {/* --- Mobile Tarifs Links --- */}
            <div className="text-center">
              {" "}
              {/* Group Tarifs links */}
              <p className="mb-2 text-lg text-gray-500">Tarifs</p> {/* Optional: Add a heading */}
              <NavLink
                to="/package-one"
                className={({ isActive }) => getMobileNavLinkClass(isActive)}
                onClick={toggleMenu}>
                Package 1
              </NavLink>
              <NavLink
                to="/package-two"
                className={({ isActive }) => getMobileNavLinkClass(isActive)}
                onClick={toggleMenu}>
                Package 2
              </NavLink>
              <NavLink
                to="/package-three"
                className={({ isActive }) => getMobileNavLinkClass(isActive)}
                onClick={toggleMenu}>
                Package 3
              </NavLink>
              <NavLink
                to="/package-four"
                className={({ isActive }) => getMobileNavLinkClass(isActive)}
                onClick={toggleMenu}>
                Package 4
              </NavLink>
            </div>
            {/* --- End Mobile Tarifs Links --- */}
            <NavLink to="/gallery" className={({ isActive }) => getMobileNavLinkClass(isActive)} onClick={toggleMenu}>
              Galerie {/* Changed from Gallery */}
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => getMobileNavLinkClass(isActive)} onClick={toggleMenu}>
              Contact
            </NavLink>
            {/* Use the custom button style for Book Now */}
            <NavLink to="/book-now" className="sakura-btn mt-4 text-xl" onClick={toggleMenu}>
              {" "}
              {/* Added margin-top */}
              Book Now
            </NavLink>
          </nav>
        )}
      </header>

      {/* --- Main Content Area --- */}
      {/* `flex-grow` makes this section take up available vertical space. */}
      {/* `pt-21` - CHECK THIS: Adding padding-top to prevent content from hiding under the fixed header. Adjust value (e.g., pt-20, pt-24) based on header height. */}
      <main className="pt-21 flex-grow">
        {" "}
        {/* Adjusted padding-top slightly */}
        {/* The Outlet component renders the content of the matched child route (the specific page). */}
        <Outlet />
      </main>

      {/* --- Footer --- */}
      <footer className="mt-auto border-t border-gray-100 bg-white py-12">
        <div className="sakura-container">
          <div className="flex flex-col items-center justify-between text-center md:flex-row md:text-left">
            {/* Footer Logo and Tagline */}
            <div className="mb-6 md:mb-0">
              <Link to="/" className="font-playfair text-xl font-bold text-sakura-dark-text">
                Sakura Lens
              </Link>
              <p className="mt-2 text-sm text-gray-500">Photography with a cherry blossom touch</p>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-6">
              {/* Use anchor tags `<a>` for external links (replace "#" with actual URLs). */}
              <a
                href="https://www.facebook.com/mombphotographie/" // Replace with actual Facebook URL
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Security best practice for target="_blank"
                className="hover-float text-gray-500 transition-colors hover:text-sakura-pink"
                aria-label="Facebook (opens in a new tab)">
                <FaFacebook size="2em" />
              </a>
              <a
                href="https://www.instagram.com/mombphotographie/" // Replace with actual Instagram URL
                target="_blank"
                rel="noopener noreferrer"
                className="hover-float text-gray-500 transition-colors hover:text-sakura-pink"
                aria-label="Instagram (opens in a new tab)">
                <FaInstagram size="2em" />
              </a>
              <a
                href="#" // Replace with actual WhatsApp URL
                target="_blank"
                rel="noopener noreferrer"
                className="hover-float text-gray-500 transition-colors hover:text-sakura-pink"
                aria-label="WhatsApp (opens in a new tab)">
                <FaWhatsapp size="2em" />
              </a>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="mt-8 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
            {/* Dynamically display the current year */}
            <p>© {new Date().getFullYear()} Sakura Lens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Export the Layout component for use in App.tsx.
export default Layout
