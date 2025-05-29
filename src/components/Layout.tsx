/**
 * src/components/Layout.tsx
 *
 * This component defines the main layout structure for the application,
 * including the header, main content area, and footer.
 * It handles responsive navigation and changes header appearance on scroll.
 */

import React, { useState, useEffect, useRef } from "react"
import { FaTimes } from "react-icons/fa"
// Import components from react-router-dom for navigation and rendering page content.
// Link: Basic navigation link.
// NavLink: Special link that knows if it's "active" (matches the current URL).
// Outlet: Placeholder where nested route components (pages) will be rendered.
// useLocation: Hook to get information about the current URL.
import { FaBars, FaInstagram, FaFacebookF, FaChevronDown, FaTiktok } from "react-icons/fa6"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"

// Define the Layout component as a Functional Component (React.FC).
const Layout: React.FC = () => {
  // --- State --- //
  // State to track if the mobile menu is open or closed.
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // State to track if the page has been scrolled down.
  const [isScrolled, setIsScrolled] = useState(false)
  // State to force header opaque for specific pages
  const [forceHeaderOpaque, setForceHeaderOpaque] = useState(false)
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
    setIsDropdownOpen(false)
  }, [location.pathname]) // Remove isMenuOpen from dependencies

  // Effect to handle body scroll behavior
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    // Always show scrollbar to prevent layout shift
    document.body.style.overflowY = "scroll"

    // Cleanup function to restore original overflow style
    return () => {
      document.body.style.overflowY = originalOverflow // Restore original Y overflow
    }
  }, []) // Run once on mount, cleanup on unmount

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

  // Effect to determine if the header should be forced opaque based on the current path.
  useEffect(() => {
    const pathsForOpaqueHeader = [
      "/grossesse",
      "/famille",
      "/bebe",
      "/complices",
      "/galerie",
      "/contact",
      // Add other paths that need an initially opaque header
    ]
    if (pathsForOpaqueHeader.some((path) => location.pathname.startsWith(path))) {
      setForceHeaderOpaque(true)
    } else {
      setForceHeaderOpaque(false)
    }
  }, [location.pathname])

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
      "px-3 py-2 rounded-md border border-transparent hover:border-sakura-pink hover:text-white hover:bg-sakura-pink hover:text-shadow-md hover:bg-opacity-90 duration-100 transition-colors flex items-center gap-1" // Added flex, items-center, gap-1
    const textClass = isScrolled || forceHeaderOpaque ? "text-sakura-dark-text" : "text-white"
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-sakura-light-gray">
      {/* --- Header --- */}
      {/* `fixed` positions the header relative to the viewport. */}
      {/* `top-0 left-0 right-0` stretches it across the top. */}
      {/* `z-50` ensures it stays above other content. */}
      {/* `transition-all duration-300` applies smooth transitions to changes (like background). */}
      {/* Conditional background/styling based on `isScrolled` state. */}
      <header
        className={`fixed left-0 right-0 top-0 z-[90] py-5 transition-all duration-300 ${
          isScrolled || forceHeaderOpaque
            ? "bg-white bg-opacity-90 shadow-sm backdrop-blur-sm" // Scrolled or forced: White, blurred background, shadow
            : "bg-transparent" // Top: Transparent background
        }`}>
        {/* Use the custom container class for consistent padding and max-width. */}
        <div className="sakura-container flex items-center justify-between">
          {/* Logo/Brand Name - Links to homepage */}
          <Link
            to="/"
            className={`font-playfair text-2xl font-bold transition-colors ${
              isScrolled || forceHeaderOpaque ? "text-sakura-dark-text" : "text-white" // Text color changes on scroll or forced
            }`}>
            <img
              src={"https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/logomompink-300x150.webp"}
              alt="MOM.B Logo Header"
              className={`transition-all duration-300 ${
                isScrolled || forceHeaderOpaque ? "h-10 w-auto" : "h-16 w-auto" // Larger when not scrolled/forced, smaller when scrolled/forced
              }`}
              loading="eager"
            />
          </Link>

          {/* --- Mobile Menu Button --- */}
          <button
            className={`flex items-center justify-center rounded-md p-2 transition-colors md:hidden ${
              isScrolled || forceHeaderOpaque
                ? "text-sakura-dark-text hover:bg-gray-100"
                : "text-white hover:bg-white/20"
            }`}
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}>
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" aria-hidden="true" />
            ) : (
              <FaBars className="h-6 w-6" aria-hidden="true" />
            )}
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
                to="/grossesse"
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
                      to="/grossesse"
                      className={({ isActive }) => getDropdownLinkClass(isActive)}
                      role="menuitem">
                      La beauté de la grossesse
                    </NavLink>
                    <NavLink to="/famille" className={({ isActive }) => getDropdownLinkClass(isActive)} role="menuitem">
                      Moments en famille
                    </NavLink>
                    <NavLink to="/bebe" className={({ isActive }) => getDropdownLinkClass(isActive)} role="menuitem">
                      Bébé et nous
                    </NavLink>
                    <NavLink
                      to="/complices"
                      className={({ isActive }) => getDropdownLinkClass(isActive)}
                      role="menuitem">
                      Complices à deux
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
            {/* --- End Tarifs Dropdown --- */}

            <NavLink to="/galerie" className={({ isActive }) => getNavLinkClass(isActive)}>
              Galerie
            </NavLink>
            <NavLink to="/partenaires" className={({ isActive }) => getNavLinkClass(isActive)}>
              Partenaires
            </NavLink>
            <NavLink
              to="/contact"
              className="hover-float rounded-md bg-sakura-pink px-5 py-2 font-medium text-white transition-all duration-200 text-shadow-md hover:bg-opacity-90">
              Contact
            </NavLink>
          </nav>
        </div>

        {/* --- Mobile Navigation Menu (Conditional Rendering) --- */}
        {isMenuOpen ? (
          <div className="fixed inset-0 z-[100]">
            <div className="fixed inset-0 bg-white">
              <nav className="flex h-screen w-full flex-col items-center justify-center space-y-6 overflow-y-auto bg-white py-16">
                <button
                  className="fixed right-5 top-5 rounded-md p-2 text-sakura-dark-text transition-colors hover:bg-gray-100"
                  onClick={toggleMenu}
                  aria-label="Close mobile menu">
                  <FaTimes className="h-6 w-6" aria-hidden="true" />
                </button>
                <NavLink to="/" className={({ isActive }) => getMobileNavLinkClass(isActive)} onClick={toggleMenu}>
                  Accueil
                </NavLink>
                <div className="flex flex-col items-center space-y-4">
                  <NavLink
                    to="/grossesse"
                    className={({ isActive }) => getMobileNavLinkClass(isActive)}
                    onClick={toggleMenu}>
                    Tarifs
                  </NavLink>
                  <NavLink
                    to="/grossesse"
                    className={({ isActive }) => getMobileNavLinkClass(isActive)}
                    onClick={toggleMenu}>
                    La beauté de la grossesse
                  </NavLink>
                  <NavLink
                    to="/famille"
                    className={({ isActive }) => getMobileNavLinkClass(isActive)}
                    onClick={toggleMenu}>
                    Moments en famille
                  </NavLink>
                  <NavLink
                    to="/bebe"
                    className={({ isActive }) => getMobileNavLinkClass(isActive)}
                    onClick={toggleMenu}>
                    Bébé et nous
                  </NavLink>
                  <NavLink
                    to="/complices"
                    className={({ isActive }) => getMobileNavLinkClass(isActive)}
                    onClick={toggleMenu}>
                    Complices à deux
                  </NavLink>
                </div>
                <NavLink
                  to="/galerie"
                  className={({ isActive }) => getMobileNavLinkClass(isActive)}
                  onClick={toggleMenu}>
                  Galerie
                </NavLink>
                <NavLink
                  to="/partenaires"
                  className={({ isActive }) => getMobileNavLinkClass(isActive)}
                  onClick={toggleMenu}>
                  Partenaires
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => getMobileNavLinkClass(isActive)}
                  onClick={toggleMenu}>
                  Contact
                </NavLink>
              </nav>
            </div>
          </div>
        ) : null}
      </header>

      {/* --- Main Content Area --- */}
      {/* `flex-grow` makes this section take up available vertical space. */}
      {/* `pt-21` - CHECK THIS: Adding padding-top to prevent content from hiding under the fixed header. Adjust value (e.g., pt-20, pt-24) based on header height. */}
      <main className="pt-21 flex-grow">
        {/* The Outlet component renders the content of the matched child route (the specific page). */}
        <Outlet />
      </main>

      {/* --- Footer --- */}
      <footer className="mt-auto border-t border-gray-100 bg-white py-12">
        <div className="sakura-container">
          <div className="flex flex-col items-center justify-between text-center md:flex-row md:text-left">
            {/* Footer Logo and Tagline */}
            <div className="mb-6 md:mb-0">
              <p className="font-bad-script text-xl font-bold tracking-wider text-sakura-dark-text">MOM.B</p>
              <Link
                to="/#about-me-section"
                className="mt-2 block font-bad-script text-base tracking-wider text-gray-500 transition-colors hover:text-sakura-pink">
                Barbara - Photographe famille, mariage, grossesse, bébé
              </Link>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-6">
              {/* Use anchor tags `<a>` for external links (replace "#" with actual URLs). */}
              <a
                href="https://www.facebook.com/mombphotographie/"
                target="_blank"
                rel="noopener noreferrer" // Security best practice for target="_blank"
                className="rounded-lg bg-[#1876f0] p-1 transition-transform duration-200 hover:scale-110"
                aria-label="Facebook (ouvre dans un nouvel onglet)">
                <FaFacebookF className="text-white transition-transform duration-200 hover:scale-110" size="2em" />
              </a>
              <a
                href="https://www.instagram.com/mombphotographie/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[linear-gradient(45deg,_#f58529_0%,_#dd2a7b_30%,_#8134af_60%,_#515bd4_100%)] p-1 transition-transform duration-200 hover:scale-110"
                aria-label="Instagram (ouvre dans un nouvel onglet)">
                <FaInstagram className="text-white transition-transform duration-200 hover:scale-110" size="2em" />
              </a>
              <a
                href="https://www.tiktok.com/@mombphotographie"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-black p-1 transition-transform duration-200 hover:scale-110"
                aria-label="TikTok (ouvre dans un nouvel onglet)">
                <FaTiktok
                  size="2em"
                  className="text-white transition-transform duration-200 [filter:drop-shadow(-2px_0px_#69C9D0)_drop-shadow(2px_0px_#EE1D52)] hover:scale-110"
                />
              </a>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="mt-8 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
            {/* Dynamically display the current year */}
            <p>© {new Date().getFullYear()} MOM.B Photographie. Tous droits réservés.</p>
            <Link to="/mentions-legales" className="underline transition-colors duration-200 hover:text-sakura-pink">
              Mentions légales
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Export the Layout component for use in App.tsx.
export default Layout
