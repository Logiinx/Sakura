import { useState, useEffect, useRef } from "react"

interface UseInViewOptions extends IntersectionObserverInit {
  triggerOnce?: boolean
  targetRef?: React.RefObject<Element>
}

export function useInView(options?: UseInViewOptions): [React.RefObject<HTMLDivElement> | null, boolean] {
  const [isInView, setIsInView] = useState(false)
  const internalRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true, targetRef } = options || {}

  const elementRef = targetRef || internalRef

  useEffect(() => {
    const currentElement = elementRef.current
    if (!currentElement) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce && observerRef.current) {
            observerRef.current.unobserve(entry.target)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    const { current: currentObserver } = observerRef

    currentObserver.observe(currentElement)

    return () => {
      if (currentElement && currentObserver) {
        currentObserver.unobserve(currentElement)
      }
    }
  }, [threshold, rootMargin, triggerOnce, elementRef])

  return [targetRef ? null : internalRef, isInView]
}
