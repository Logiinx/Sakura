import React, { useState, useEffect } from "react"
import { FaChevronUp } from "react-icons/fa6"

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Retourner en haut de la page"
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-sakura-pink text-white shadow-lg transition-all duration-100 text-shadow-lg hover:scale-105 hover:opacity-90 hover:shadow-xl">
          <FaChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  )
}

export default ScrollToTopButton
