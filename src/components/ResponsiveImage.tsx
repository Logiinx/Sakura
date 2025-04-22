import React, { useState, useEffect } from "react"

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  loading?: "lazy" | "eager"
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt, className = "", loading }) => {
  const [isVertical, setIsVertical] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setIsVertical(img.height > img.width)
    }
  }, [src])

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
      <img
        src={src}
        alt={alt}
        className={`h-full w-full ${isVertical ? "object-contain" : "object-cover"} ${className}`}
        loading={loading}
      />
    </div>
  )
}
