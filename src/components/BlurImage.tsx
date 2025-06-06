import React, { useState, useEffect } from "react"
import { Blurhash } from "react-blurhash"

import { getOptimizedImageProps } from "@/utils/imageOptimization"

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  hash: string | null | undefined // Blurhash string
  hashWidth?: number // Width for blurhash canvas
  hashHeight?: number // Height for blurhash canvas
  punch?: number
  alt: string
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down" // Add objectFit prop
  overlayClassName?: string // Optional class for an overlay div
  crossorigin?: "" | "anonymous" | "use-credentials"
  priority?: boolean
  isHero?: boolean
  isAboveFold?: boolean
}

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  hash,
  hashWidth = 32, // Can use lower default resolution for performance if needed
  hashHeight = 32,
  punch = 1,
  alt,
  className, // Pass through className
  objectFit = "cover", // Default to 'cover'
  overlayClassName, // Destructure the new prop
  crossorigin, // Destructure crossorigin
  priority = false,
  isHero = false,
  isAboveFold = false,
  ...rest // Pass through other img attributes like width, height
}) => {
  // Get optimized image props
  const optimizedProps = getOptimizedImageProps({
    src,
    alt,
    isHero,
    isAboveFold: isAboveFold || priority,
  })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hashError, setHashError] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      // Image loaded successfully
      setImageLoaded(true)
    }
    img.onerror = (error) => {
      console.error("Image failed to load:", src, error)
    }
    img.src = src

    // Cleanup function in case the component unmounts before image loads
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src]) // Reload if src changes

  // Keep showBlurhash for checking if hash exists, but don't use for conditional rendering directly
  const hasBlurhash = !!hash && !hashError
  const { width, height, ...imgRest } = rest // Separate width/height for blurhash canvas if needed

  const handleHashError = () => {
    console.error("Blurhash error for:", src)
    setHashError(true)
  }

  return (
    <div
      // Remove the dark background added previously
      // Remove bg-transparent as it might cause white flash
      className={`relative overflow-hidden ${className || ""}`}
      style={{ width: width, height: height }}>
      {/* Container for image and blurhash */}
      <div className="absolute inset-0">
        {/* Blurhash Canvas - Always rendered if hash exists, fades out */}
        {hasBlurhash && hash && (
          <div className="absolute inset-0 h-full w-full">
            <Blurhash
              hash={hash}
              width="100%" // Explicit width
              height="100%" // Explicit height
              resolutionX={hashWidth} // Use prop for resolution
              resolutionY={hashHeight} // Use prop for resolution
              punch={punch}
              className={`h-full w-full bg-transparent transition-opacity duration-500 ${imageLoaded ? "opacity-0" : "opacity-100"}`}
              onError={handleHashError}
            />
          </div>
        )}

        {/* Actual Image - Always Rendered, Opacity Transitions */}
        <img
          src={optimizedProps.src}
          alt={optimizedProps.alt}
          onLoad={() => setImageLoaded(true)}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          style={{ objectFit: objectFit }}
          crossOrigin={crossorigin} // Apply crossorigin
          loading={optimizedProps.loading}
          fetchPriority={optimizedProps.fetchPriority}
          title={optimizedProps.title}
          {...imgRest} // Apply remaining props like style, etc.
          // Apply explicit width/height if passed
          width={width}
          height={height}
        />

        {/* Overlay Div - REMOVED from inside the image container */}
        {/* {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`}></div>} */}
      </div>

      {/* Overlay Div - Moved back outside */}
      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`}></div>}

      {/* Fallback - Shows if NO blurhash AND image not loaded */}
      {!hasBlurhash && !imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent text-gray-500">
          <span>Loading...</span>
        </div>
      )}
    </div>
  )
}
