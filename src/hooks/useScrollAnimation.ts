import { useEffect, useRef } from "react"

export function useScrollAnimation() {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current // Store ref value in a variable
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-show")
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "-50px", // Trigger slightly before the element comes into view
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element) // Use the stored variable
    }
  }, []) // Empty dependency array is fine since elementRef is stable

  return elementRef
}
