import React, { useState, useEffect } from "react"
import { Blurhash } from "react-blurhash"

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
  ...rest // Pass through other img attributes like width, height
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageLoaded(true)
    }
    img.src = src
    // Optional: handle image loading errors
    // img.onerror = () => { console.error("Image failed to load:", src); }

    // Cleanup function in case the component unmounts before image loads
    return () => {
      img.onload = null
      // img.onerror = null; // Uncomment if using onerror
    }
  }, [src]) // Reload if src changes

  // Keep showBlurhash for checking if hash exists, but don't use for conditional rendering directly
  const hasBlurhash = !!hash
  const { width, height, ...imgRest } = rest // Separate width/height for blurhash canvas if needed

  return (
    <div
      className={`relative overflow-hidden bg-transparent ${className || ""}`}
      style={{ width: width, height: height }}>
      {/* Container for image and blurhash */}
      <div className="absolute inset-0">
        {/* Blurhash Canvas - Always rendered if hash exists, fades out */}
        {hasBlurhash && hash && (
          <Blurhash
            hash={hash}
            width="100%" // Explicit width
            height="100%" // Explicit height
            resolutionX={hashWidth} // Use prop for resolution
            resolutionY={hashHeight} // Use prop for resolution
            punch={punch}
            className={`absolute inset-0 h-full w-full bg-transparent transition-opacity duration-500 ${
              imageLoaded ? "opacity-0" : "opacity-100" // Fade out when image loaded
            }`}
            // Removed inline style, class takes precedence
          />
        )}

        {/* Actual Image - Always Rendered, Opacity Transitions */}
        <img
          src={src}
          alt={alt}
          onLoad={() => setImageLoaded(true)}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0" // Fade in when image loaded
          }`}
          style={{ objectFit: objectFit }}
          crossOrigin={crossorigin} // Apply crossorigin
          {...imgRest} // Apply remaining props like style, etc.
          // Apply explicit width/height if passed
          width={width}
          height={height}
        />
      </div>

      {/* Overlay Div - Rendered on top if class provided */}
      {overlayClassName && <div className={overlayClassName}></div>}

      {/* Fallback - Shows if NO blurhash AND image not loaded */}
      {!hasBlurhash && !imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent text-gray-500">
          {/* Loading... */}
        </div>
      )}
    </div>
  )
}
