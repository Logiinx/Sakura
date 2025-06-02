/**
 * Image optimization utilities for SEO and performance
 */

export interface ImageSEOData {
  src: string
  alt: string
  title?: string
  width?: number
  height?: number
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
}

/**
 * Generate optimized image attributes for SEO
 */
export const generateImageSEO = ({
  src,
  alt,
  title,
  width,
  height,
  loading = "lazy",
  fetchPriority = "auto",
}: ImageSEOData): ImageSEOData => {
  return {
    src,
    alt: alt || "Image MOM.B Photographie",
    title: title || alt,
    width,
    height,
    loading,
    fetchPriority,
  }
}

/**
 * Generate structured data for images
 */
export const generateImageStructuredData = ({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
}) => {
  return {
    "@type": "ImageObject",
    url: src,
    description: alt,
    ...(width && { width }),
    ...(height && { height }),
    ...(caption && { caption }),
  }
}

/**
 * Generate WebP source sets for modern browsers
 */
export const generateWebPSources = (baseSrc: string, sizes: number[] = [400, 800, 1200]): string => {
  const webpSources = sizes
    .map((size) => {
      const webpSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, `.webp`)
      return `${webpSrc}?w=${size} ${size}w`
    })
    .join(", ")

  return webpSources
}

/**
 * Generate responsive image sizes attribute
 */
export const generateSizesAttribute = (
  breakpoints: Record<string, string> = {
    "(max-width: 640px)": "100vw",
    "(max-width: 1024px)": "50vw",
    default: "33vw",
  }
): string => {
  const sizes = Object.entries(breakpoints)
    .filter(([key]) => key !== "default")
    .map(([media, size]) => `${media} ${size}`)
    .join(", ")

  return sizes + (breakpoints.default ? `, ${breakpoints.default}` : "")
}

/**
 * Generate optimized image props for different use cases
 */
export const getOptimizedImageProps = ({
  src,
  alt,
  isHero = false,
  isAboveFold = false,
  width,
  height,
}: {
  src: string
  alt: string
  isHero?: boolean
  isAboveFold?: boolean
  width?: number
  height?: number
}): ImageSEOData => {
  return generateImageSEO({
    src,
    alt,
    width,
    height,
    loading: isAboveFold || isHero ? "eager" : "lazy",
    fetchPriority: isHero ? "high" : "auto",
  })
}
