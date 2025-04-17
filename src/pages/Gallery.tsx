import React, { useState } from "react"

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80",
    alt: "Orange flowers",
    category: "nature",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "Body of water surrounded by trees",
    category: "landscape",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    alt: "Sun light passing through green leafed tree",
    category: "nature",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    alt: "Landscape photography of mountain hit by sun rays",
    category: "landscape",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    alt: "Foggy mountain summit",
    category: "landscape",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    alt: "Ocean wave at beach",
    category: "nature",
  },
]

const categories = ["all", "nature", "landscape"]

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const filteredImages =
    selectedCategory === "all" ? images : images.filter((image) => image.category === selectedCategory)

  const openLightbox = (id: number) => {
    setSelectedImage(id)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = ""
  }

  const getImageIndex = () => {
    if (selectedImage === null) return -1
    return filteredImages.findIndex((img) => img.id === selectedImage)
  }

  const navigateLightbox = (direction: "next" | "prev") => {
    const currentIndex = getImageIndex()
    if (currentIndex === -1) return

    let newIndex
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredImages.length
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length
    }

    setSelectedImage(filteredImages[newIndex].id)
  }

  return (
    <div className="animate-fade-in">
      <section className="py-16 md:py-24">
        <div className="sakura-container">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Gallery</h1>
            <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
            <p className="mx-auto mt-6 max-w-2xl text-gray-600">
              Browse our collection of beautiful photographs showcasing our unique style and vision.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-10 flex justify-center">
            <div className="flex space-x-2 rounded-full border border-gray-200 p-1">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`rounded-full px-6 py-2 transition-colors ${
                    selectedCategory === category ? "bg-sakura-pink text-white" : "hover:bg-sakura-light-pink"
                  }`}
                  onClick={() => setSelectedCategory(category)}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="cursor-pointer overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                onClick={() => openLightbox(image.id)}>
                <div className="relative h-72">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox */}
          {selectedImage !== null && getImageIndex() !== -1 && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
              onClick={closeLightbox}>
              <button className="absolute right-4 top-4 text-white hover:text-sakura-pink" onClick={closeLightbox}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button
                className="absolute left-4 top-1/2 -mt-6 text-white hover:text-sakura-pink"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateLightbox("prev")
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <img
                src={filteredImages[getImageIndex()].src}
                alt={filteredImages[getImageIndex()].alt}
                className="max-h-[85vh] max-w-[85vw] object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              <button
                className="absolute right-4 top-1/2 -mt-6 text-white hover:text-sakura-pink"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateLightbox("next")
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Gallery
