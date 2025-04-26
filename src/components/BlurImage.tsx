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
}

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  hash,
  hashWidth = 128, // Default blurhash render size
  hashHeight = 128, // Default blurhash render size
  punch = 1,
  alt,
  className, // Pass through className
  objectFit = "cover", // Default to 'cover'
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

  const showBlurhash = hash && !imageLoaded
  const { width, height, ...imgRest } = rest // Separate width/height for blurhash canvas if needed

  return (
    <div className={`relative overflow-hidden ${className || ""}`} style={{ width: width, height: height }}>
      {/* Blurhash Canvas */}
      {showBlurhash && (
        <Blurhash
          hash={hash}
          width={width ? Number(width) : hashWidth} // Use actual width if provided
          height={height ? Number(height) : hashHeight} // Use actual height if provided
          resolutionX={32} // Lower resolution for performance
          resolutionY={32}
          punch={punch}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy" // Keep lazy loading
        onLoad={() => setImageLoaded(true)}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ objectFit: objectFit }}
        {...imgRest} // Apply remaining props like style, etc.
        // Apply explicit width/height if passed
        width={width}
        height={height}
      />
      {/* Fallback in case image fails to load but blurhash isn't shown */}
      {!showBlurhash && !imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">Loading...</div>
      )}
    </div>
  )
}
